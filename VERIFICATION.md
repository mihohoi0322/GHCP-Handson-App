# E2E 検証手順: SAST → Code Scanning → Copilot Coding Agent 自動修正

## 前提条件チェックリスト

実行前に以下を確認してください。

- [ ] **Code Scanning (GHAS) が有効**: Settings → Security → Code scanning
- [ ] **Copilot Coding Agent が有効**: Settings → Copilot → Coding agent → Enabled
- [ ] **Org ポリシー**: Copilot Coding Agent が Organization レベルで許可されている
- [ ] **`code_scanning_alert` イベント**: プランで利用可能か確認（GHAS が必要）

---

## Phase 1: Copilot Coding Agent 動作確認（手動テスト）

### 1.1 検証ブランチの作成と脆弱性コードの push

```bash
# ブランチ作成
git checkout -b feat/security-scan-poc

# 脆弱性サンプルは既に vulnerable-samples/ に配置済み
git add vulnerable-samples/
git add .github/workflows/semgrep-scan.yml
git add .github/workflows/alert-to-issue.yml
git add .github/ISSUE_TEMPLATE/security-fix-request.md
git commit -m "feat: add security scan POC files for E2E verification"
git push origin feat/security-scan-poc
```

### 1.2 手動で Issue を作成して Copilot Agent をテスト

GitHub 上で Issue を作成し、以下を検証:

1. **Issue タイトル**: `[Security] HIGH: eval usage in vulnerable-samples/eval-usage.ts`
2. **Issue 本文**（以下をコピー）:

```markdown
## 🔴 セキュリティ脆弱性: eval の使用

**重要度**: HIGH
**ファイル**: `vulnerable-samples/eval-usage.ts`

### 修正依頼

`vulnerable-samples/eval-usage.ts` の以下の脆弱性を修正してください。

1. **L16: `eval(expression)`** — ユーザー入力を eval で実行しており、任意コード実行が可能
   - 修正方針: 安全な式パーサー（例: mathjs）に置き換えるか、許可リスト方式で式を検証

2. **L22: `new Function(code)`** — Function コンストラクタへのユーザー入力
   - 修正方針: eval と同等の危険性があるため、関数を削除または安全な代替手段に置き換え

3. **L28: `execSync(`id ${username}`)`** — コマンドインジェクション
   - 修正方針: child_process を使用せず、安全な API に置き換え。やむを得ない場合は execFileSync + 引数配列を使用

4. **L33: `setTimeout(taskCode, delayMs)`** — setTimeout に文字列を渡すと eval 相当
   - 修正方針: 文字列ではなく関数を渡すように変更

### 制約
- TypeScript strict モード準拠
- 既存ファイルの型定義を壊さない
```

3. **Assignees**: `copilot` を設定
4. **結果確認**: Copilot が自動で PR を作成するか確認

### 1.3 修正精度の評価

生成された PR で以下を確認:
- [ ] eval が安全な代替手段に置き換えられているか
- [ ] execSync が execFileSync + 引数の配列形式になっているか
- [ ] setTimeout が関数渡しに変更されているか
- [ ] TypeScript の型エラーがないか

---

## Phase 2: Semgrep スキャン → Code Scanning アラート

### 2.1 Semgrep ワークフローの実行

`feat/security-scan-poc` を push した時点で `.github/workflows/semgrep-scan.yml` が自動実行されます。

確認ポイント:
- [ ] Actions タブで「Semgrep SAST Scan」が実行されている
- [ ] ワークフローが成功完了する（スキャン結果に関わらず SARIF アップロードまで到達）
- [ ] Artifacts に `semgrep-sarif` がアップロードされている

### 2.2 Code Scanning アラートの確認

- [ ] Security タブ → Code scanning alerts にアラートが表示される
- [ ] 各脆弱性タイプ（XSS, SQLi, Path Traversal, Secret, eval, Redirect）が検出されている
- [ ] アラートの severity が表示されている

**トラブルシューティング**:
- アラートが表示されない → GHAS が無効の可能性。Settings → Security で確認
- SARIF アップロードエラー → `security-events: write` パーミッションを確認

---

## Phase 3: アラート → Issue 自動起票

### 3.1 alert-to-issue ワークフローの確認

Code Scanning アラートが登録されると `.github/workflows/alert-to-issue.yml` がトリガーされます。

確認ポイント:
- [ ] `code_scanning_alert` イベントでワークフローが起動する
- [ ] Critical/High アラートに対して Issue が自動作成される
- [ ] Issue の Assignees に `copilot` が設定されている
- [ ] Issue にラベル `security`, `code-scanning`, `copilot-fix` が付与されている
- [ ] Medium アラートには `copilot-fix` ラベルなし & copilot assign なし

**トラブルシューティング**:
- `code_scanning_alert` が発火しない → GHAS / Enterprise プラン要件を確認
- copilot を assign できない → Copilot Coding Agent の有効化を確認
- 代替手段: `workflow_run` で Semgrep 完了後に定期的にアラート API をポーリング

### 3.2 代替案: code_scanning_alert が使えない場合

`code_scanning_alert` イベントが利用できない場合（プラン制約等）、以下の代替ワークフローを検討:

```yaml
# semgrep-scan.yml の末尾に追加: スキャン完了後に直接 Issue 作成
- name: Parse SARIF and create issues
  uses: actions/github-script@v7
  with:
    script: |
      const fs = require('fs');
      const sarif = JSON.parse(fs.readFileSync('semgrep-results.sarif', 'utf8'));
      // SARIF を解析して Issue を作成するロジック
```

---

## Phase 4: E2E 統合テスト

### 4.1 全フロー実行

1. 新しい脆弱性コードを追加して PR を作成
2. Semgrep スキャン → SARIF アップロード → Code Scanning アラート登録
3. アラート → Issue 自動起票 → copilot assign
4. Copilot Coding Agent → 修正 PR 自動作成

### 4.2 評価観点

| 観点 | 評価項目 |
|------|---------|
| 検出精度 | Semgrep が全6種類の脆弱性を検出するか |
| Issue 品質 | Issue 本文が修正に十分なコンテキストを含むか |
| 修正精度 | Copilot が正しく脆弱性を修正するか |
| レイテンシ | アラート → Issue → PR の所要時間 |
| 誤検知 | False positive の割合 |

### 4.3 Coverity への差し替え

本検証では Semgrep を使用していますが、Coverity に切り替える場合は以下のみ変更:

1. `.github/workflows/semgrep-scan.yml` の Semgrep 実行部分を Coverity CLI に置き換え
2. SARIF 出力形式は互換性があるため、`upload-sarif` ステップはそのまま使用可能
3. `alert-to-issue.yml` は変更不要

```yaml
# Coverity の場合のスキャンステップ例
- name: Run Coverity scan
  run: |
    cov-analyze --dir idir --security --webapp
    cov-format-sarif --output coverity-results.sarif
```

---

## ファイル一覧

| ファイル | 用途 |
|---------|------|
| `.github/workflows/semgrep-scan.yml` | Semgrep SAST スキャン + SARIF アップロード |
| `.github/workflows/alert-to-issue.yml` | Code Scanning アラート → Issue 自動起票 |
| `.github/ISSUE_TEMPLATE/security-fix-request.md` | 手動 Issue 作成用テンプレート |
| `vulnerable-samples/*.ts` | 検証用脆弱性サンプルコード（6ファイル） |
| `VERIFICATION.md` | この検証手順ドキュメント |
