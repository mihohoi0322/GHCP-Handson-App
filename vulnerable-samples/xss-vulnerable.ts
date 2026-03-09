// ⚠️ 検証用 — XSS 脆弱性サンプル
// Semgrep ルール: typescript.react.security.audit.react-dangerouslysetinnerhtml
//                 javascript.browser.security.insufficient-input-sanitization

/**
 * 意図的にXSS脆弱性を持つユーティリティ関数。
 * innerHTML を直接使用し、ユーザー入力をサニタイズしていない。
 */

// パターン1: dangerouslySetInnerHTML にユーザー入力を直接渡す
export function renderUserComment(comment: string): { __html: string } {
  // 🚨 脆弱: ユーザー入力をサニタイズせずに HTML として描画
  return { __html: comment };
}

// パターン2: DOM に直接 innerHTML を設定
export function insertHtmlContent(elementId: string, userInput: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    // 🚨 脆弱: innerHTML にユーザー入力を直接設定
    element.innerHTML = userInput;
  }
}

// パターン3: URL パラメータをサニタイズせずにリンクに使用
export function createLink(userProvidedUrl: string): string {
  // 🚨 脆弱: javascript: スキーム等を検証していない
  return `<a href="${userProvidedUrl}">Click here</a>`;
}
