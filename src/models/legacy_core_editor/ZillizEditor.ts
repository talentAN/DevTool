// brace is a very powerful eidtor base on ace while its api is also complex.
// So we wrappe some apis which are frequently used, it'll be better for us to use it.

// Those apis are basicly for get eidtor's status and content we need.
// After get contents, we need to get standard request in json or curl format.
// So wo define other methods base on these wrappers to operat request

import ace from "brace";
import { Editor as IAceEditor, IEditSession as IAceEditSession } from "brace";
import {
  CoreEditor,
  Position,
  Range,
  Token,
  TokensProvider,
  EditorEvent,
  AutoCompleterFunction,
} from "../../types";
import { AceTokensProvider } from "../../lib/ace_token_provider";
import * as curl from "../sense_editor/curl";
import { smartResize } from "../../utils/helpers/Editor";
// @ts-ignore
import * as InputMode from "./mode/input";
const _AceRange = ace.acequire("ace/range").Range;

// brace line start with 1, we hope it start with 0 for better operation
const rangeToAceRange = ({ start, end }: Range) =>
  new _AceRange(
    start.lineNumber - 1,
    start.column - 1,
    end.lineNumber - 1,
    end.column - 1
  );

export class ZillizEditor implements CoreEditor {
  private _aceOnPaste: any;
  resize: () => void;

  constructor(private readonly editor: IAceEditor) {
    this.editor.setShowPrintMargin(false);
    // init Editor style
    const session = this.editor.getSession();
    session.setMode(new InputMode.Mode() as any);
    (session as any).setFoldStyle("markbeginend");
    session.setTabSize(20);
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
    return this.editor.getSession().getTextRange(rangeToAceRange(range));
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
    session.replace(rangeToAceRange(range), value);
  }

  getLines(startLine: number, endLine: number): string[] {
    const session = this.editor.getSession();
    return session.getLines(startLine - 1, endLine - 1);
  }

  replaceRange(range: Range, value: string) {
    const pos = this.editor.getCursorPosition();
    this.editor.getSession().replace(rangeToAceRange(range), value);

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
        rangeToAceRange(range),
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
        identifierRegexps: [
          /[a-zA-Z_0-9\.\$\-\u00A2-\uFFFF]/, // adds support for dot character
        ],
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
}
