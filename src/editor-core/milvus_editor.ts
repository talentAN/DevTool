// brace is a very powerful eidtor base on ace while its apis are also complex.
// So we wrappe some apis which are frequently used, it'll be better for us to use them.

// Those apis are basicly for get eidtor's status and content we need.
// After get contents, we need to get standard request in json or curl format.
// So wo define other methods base on these wrappers to operat request

import ace from "brace";
import { Editor as IAceEditor, IEditSession as IAceEditSession } from "brace";
import _ from "lodash";
import { collapseLiteralStrings } from "../lib/json_xjson_translation_tools";
import {
  CoreEditor,
  Position,
  Range,
  Token,
  TokensProvider,
  EditorEvent,
  AutoCompleterFunction,
} from "../types";
import { AceTokensProvider } from "../lib/ace_token_provider";
import { createTokenIterator } from "../lib/factories";
import Autocomplete from "../lib/autocomplete/autocomplete";
import * as utils from "../lib/utils";
import * as curl from "../utils/helpers/Curl";
import { smartResize } from "../utils/helpers/Editor";
import RowParser from "../utils/helpers/RowParser";
import * as InputMode from "./mode/input";
const _AceRange = ace.acequire("ace/range").Range;

export class MilvusEditor implements CoreEditor {
  private _aceOnPaste: any;
  resize: () => void;
  currentReqRange: any;
  parser: any;
  autocomplete: any;

  constructor(private readonly editor: IAceEditor) {
    this.editor.setShowPrintMargin(false);
    // init Editor style, if we want support other style later, could move these in other file
    const session = this.editor.getSession();
    session.setMode(new InputMode.Mode() as any);
    (session as any).setFoldStyle("markbeginend");
    session.setTabSize(2);
    session.setUseWrapMode(true);

    // Keep current top line in view when resizing to avoid losing user context
    this.resize = smartResize(this.editor);

    // We want it to be formatted to standard json automaticly when paste a curl string on editor.
    // So we intercept ace on paste handler.
    this._aceOnPaste = this.editor.onPaste;
    this.editor.onPaste = this._formatPaste.bind(this);

    this.editor.setOptions({
      enableBasicAutocompletion: true,
    });
    this.editor.$blockScrolling = Infinity;
    this.editor.focus();

    // register eventsHandlers, autocomplete and other functions
    this.currentReqRange = null;
    this.parser = new RowParser(this);
    this.autocomplete = new (Autocomplete as any)({
      editor: this,
      parser: this.parser,
    });
    this.registerAutocompleter(this.autocomplete);
    this.on("tokenizerUpdate", this.highlightCurrentRequests.bind(this));
    this.on("changeCursor", this.highlightCurrentRequests.bind(this));
  }

  // dirty check for tokenizer state, uses a lot less cycles than listening for tokenizerUpdate
  // TODO: didn't verify yet
  waitForLatestTokens(): Promise<void> {
    return new Promise((resolve) => {
      const session = this.editor.getSession();
      const checkInterval = 25;

      const check = () => {
        // If the bgTokenizer doesn't exist, we can assume that the underlying editor has been
        // turn down, e.g. by closing the History tab, and we don't need to do anything further.
        if (session.bgTokenizer) {
          // Wait until the bgTokenizer is done running before executing the callback.
          if ((session.bgTokenizer as any).running) {
            setTimeout(check, checkInterval);
          } else {
            resolve();
          }
        }
      };

      setTimeout(check, 0);
    });
  }

  // wrappers for Brace start
  getLineState(lineNumber: number) {
    const session = this.editor.getSession();
    return session.getState(lineNumber - 1);
  }

  // wrapper for brace
  getValueInRange(range: Range): string {
    return this.editor.getSession().getTextRange(_rangeToAceRange(range));
  }

  getTokenProvider(): TokensProvider {
    return new AceTokensProvider(this.editor.getSession());
  }

  // wrapper for brace
  getValue(): string {
    return this.editor.getValue();
  }

