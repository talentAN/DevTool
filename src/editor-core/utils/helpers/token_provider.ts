import { IEditSession, TokenInfo as BraceTokenInfo } from "brace";
import { TokensProvider, Token, Position } from "../../types";

// Brace's token information types are not accurate.
interface TokenInfo extends BraceTokenInfo {
  type: string;
}

const _genToken = (
  lineNumber: number,
  column: number,
  token: TokenInfo
): Token => ({
  type: token.type,
  value: token.value,
  position: {
    lineNumber,
    column,
  },
});

const _genTokens = (lineNumber: number, tokens: TokenInfo[]): Token[] => {
  let acc = "";
  return tokens.map((token) => {
    const column = acc.length + 1;
    acc += token.value;
    return _genToken(lineNumber, column, token);
  });
};

const _extractTokenFromAceTokenRow = (
  lineNumber: number,
  column: number,
  aceTokens: TokenInfo[]
) => {
  let acc = "";
  for (const token of aceTokens) {
    const start = acc.length + 1;
    acc += token.value;
    const end = acc.length;
    if (column < start) continue;
    if (column > end + 1) continue;
    return _genToken(lineNumber, start, token);
  }
  return null;
};

export class AceTokensProvider implements TokensProvider {
  constructor(private readonly session: IEditSession) {}

  getTokens(lineNumber: number): Token[] | null {
    if (lineNumber < 1) return null;

    // Important: must use a .session.getLength because this is a cached value.
    // Calculating line length here will lead to performance issues because this function
    // may be called inside of tight loops.
    const lineCount = this.session.getLength();
    if (lineNumber > lineCount) {
      return null;
    }

    const tokens: TokenInfo[] = this.session.getTokens(lineNumber - 1) as any;
    if (!tokens || !tokens.length) {
      // We are inside of the document but have no tokens for this line. Return an empty
      // array to represent this empty line.
      return [];
    }

    return _genTokens(lineNumber, tokens);
  }

  getTokenAt(pos: Position): Token | null {
    const tokens: TokenInfo[] = this.session.getTokens(
      pos.lineNumber - 1
    ) as any;
    if (tokens) {
      return _extractTokenFromAceTokenRow(pos.lineNumber, pos.column, tokens);
    }
    return null;
  }
}
