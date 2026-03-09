---
name: "🔒 Security Fix Request (Copilot Agent)"
about: "SAST で検出されたセキュリティ脆弱性の修正依頼（Copilot Coding Agent 用）"
title: "[Security] "
labels: ["security", "copilot-fix"]
assignees: ["copilot"]
---

<!-- 
  このテンプレートは Copilot Coding Agent に自動修正を依頼するための Issue テンプレートです。
  Agent は Issue 本文をプロンプトとして修正 PR を生成します。
  本文の書き方が修正精度に直結するため、できるだけ具体的に記載してください。
-->

## 脆弱性概要

**重要度**: 
**検出ツール**: Semgrep
**検出ルール**: `rule-id-here`
**ファイル**: `path/to/file.ts` (L行番号)

## 問題の説明

<!-- 脆弱性の内容を具体的に記載 -->

## 修正依頼

以下の方針でセキュリティ脆弱性を修正してください。

1. **対象ファイル**: `path/to/file.ts`
2. **修正方針**:
   - <!-- 具体的な修正内容を記載 -->
3. **制約事項**:
   - 既存のテストが壊れないようにすること
   - TypeScript の strict モードに準拠すること
   - 関連する型定義も必要に応じて更新すること

## 期待される修正

- [ ] 脆弱性が解消されていること
- [ ] 既存の機能が壊れていないこと
- [ ] 新しいテストが追加されていること（可能であれば）

## 参考情報

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