  async setValue(text: string, forceRetokenize: boolean): Promise<void> {
    const session = this.editor.getSession();
    session.setValue(text);
    if (forceRetokenize) {
      await this.forceRetokenize();
    }
  }

  getLineValue(lineNumber: number): string {
    const session = this.editor.getSession();
    return session.getLine(lineNumber - 1);
  }

  getCurrentPosition(): Position {
    const cursorPosition = this.editor.getCursorPosition();
    return {
      lineNumber: cursorPosition.row + 1,
      column: cursorPosition.column + 1,
    };
  }

  clearSelection(): void {
    this.editor.clearSelection();
  }

  getTokenAt(pos: Position): Token | null {
    const provider = this.getTokenProvider();
    return provider.getTokenAt(pos);
  }

  insert(valueOrPos: string | Position, value?: string): void {
    if (typeof valueOrPos === "string") {
      this.editor.insert(valueOrPos);
      return;
    }
    const document = this.editor.getSession().getDocument();
    document.insert(
      {
        column: valueOrPos.column - 1,
        row: valueOrPos.lineNumber - 1,
      },
      value || ""
    );
  }
  // wrapper
  moveCursorToPosition(pos: Position): void {
    this.editor.moveCursorToPosition({
      row: pos.lineNumber - 1,
      column: pos.column - 1,
    });
  }

  replace(range: Range, value: string): void {
    const session = this.editor.getSession();
    session.replace(_rangeToAceRange(range), value);
  }

  getLines(startLine: number, endLine: number): string[] {
    const session = this.editor.getSession();
    return session.getLines(startLine - 1, endLine - 1);
  }

  replaceRange(range: Range, value: string) {
    const pos = this.editor.getCursorPosition();
    this.editor.getSession().replace(_rangeToAceRange(range), value);

    const maxRow = Math.max(
      range.start.lineNumber - 1 + value.split("\n").length - 1,
      1
    );
    pos.row = Math.min(pos.row, maxRow);
    this.editor.moveCursorToPosition(pos);
    // ACE UPGRADE - check if needed - at the moment the above may trigger a selection.
    this.editor.clearSelection();
  }
  // wrapper on Brace
  getSelectionRange() {
    const result = this.editor.getSelectionRange();
    return {
      start: {
        lineNumber: result.start.row + 1,
        column: result.start.column + 1,
      },
      end: {
        lineNumber: result.end.row + 1,
        column: result.end.column + 1,
      },
    };
  }
  // wrapper on Brace
  getLineCount() {
    // Only use this function to return line count as it uses
    // a cache.
    return this.editor.getSession().getLength();
  }

  addMarker(range: Range) {
    return this.editor
      .getSession()
      .addMarker(
        _rangeToAceRange(range),
        "ace_snippet-marker",
        "fullLine",
        false
      );
  }

  removeMarker(ref: any) {
    this.editor.getSession().removeMarker(ref);
  }

  getWrapLimit(): number {
    return this.editor.getSession().getWrapLimit();
  }
  // interface for all events
  on(event: EditorEvent, listener: () => void) {
    switch (event) {
      case "changeCursor":
        this.editor.getSession().selection.on(event, listener);
        break;
      case "changeSelection":
        this.editor.on(event, listener);
        break;
      default:
        this.editor.getSession().on(event, listener);
        break;
    }
  }

  off(event: EditorEvent, listener: () => void) {
    switch (event) {
      case "changeSelection":
        this.editor.off(event, listener);
        break;
      default:
        break;
    }
  }

  isCompleterActive() {
    // Secrets of the arcane here.
    return Boolean(
      (this.editor as any).completer && (this.editor as any).completer.activated
    );
  }

