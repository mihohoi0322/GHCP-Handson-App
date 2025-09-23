# コードレビューガイドライン
コードレビューに関して、以下のガイドラインに従ってください。

## 制約条件
- レビューコメントは日本語で記載。

## レビュー優先度
1) セキュリティ 2) 正確性（型/境界） 3) Next.jsベストプラクティス 4) パフォーマンス/アクセシビリティ

## TypeScript
- `strict` 前提・`any` 回避、必要時は `unknown`＋型ガード、設定オブジェクトは `satisfies` を活用。
- public API はJSDocを付け、破壊的変更はCHANGELOGに記載。

## Next.js 基本
- 既定は **Server Components**、`use client` は相互作用が必要な箇所のみ。:contentReference[oaicite:0]{index=0}
- **データ取得はサーバ優先**、`fetch` の `cache`/`revalidate` を明示、無効化は `revalidatePath`/`revalidateTag` を使用。:contentReference[oaicite:1]{index=1}

## 画像
- 生 `<img>` ではなく **`next/image`** を使用し、`alt` と `sizes`（or `width/height`）を適切に設定。:contentReference[oaicite:2]{index=2}
- 外部画像は `next.config.js` の `images.remotePatterns` に許可ドメインを登録。:contentReference[oaicite:3]{index=3}

## セキュリティ
- すべての入力をスキーマで検証、`dangerouslySetInnerHTML` は原則禁止、秘密情報はクライアントに露出させない。

## PR チェック
- 変更理由/影響/テストをPR本文に記載、ESLint/型エラーは0、可能なら *Suggested changes* で具体案を提示。
