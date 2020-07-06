import { Position } from "./core_editor";

export interface Token {
  /**
   * The value of the token.
   *
   * Can be an empty string.
   */
  value: string;

  /**
   * The type of the token. E.g., "whitespace". All of the types are
   * enumerated by the token lexer.
   */
  type: string;

  /**
   * The position of the first character of the token.
   */
  position: Position;
}

// change the TokenType in code later
export enum TokenType {
  "variable" = "variable",
  "whitespace" = "whitespace",
  "paren.lparen" = "paren.lparen", // (左括号)
  "paren.rparen" = "paren.rparen", // (右括号)
  // (punctuation: 标点符号
  "punctuation.start_triple_quote" = "punctuation.start_triple_quote", // (引用开始)
  "punctuation.end_triple_quote" = "punctuation.end_triple_quote", // (引用结束)
  "punctuation.comma" = "punctuation.comma", // (逗号)
  "punctuation.colon" = "punctuation.colon", // (冒号)
  "string" = "string",
  "constant.numeric" = "constant.numeric",
  "constant.language.boolean" = "constant.language.boolean",
  "text" = "text",
}
