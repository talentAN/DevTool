/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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

enum TokenType {
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
