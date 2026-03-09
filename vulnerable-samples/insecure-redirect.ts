// ⚠️ 検証用 — オープンリダイレクト脆弱性サンプル
// Semgrep ルール: javascript.lang.security.audit.detect-open-redirect

/**
 * 意図的にオープンリダイレクト脆弱性を持つリダイレクト処理。
 * ユーザー提供のURLを検証せずにリダイレクトに使用。
 */

interface ServerResponse {
  writeHead(statusCode: number, headers: Record<string, string>): void;
  end(): void;
}

interface IncomingRequest {
  url?: string;
}

// パターン1: クエリパラメータの URL にそのままリダイレクト
export function handleRedirect(req: IncomingRequest, res: ServerResponse): void {
  const url = new URL(req.url || '', 'http://localhost');
  const redirectTo = url.searchParams.get('redirect') || '/';

  // 🚨 脆弱: ユーザー指定の URL を検証せずにリダイレクト
  // 攻撃例: ?redirect=https://evil.example.com
  res.writeHead(302, { Location: redirectTo });
  res.end();
}

// パターン2: next パラメータを検証せずに使用
export function loginRedirect(
  res: ServerResponse,
  nextUrl: string
): void {
  // 🚨 脆弱: nextUrl がどこを指しているか検証していない
  res.writeHead(302, { Location: nextUrl });
  res.end();
}

// パターン3: Referer ヘッダーを信頼してリダイレクト
export function backRedirect(
  res: ServerResponse,
  referer: string | undefined
): void {
  // 🚨 脆弱: Referer ヘッダーは偽装可能
  const target = referer || '/';
  res.writeHead(302, { Location: target });
  res.end();
}
