import { Editor as IAceEditor } from "brace";
import { smartResize } from "./utils/helpers/Editor";

// @ts-ignore
import * as InputMode from "./mode/input";

export class PureBlackboard {
  resize: () => void;

  constructor(readonly editor: IAceEditor) {
    this.editor = editor;
    this.editor.setShowPrintMargin(false);
    const session = this.editor.getSession();
    session.setMode(new InputMode.Mode() as any);
    (session as any).setFoldStyle("markbeginend");
    session.setTabSize(20);
    session.setUseWrapMode(true);

    this.resize = smartResize(this.editor);

    // Intercept ace on paste handler.
    this.editor.setOptions({
      enableBasicAutocompletion: true,
    });
    this.editor.$blockScrolling = Infinity;
  }
}
