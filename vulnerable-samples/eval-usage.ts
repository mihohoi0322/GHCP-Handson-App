// ⚠️ 検証用 — eval / コードインジェクション脆弱性サンプル
// Semgrep ルール: javascript.lang.security.audit.detect-eval-with-expression
//                 javascript.lang.security.detect-child-process

import { execSync } from 'child_process';

/**
 * 意図的にコードインジェクション脆弱性を持つ関数群。
 * eval や child_process にユーザー入力を直接渡している。
 */

// パターン1: eval でユーザー入力を実行
export function calculateExpression(expression: string): unknown {
  // 🚨 脆弱: ユーザー入力を eval で実行 — 任意コード実行が可能
  return eval(expression);
}

// パターン2: Function コンストラクタでユーザー入力からコード生成
export function createDynamicFunction(code: string): () => unknown {
  // 🚨 脆弱: Function コンストラクタへのユーザー入力 — eval と同等の危険性
  return new Function(code) as () => unknown;
}

// パターン3: child_process にユーザー入力を渡す（コマンドインジェクション）
export function getUserInfo(username: string): string {
  // 🚨 脆弱: シェルコマンドにユーザー入力を直接埋め込み
  const result = execSync(`id ${username}`);
  return result.toString();
}

// パターン4: setTimeout に文字列として渡す（eval 相当）
export function scheduleTask(taskCode: string, delayMs: number): void {
  // 🚨 脆弱: setTimeout に文字列を渡すと eval と同様に実行される
  setTimeout(taskCode, delayMs);
}
