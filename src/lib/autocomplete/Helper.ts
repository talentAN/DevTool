import { Token } from "../../types";

export const isUrlParamsToken = (token: Token | null): boolean => {
  switch ((token || {}).type) {
    case "url.param":
    case "url.equal":
    case "url.value":
    case "url.questionmark":
    case "url.amp":
      return true;
    default:
      return false;
  }
};
export const isURLToken = (token: Token): boolean =>
  token.type.indexOf("url") !== -1;
export const isMethodToken = (token: Token): boolean => token.type === "method";
export const isWhitespaceToken = (token: Token): boolean =>
  token.type === "whitespace";

export const getTokenType = (token: Token) => {
  switch (token.type) {
    case "method":
      return "method";
    default:
      return "";
  }
};
