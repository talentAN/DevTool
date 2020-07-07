import { CoreEditor, Token } from "../../types";
import { TokenIterator } from "./token_iterator";

// TODO: really need so complacated ?
// I'm refactored base this mode, but later I think it should be replaced

// 用位运算进行校验, 比if else之类的方便超级多
// & 运算用于校验权限, | 运算用来赋予权限
const MODE = {
  REQUEST_START: 2,
  IN_REQUEST: 4,
  MULTI_DOC_CUR_DOC_END: 8, // 一个post路径带着多个不同的参数请求
  REQUEST_END: 16,
  BETWEEN_REQUESTS: 32, // empty line, no matter out of range or between two requests
};

export default class RowParser {
  MODE = MODE;
  constructor(private readonly editor: CoreEditor) {}

  getRowParseMode(lineNumber = this.editor.getCurrentPosition().lineNumber) {
    const linesCount = this.editor.getLineCount();
    const mode = this.editor.getLineState(lineNumber);
    let line = (this.editor.getLineValue(lineNumber) || "").trim();

    let isEmpty =
      lineNumber > linesCount || // out of range
      lineNumber < 1 || // out of range
      !mode || // invalid mode
      !line || // empty line
      line[0] === "#"; // comment line
    if (isEmpty) {
      // console.info("xxx => 1");
      return MODE.BETWEEN_REQUESTS;
    }
    // when will get "start-sql"? curl? May useless for us not verify yet.
    // if is valid mode, and not start, it must be body.
    if (mode !== "start" && mode !== "start-sql") {
      // console.info("xxx => 2");
      return MODE.IN_REQUEST;
    }
    // check for a multi doc request (must start a new json doc immediately after this one end.
    if (line.indexOf("}", line.length - 1) >= 0) {
      // console.info("xxx => 4");
      return _handleEndOfParams.call(this, lineNumber, linesCount);
    }
    // check for single line requests
    // console.info("xxx => 5");
    return _handleSingleLineRequest.call(this, lineNumber, linesCount);
  }

  rowPredicate(lineNumber: number | undefined, editor: CoreEditor, value: any) {
    const mode: number = this.getRowParseMode(lineNumber);
    return (mode & value) > 0;
  }

  isEndRequestRow(row?: number, _e?: CoreEditor) {
    const editor = _e || this.editor;
    return this.rowPredicate(row, editor, MODE.REQUEST_END);
  }

  isRequestEdge(row?: number, _e?: CoreEditor) {
    const editor = _e || this.editor;
    // eslint-disable-next-line no-bitwise
    return this.rowPredicate(
      row,
      editor,
      MODE.REQUEST_END | MODE.REQUEST_START
    );
  }

  isStartRequestRow(row?: number, _e?: CoreEditor) {
    const editor = _e || this.editor;
    return this.rowPredicate(row, editor, MODE.REQUEST_START);
  }

  isInBetweenRequestsRow(row?: number, _e?: CoreEditor) {
    const editor = _e || this.editor;
    return this.rowPredicate(row, editor, MODE.BETWEEN_REQUESTS);
  }

  isInRequestsRow(row?: number, _e?: CoreEditor) {
    const editor = _e || this.editor;
    return this.rowPredicate(row, editor, MODE.IN_REQUEST);
  }

  isMultiDocDocEndRow(row?: number, _e?: CoreEditor) {
    const editor = _e || this.editor;
    return this.rowPredicate(row, editor, MODE.MULTI_DOC_CUR_DOC_END);
  }

  isEmptyToken(tokenOrTokenIter: TokenIterator | Token | null) {
    const token =
      tokenOrTokenIter && (tokenOrTokenIter as TokenIterator).getCurrentToken
        ? (tokenOrTokenIter as TokenIterator).getCurrentToken()
        : tokenOrTokenIter;
    return !token || (token as Token).type === "whitespace";
  }

  isUrlOrMethodToken(tokenOrTokenIter: TokenIterator | Token) {
    const t =
      (tokenOrTokenIter as TokenIterator)?.getCurrentToken() ??
      (tokenOrTokenIter as Token);
    return t && t.type && (t.type === "method" || t.type.indexOf("url") === 0);
  }

  nextNonEmptyToken(tokenIter: TokenIterator) {
    let t = tokenIter.stepForward();
    while (t && this.isEmptyToken(t)) {
      t = tokenIter.stepForward();
    }
    return t;
  }

  prevNonEmptyToken(tokenIter: TokenIterator) {
    let t = tokenIter.stepBackward();
    // empty rows return null token.
    while (
      (t || tokenIter.getCurrentPosition().lineNumber > 1) &&
      this.isEmptyToken(t)
    )
      t = tokenIter.stepBackward();
    return t;
  }
}

function _handleEndOfParams(lineNumber: number, linesCount: number): number {
  lineNumber++;
  if (lineNumber <= linesCount) {
    let line = (this.editor.getLineValue(lineNumber) || "").trim();
    // next line is another doc in a multi doc
    if (line.indexOf("{") === 0) {
      // console.info("xxx => 6");
      return MODE.MULTI_DOC_CUR_DOC_END | MODE.IN_REQUEST;
    }
  }
  // console.info("xxx => 7");
  return MODE.REQUEST_END | MODE.MULTI_DOC_CUR_DOC_END; // end of request
}
function _handleSingleLineRequest(
  lineNumber: number,
  linesCount: number
): number {
  lineNumber++;
  if (lineNumber > linesCount) {
    // console.info("xxx => 7");
    return MODE.REQUEST_START | MODE.REQUEST_END;
  }
  const line = (this.editor.getLineValue(lineNumber) || "").trim();
  // console.info(line.indexOf("{") === 0 ? "xxx => 8" : "xxx => 9");
  return line.indexOf("{") === 0
    ? MODE.REQUEST_START
    : MODE.REQUEST_START | MODE.REQUEST_END;
}
