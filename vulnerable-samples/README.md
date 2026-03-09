# 脆弱性サンプルコード

> **⚠️ このディレクトリのコードは検証目的のみで作成されています。本番環境には絶対にデプロイしないでください。**

## 目的

SAST（Semgrep）→ Code Scanning アラート → Copilot Coding Agent 自動修正の E2E フローを検証するために、意図的に脆弱なコードを配置しています。

## 含まれる脆弱性

| ファイル | 脆弱性タイプ | OWASP カテゴリ |
|----------|-------------|----------------|
| `xss-vulnerable.ts` | Cross-Site Scripting (XSS) | A03:2021 Injection |
| `sql-injection.ts` | SQL Injection | A03:2021 Injection |
| `path-traversal.ts` | Path Traversal | A01:2021 Broken Access Control |
| `hardcoded-secret.ts` | ハードコードされた秘密情報 | A02:2021 Cryptographic Failures |
| `eval-usage.ts` | コードインジェクション (eval) | A03:2021 Injection |
| `insecure-redirect.ts` | オープンリダイレクト | A01:2021 Broken Access Control |

## 検証フロー

1. `feat/security-scan-poc` ブランチにこれらのファイルを push
2. Semgrep ワークフローが自動実行 → SARIF 生成 → Code Scanning アラート登録
3. `alert-to-issue.yml` ワークフローが Issue を自動起票（copilot assign）
4. Copilot Coding Agent が修正 PR を自動作成
5. 修正内容を評価
