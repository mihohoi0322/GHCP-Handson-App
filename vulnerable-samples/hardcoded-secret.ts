// ⚠️ 検証用 — ハードコードされた秘密情報サンプル
// Semgrep ルール: generic.secrets.security.detected-generic-secret
//                 javascript.lang.security.audit.detect-non-literal-regexp

/**
 * 意図的にハードコードされた秘密情報を含むモジュール。
 * 環境変数やシークレット管理サービスを使用していない。
 */

// パターン1: API キーのハードコード
const API_KEY = 'sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234';

// パターン2: データベース接続文字列のハードコード
const DATABASE_URL =
  'postgresql://admin:SuperSecret123!@prod-db.example.com:5432/myapp';

// パターン3: JWT シークレットのハードコード
const JWT_SECRET = 'my-super-secret-jwt-signing-key-do-not-share';

export function getApiHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  };
}

export function getDatabaseConfig(): { connectionString: string } {
  return {
    connectionString: DATABASE_URL,
  };
}

export function getJwtSecret(): string {
  return JWT_SECRET;
}
