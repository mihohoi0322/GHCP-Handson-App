// ⚠️ 検証用 — SQL Injection 脆弱性サンプル
// Semgrep ルール: javascript.lang.security.audit.detect-sql-injection

/**
 * 意図的にSQLインジェクション脆弱性を持つデータアクセス関数。
 * プリペアドステートメントを使用せず、文字列連結でクエリを構築。
 */

interface DatabaseClient {
  query(sql: string): Promise<unknown[]>;
}

// パターン1: 文字列連結による SQL 構築
export async function findUserByName(
  db: DatabaseClient,
  userName: string
): Promise<unknown> {
  // 🚨 脆弱: ユーザー入力を直接 SQL に連結
  const sql = "SELECT * FROM users WHERE name = '" + userName + "'";
  const results = await db.query(sql);
  return results[0];
}

// パターン2: テンプレートリテラルによる SQL 構築
export async function findTodosByUserId(
  db: DatabaseClient,
  userId: string
): Promise<unknown[]> {
  // 🚨 脆弱: テンプレートリテラルでユーザー入力を埋め込み
  const sql = `SELECT * FROM todos WHERE user_id = '${userId}' ORDER BY created_at DESC`;
  return db.query(sql);
}

// パターン3: 動的なテーブル名・カラム名
export async function searchTodos(
  db: DatabaseClient,
  column: string,
  value: string
): Promise<unknown[]> {
  // 🚨 脆弱: カラム名もユーザー入力から構築
  const sql = `SELECT * FROM todos WHERE ${column} LIKE '%${value}%'`;
  return db.query(sql);
}