  private forceRetokenize() {
    const session = this.editor.getSession();
    return new Promise((resolve) => {
      // force update of tokens, but not on this thread to allow for ace rendering.
      setTimeout(function () {
        let i;
        for (i = 0; i < session.getLength(); i++) {
          session.getTokens(i);
        }
        resolve();
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/camelcase
  // if we past a curl string, it will be parsed to JSON automaticly, if we don't want this function, just rm code in if
  private _formatPaste(text: string) {
    if (text && curl.detectCURL(text)) {
      const curlInput = curl.parseCURL(text);
      this.editor.insert(curlInput);
      return;
    }
    this._aceOnPaste.call(this.editor, text);
  }

  execCommand(cmd: string) {
    this.editor.execCommand(cmd);
  }

  getContainer(): HTMLDivElement {
    return this.editor.container as HTMLDivElement;
  }

  setStyles(styles: { wrapLines: boolean; fontSize: string }) {
    this.editor.getSession().setUseWrapMode(styles.wrapLines);
    this.editor.container.style.fontSize = styles.fontSize;
  }

  registerKeyboardShortcut(opts: {
    keys: string;
    fn: () => void;
    name: string;
  }): void {
    this.editor.commands.addCommand({
      exec: opts.fn,
      name: opts.name,
      bindKey: opts.keys,
    });
  }

  registerAutocompleter(autocompleter: AutoCompleterFunction): void {
    // Hook into Ace
    // disable standard context based autocompletion.
    // @ts-ignore
    ace.define(
      "ace/autocomplete/text_completer",
      ["require", "exports", "module"],
      function (require: any, exports: any) {
        exports.getCompletions = function (
          innerEditor: any,
          session: any,
          pos: any,
          prefix: any,
          callback: any
        ) {
          callback(null, []);
        };
      }
    );

    const langTools = ace.acequire("ace/ext/language_tools");

    langTools.setCompleters([
      {
        // eslint-disable-next-line
        identifierRegexps: [/[a-zA-Z_0-9\.\$\-\u00A2-\uFFFF]/],
        getCompletions: (
          DO_NOT_USE_1: IAceEditor,
          DO_NOT_USE_2: IAceEditSession,
          pos: { row: number; column: number },
          prefix: string,
          callback: (...args: any[]) => void
        ) => {
          const position: Position = {
            lineNumber: pos.row + 1,
            column: pos.column + 1,
          };
          autocompleter(position, prefix, callback);
        },
      },
    ]);
  }

  highlightCurrentRequests = _.debounce(async () => {
    await this.waitForLatestTokens();
    const expandedRange = await this.expandRangeToRequestEdges();
    if (expandedRange === null && this.currentReqRange === null) {
      return;
    }
    if (
      expandedRange !== null &&
      this.currentReqRange !== null &&
      expandedRange.start.lineNumber ===
        this.currentReqRange.start.lineNumber &&
      expandedRange.end.lineNumber === this.currentReqRange.end.lineNumber
    ) {
      return; // nothing to do..
    }

    if (this.currentReqRange) {
      this.removeMarker(this.currentReqRange.markerRef);
    }

    this.currentReqRange = expandedRange as any;
    if (this.currentReqRange) {
      this.currentReqRange.markerRef = this.addMarker(this.currentReqRange);
    }
  }, 25);

  // split valid requestes start and end line;
  expandRangeToRequestEdges = async (
    range = this.getSelectionRange()
  ): Promise<Range | null> => {
    await this.waitForLatestTokens();

    let startLineNumber = range.start.lineNumber;
    let endLineNumber = range.end.lineNumber;
    const maxLine = Math.max(1, this.getLineCount());

    if (this.parser.isInBetweenRequestsRow(startLineNumber)) {
      /* Do nothing... */
    } else {
      for (; startLineNumber >= 1; startLineNumber--) {
        if (this.parser.isStartRequestRow(startLineNumber)) {
          break;
        }
      }
    }

    if (startLineNumber < 1 || startLineNumber > endLineNumber) {
      return null;
    }
    // move end row to the previous request end if between requests, otherwise walk forward
    if (this.parser.isInBetweenRequestsRow(endLineNumber)) {
      for (; endLineNumber >= startLineNumber; endLineNumber--) {
        if (this.parser.isEndRequestRow(endLineNumber)) {
          break;
        }
      }
    } else {
      for (; endLineNumber <= maxLine; endLineNumber++) {
        if (this.parser.isEndRequestRow(endLineNumber)) {
          break;
        }
      }
    }

    if (endLineNumber < startLineNumber || endLineNumber > maxLine) {
      return null;
    }

    const endColumn =
      (this.getLineValue(endLineNumber) || "").replace(/\s+$/, "").length + 1;
    return {
      start: {
        lineNumber: startLineNumber,
        column: 1,
      },
      end: {
        lineNumber: endLineNumber,
        column: endColumn,
      },
    };
  };

  // helper for getRequestRange, return {lineNumber: curRow,column: 1,}
  prevRequestStart = (rowOrPos?: number | Position): Position => {
    let curRow: number;

    if (rowOrPos == null) {
      curRow = this.getCurrentPosition().lineNumber;
    } else if (_.isObject(rowOrPos)) {
      curRow = (rowOrPos as Position).lineNumber;
    } else {
      curRow = rowOrPos as number;
    }
    while (curRow > 0 && !this.parser.isStartRequestRow(curRow, this)) curRow--;

    return {
      lineNumber: curRow,
      column: 1,
    };
  };
  // helper for getRequestRange, return {lineNumber: curRow,column: 0}
  nextRequestStart = (rowOrPos?: number | Position) => {
    let curRow: number;
    if (rowOrPos == null) {
      curRow = this.getCurrentPosition().lineNumber;
    } else if (_.isObject(rowOrPos)) {
      curRow = (rowOrPos as Position).lineNumber;
    } else {
      curRow = rowOrPos as number;
    }
    const maxLines = this.getLineCount();
    for (; curRow < maxLines - 1; curRow++) {
      if (this.parser.isStartRequestRow(curRow, this)) {
        break;
      }
    }
    return {
      row: curRow,
      column: 0,
    };
  };

  autoIndent = _.debounce(async () => {
    await this.waitForLatestTokens();
    const reqRange = await this.getRequestRange();
    if (!reqRange) {
      return;
    }
    const parsedReq = await this.getRequest();

    if (!parsedReq) {
      return;
    }

    if (parsedReq.data && parsedReq.data.length > 0) {
      let indent = parsedReq.data.length === 1; // unindent multi docs by default
      let formattedData = utils.formatRequestBodyDoc(parsedReq.data, indent);
      if (!formattedData.changed) {
        // toggle.
        indent = !indent;
        formattedData = utils.formatRequestBodyDoc(parsedReq.data, indent);
      }
      parsedReq.data = formattedData.data;

      this.replaceRequestRange(parsedReq, reqRange);
    }
  }, 25);

  // set content
  update = async (data: string, reTokenizeAll = false) => {
    return this.setValue(data, reTokenizeAll);
  };

  replaceRequestRange = (newRequest: any, requestRange: Range) => {
    const text = utils.textFromRequest(newRequest);
    if (requestRange) {
      this.replaceRange(requestRange, text);
    } else {
      // just insert where we are
      this.insert(this.getCurrentPosition(), text);
    }
  };
  // get request range
  getRequestRange = async (lineNumber?: number): Promise<Range | null> => {
    await this.waitForLatestTokens();

    if (this.parser.isInBetweenRequestsRow(lineNumber)) {
      return null;
    }

    const reqStart = this.prevRequestStart(lineNumber);
    const reqEnd = this.nextRequestEnd(reqStart);

    return {
      start: {
        ...reqStart,
      },
      end: {
        ...reqEnd,
      },
    };
  };
  // helper for getRequest. Parse range to single standard single request like {method, data, url, range}
  getRequestInRange = async (range?: Range) => {
    await this.waitForLatestTokens();
    if (!range) {
      return null;
    }
    const request: {
      method: string;
      data: string[];
      url: string | null;
      range: Range;
    } = {
      method: "",
      data: [],
      url: null,
      range,
    };

    const pos = range.start;
    const tokenIter = createTokenIterator({
      editor: this,
      position: pos,
    });
    let t = tokenIter.getCurrentToken();
    if (this.parser.isEmptyToken(t)) {
      // if the row starts with some spaces, skip them.
      t = this.parser.nextNonEmptyToken(tokenIter);
    }
    if (t == null) {
      return null;
    }

    request.method = t.value;
    t = this.parser.nextNonEmptyToken(tokenIter);

    if (!t || t.type === "method") {
      return null;
    }

    request.url = "";

    while (t && t.type && t.type.indexOf("url") === 0) {
      request.url += t.value;
      t = tokenIter.stepForward();
    }
    if (this.parser.isEmptyToken(t)) {
      // if the url row ends with some spaces, skip them.
      t = this.parser.nextNonEmptyToken(tokenIter);
    }
    let bodyStartLineNumber =
      (t ? 0 : 1) + tokenIter.getCurrentPosition().lineNumber; // artificially increase end of docs.
    let dataEndPos: Position;
    while (
      bodyStartLineNumber < range.end.lineNumber ||
      (bodyStartLineNumber === range.end.lineNumber && 1 < range.end.column)
    ) {
      dataEndPos = this.nextDataDocEnd({
        lineNumber: bodyStartLineNumber,
        column: 1,
      });
      const bodyRange: Range = {
        start: {
          lineNumber: bodyStartLineNumber,
          column: 1,
        },
        end: dataEndPos,
      };
      const data = this.getValueInRange(bodyRange)!;
      request.data.push(data.trim());
      bodyStartLineNumber = dataEndPos.lineNumber + 1;
    }
    return request;
  };
  // Parse range to standard requests like [{method, data, url, range},...]
  getRequestsInRange = async (
    range = this.getSelectionRange(),
    includeNonRequestBlocks = false
  ): Promise<any[]> => {
    await this.waitForLatestTokens();
    if (!range) {
      return [];
    }

    const expandedRange = await this.expandRangeToRequestEdges(range);

    if (!expandedRange) {
      return [];
    }

    const requests: any = [];

    let rangeStartCursor = expandedRange.start.lineNumber;
    const endLineNumber = expandedRange.end.lineNumber;

    // move to the next request start (during the second iterations this may not be exactly on a request
    let currentLineNumber = expandedRange.start.lineNumber;

    const flushNonRequestBlock = () => {
      if (includeNonRequestBlocks) {
        const nonRequestPrefixBlock = this.getLines(
          rangeStartCursor,
          currentLineNumber - 1
        ).join("\n");
        if (nonRequestPrefixBlock) {
          requests.push(nonRequestPrefixBlock);
        }
      }
    };

    while (currentLineNumber <= endLineNumber) {
      if (this.parser.isStartRequestRow(currentLineNumber)) {
        flushNonRequestBlock();
        const request = await this.getRequest(currentLineNumber);
        if (!request) {
          // Something has probably gone wrong.
          return requests;
        } else {
          requests.push(request);
          rangeStartCursor = currentLineNumber =
            request.range.end.lineNumber + 1;
        }
      } else {
        ++currentLineNumber;
      }
    }

    flushNonRequestBlock();

    return requests;
  };
  // Parse range to standard request like {method, data, url, range}
  getRequest = async (row?: number) => {
    await this.waitForLatestTokens();
    if (this.parser.isInBetweenRequestsRow(row)) {
      return null;
    }
    const range = await this.getRequestRange(row);
    return this.getRequestInRange(range!);
  };
  // move to the start line
  moveToPreviousRequestEdge = async () => {
    await this.waitForLatestTokens();
    const pos = this.getCurrentPosition();
    for (
      pos.lineNumber--;
      pos.lineNumber > 1 && !this.parser.isRequestEdge(pos.lineNumber);
      pos.lineNumber--
    ) {
      // loop for side effects
    }
    this.moveCursorToPosition({
      lineNumber: pos.lineNumber,
      column: 1,
    });
  };
  // move to the end line
  moveToNextRequestEdge = async (moveOnlyIfNotOnEdge: boolean) => {
    await this.waitForLatestTokens();
    const pos = this.getCurrentPosition();
    const maxRow = this.getLineCount();
    if (!moveOnlyIfNotOnEdge) {
      pos.lineNumber++;
    }
    for (
      ;
      pos.lineNumber < maxRow && !this.parser.isRequestEdge(pos.lineNumber);
      pos.lineNumber++
    ) {
      // loop for side effects
    }
    this.moveCursorToPosition({
      lineNumber: pos.lineNumber,
      column: 1,
    });
  };
  // what relation with nextRequestStart??
  nextRequestEnd = (pos: Position): Position => {
    pos = pos || this.getCurrentPosition();
    const maxLines = this.getLineCount();
    let curLineNumber = pos.lineNumber;
    for (; curLineNumber <= maxLines; ++curLineNumber) {
      const curRowMode = this.parser.getRowParseMode(curLineNumber);
      // eslint-disable-next-line no-bitwise
      if ((curRowMode & this.parser.MODE.REQUEST_END) > 0) {
        break;
      }
      // eslint-disable-next-line no-bitwise
      if (
        curLineNumber !== pos.lineNumber &&
        (curRowMode & this.parser.MODE.REQUEST_START) > 0
      ) {
        break;
      }
    }

    const column =
      (this.getLineValue(curLineNumber) || "").replace(/\s+$/, "").length + 1;

    return {
      lineNumber: curLineNumber,
      column,
    };
  };
  // helper for getRequestInRange
  nextDataDocEnd = (pos: Position): Position => {
    pos = pos || this.getCurrentPosition();
    let curLineNumber = pos.lineNumber;
    const maxLines = this.getLineCount();
    for (; curLineNumber < maxLines; curLineNumber++) {
      const curRowMode = this.parser.getRowParseMode(curLineNumber);
      // eslint-disable-next-line no-bitwise
      if ((curRowMode & this.parser.MODE.REQUEST_END) > 0) {
        break;
      }
      // eslint-disable-next-line no-bitwise
      if ((curRowMode & this.parser.MODE.MULTI_DOC_CUR_DOC_END) > 0) {
        break;
      }
      // eslint-disable-next-line no-bitwise
      if (
        curLineNumber !== pos.lineNumber &&
        (curRowMode & this.parser.MODE.REQUEST_START) > 0
      ) {
        break;
      }
    }

    const column =
      (this.getLineValue(curLineNumber) || "").length +
      1; /* Range goes to 1 after last char */

    return {
      lineNumber: curLineNumber,
      column,
    };
  };
  // get requests in curl string like [str,...]
  getRequestsAsCURL = async (
    elasticsearchBaseUrl: string,
    range?: Range
  ): Promise<string> => {
    const requests = await this.getRequestsInRange(range, true);
    const result = _.map(requests, (req) => {
      if (typeof req === "string") {
        // no request block
        return req;
      }

      const esPath = req.url;
      const esMethod = req.method;
      const esData = req.data;

      // this is the first url defined in elasticsearch.hosts
      const url = _constructESUrl(elasticsearchBaseUrl, esPath);

      let ret = "curl -X" + esMethod + ' "' + url + '"';
      if (esData && esData.length) {
        ret += " -H 'Content-Type: application/json' -d'\n";
        const dataAsString = collapseLiteralStrings(esData.join("\n"));

        // We escape single quoted strings that that are wrapped in single quoted strings
        ret += dataAsString.replace(/'/g, "'\\''");
        if (esData.length > 1) {
          ret += "\n";
        } // end with a new line
        ret += "'";
      }
      return ret;
    });

    return result.join("\n");
  };
}

function _constructESUrl(baseUri: string, path: string) {
  baseUri = baseUri.replace(/\/+$/, "");
  path = path.replace(/^\/+/, "");
  return baseUri + "/" + path;
}

// brace line start with 1, we hope it start with 0 for better operation. You might show the same operation in other functions
function _rangeToAceRange({ start, end }: Range) {
  return new _AceRange(
    start.lineNumber - 1,
    start.column - 1,
    end.lineNumber - 1,
    end.column - 1
  );
}
