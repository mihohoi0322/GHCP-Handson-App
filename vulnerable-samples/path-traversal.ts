// ⚠️ 検証用 — Path Traversal 脆弱性サンプル
// Semgrep ルール: javascript.lang.security.audit.path-traversal

import * as fs from 'fs';
import * as path from 'path';

/**
 * 意図的にパストラバーサル脆弱性を持つファイル操作関数。
 * ユーザー入力のパスを検証せずにファイルシステムにアクセス。
 */

const UPLOAD_DIR = '/app/uploads';

// パターン1: ユーザー指定のファイル名で直接読み取り
export function readUserFile(fileName: string): string {
  // 🚨 脆弱: ../../../etc/passwd 等でディレクトリ外のファイルにアクセス可能
  const filePath = path.join(UPLOAD_DIR, fileName);
  return fs.readFileSync(filePath, 'utf-8');
}

// パターン2: ユーザー指定のパスにファイルを書き込み
export function saveUserFile(fileName: string, content: string): void {
  // 🚨 脆弱: ../../ で任意のパスに書き込み可能
  const filePath = `${UPLOAD_DIR}/${fileName}`;
  fs.writeFileSync(filePath, content);
}

// パターン3: ユーザー指定のパスを検証なしで削除
export function deleteUserFile(fileName: string): void {
  // 🚨 脆弱: パストラバーサルで任意のファイル削除が可能
  const filePath = path.resolve(UPLOAD_DIR, fileName);
  fs.unlinkSync(filePath);
}
