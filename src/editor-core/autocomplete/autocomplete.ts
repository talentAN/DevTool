import _defaults from "lodash.defaults";
import clone from "lodash.clone";
import debounce from "lodash.defaults";
import {
  getTopLevelUrlCompleteComponents,
  getEndpointBodyCompleteComponents,
  getGlobalAutocompleteComponents,
  getUnmatchedEndpointComponents,
} from "./getComponents";
import { URL_PATH_END_MARKER } from "./components/accept_endpoint_component";
import { populateContext } from "./engine";
import { createTokenIterator } from "../utils/helpers/token_iterator";
import { jsonToString } from "../utils/helpers/ContentFormatters";
import {
  Position,
  Range,
  CoreEditor,
  CurContext,
  Context,
  AutocompleteType,
  Token,
} from "../types";
import {
  isURLToken,
  isUrlParamsToken,
  isMethodToken,
  isWhitespaceToken,
} from "./Helper";

const STATES = {
  looking_for_key: 0, // looking for a key without jumping over anything but white space and colon(冒号).
  looking_for_scope_start: 1, // skip everything until scope start
  start: 3,
};
let lastEvaluatedToken: Token | null = null;

// splited logics for getting current method and tokenPaths
const _getInitState = (tokenIter: any, startPos: Position) => {
  let curToken = tokenIter.getCurrentToken();
  let state = STATES.start;
  // handle if curToken not exists or the postion is first line
  if (curToken) {
    if (startPos.column === 1) {
      // if we are at the beginning of the line, the current token is the one after cursor, not before which
      // deviates from the standard.
      curToken = tokenIter.stepBackward();
      state = STATES.looking_for_scope_start;
    }
  } else {
    if (startPos.column === 1) {
      // empty lines do no have tokens, move one back
      curToken = tokenIter.stepBackward();
      state = STATES.start;
    }
  }
  return state;
};
// 1,2
const _handleBody = (
  tokenIter: any,
  startPos: Position,
  _curContext: CurContext
) => {
  let state = _getInitState(tokenIter, startPos);
  let curToken = tokenIter.getCurrentToken();
  let walkedSomeBody = false;
  // climb one scope at a time and get the scope key
  for (
    ;
    curToken && !isURLToken(curToken) && !isMethodToken(curToken);
    curToken = tokenIter.stepBackward()
  ) {
    // console.info("=> 1");
    if (!isWhitespaceToken(curToken)) {
      walkedSomeBody = true;
    } // marks we saw something
    // console.info("=> 2");
    switch (curToken!.type) {
      case "variable":
        if (state === STATES.looking_for_key) {
          _curContext.bodyTokenPath.unshift(
            curToken!.value.trim().replace(/"/g, "")
          );
        }
        state = STATES.looking_for_scope_start; // skip everything until the beginning of this scope
        break;

      case "paren.lparen":
        _curContext.bodyTokenPath.unshift(curToken!.value);
        if (state === STATES.looking_for_scope_start) {
          // found it. go look for the relevant key
          state = STATES.looking_for_key;
        }
        break;
      case "paren.rparen":
        // reset he search for key
        state = STATES.looking_for_scope_start;
        // and ignore this sub scope..
        let parenCount = 1;
        curToken = tokenIter.stepBackward();
        while (curToken && parenCount > 0) {
          switch (curToken.type) {
            case "paren.lparen":
              parenCount--;
              break;
            case "paren.rparen":
              parenCount++;
              break;
          }
          if (parenCount > 0) {
            curToken = tokenIter.stepBackward();
          }
        }
        if (!curToken) {
          // oops we run out.. we don'curToken know what's up return null;
          return {};
        }
        continue;
      case "punctuation.end_triple_quote":
        // reset the search for key
        state = STATES.looking_for_scope_start;
        for (
          curToken = tokenIter.stepBackward();
          curToken;
          curToken = tokenIter.stepBackward()
        ) {
          if (curToken.type === "punctuation.start_triple_quote") {
            curToken = tokenIter.stepBackward();
            break;
          }
        }
        if (!curToken) {
          // oops we run out.. we don'curToken know what's up return null;
          return {};
        }
        continue;
      case "punctuation.start_triple_quote":
        if (state === STATES.start) {
          state = STATES.looking_for_key;
        } else if (state === STATES.looking_for_key) {
          state = STATES.looking_for_scope_start;
        }
        _curContext.bodyTokenPath.unshift('"""');
        continue;
      case "string":
      case "constant.numeric":
      case "constant.language.boolean":
      case "text":
        if (state === STATES.start) {
          state = STATES.looking_for_key;
        } else if (state === STATES.looking_for_key) {
          state = STATES.looking_for_scope_start;
        }
        break;
      case "punctuation.comma":
        if (state === STATES.start) {
          state = STATES.looking_for_scope_start;
        }
        break;
      case "punctuation.colon":
      case "whitespace":
        if (state === STATES.start) {
          state = STATES.looking_for_key;
        }
        break; // skip white space
    }
  }
  if (walkedSomeBody && _curContext.bodyTokenPath.length === 0) {
    // we had some content and still no path -> the cursor is position after a closed body -> no auto complete
    return false;
  }
};
// 4
const _getPreviousNoEmptyToken = (tokenIter: any) => {
  let curToken = tokenIter.getCurrentToken();
  if (curToken && isURLToken(curToken)) {
    // console.info("=>4");
    curToken = tokenIter.stepBackward();
    while (isWhitespaceToken(curToken!)) {
      curToken = tokenIter.stepBackward();
    }
  }
  return curToken;
};
// 5
const _handleUrlParamsToken = (tokenIter: any, _curContext: CurContext) => {
  let curUrlPart: any;
  let curToken = tokenIter.getCurrentToken();
  while (curToken && isUrlParamsToken(curToken)) {
    switch (curToken.type) {
      case "url.value":
        if (Array.isArray(curUrlPart)) {
          curUrlPart.unshift(curToken.value);
        } else if (curUrlPart) {
          curUrlPart = [curToken.value, curUrlPart];
        } else {
          curUrlPart = curToken.value;
        }
        break;
      case "url.comma":
        if (!curUrlPart) {
          curUrlPart = [];
        } else if (!Array.isArray(curUrlPart)) {
          curUrlPart = [curUrlPart];
        }
        break;
      case "url.param":
        const v = curUrlPart;
        curUrlPart = {};
        curUrlPart[curToken.value] = v;
        break;
      case "url.amp":
      case "url.questionmark":
        _curContext.urlParamsTokenPath.unshift(curUrlPart || {});
        curUrlPart = null;
        break;
    }
    curToken = tokenIter.stepBackward();
  }
  return curToken;
};
// 6,7
const _handleUrlPathToken = (
  tokenIter: any,
  _curContext: CurContext,
  parser: any
) => {
  let curUrlPart: any;
  let curToken = tokenIter.getCurrentToken();
  while (curToken && isURLToken(curToken)) {
    // console.info("=> 6", curToken.type);
    switch (curToken.type) {
      case "url.part":
        if (Array.isArray(curUrlPart)) {
          curUrlPart.unshift(curToken.value);
        } else if (curUrlPart) {
          curUrlPart = [curToken.value, curUrlPart];
        } else {
          curUrlPart = curToken.value;
        }
        break;
      case "url.comma":
        if (!curUrlPart) {
          curUrlPart = [];
        } else if (!Array.isArray(curUrlPart)) {
          curUrlPart = [curUrlPart];
        }
        break;
      case "url.slash":
        if (curUrlPart) {
          _curContext.urlTokenPath.unshift(curUrlPart);
          curUrlPart = null;
        }
        break;
    }
    curToken = parser.prevNonEmptyToken(tokenIter);
  }
  if (curUrlPart) {
    // console.info("=>7");
    _curContext.urlTokenPath.unshift(curUrlPart);
  }
  return curToken;
};
// 8, 9
const _addOtherAttrs = (_curContext: CurContext) => {
  // if handle only url, the bodyTokenPath.length will always be empty
  if (
    _curContext.bodyTokenPath.length === 0 &&
    _curContext.urlParamsTokenPath.length === 0
  ) {
    // console.info("=> 8");
    if (_curContext.urlTokenPath.length > 0) {
      // started on the url, first token is current token
      _curContext.otherTokenValues = _curContext.urlTokenPath[0];
    }
  } else {
    // console.info("=> 9");
    // mark the url as completed.
    _curContext.urlTokenPath.push(URL_PATH_END_MARKER);
  }
};
// 10
const _addMethod = (tokenIter: any, _curContext: CurContext) => {
  let curToken = tokenIter.getCurrentToken();
  // console.info("=> 10");
  if (curToken && isMethodToken(curToken)) {
    _curContext.method = curToken.value;
  }
};

const _getUrlCurrentMethodAndTokenPaths = (
  tokenIter: any,
  parser: any,
  _curContext: any
) => {
  //------------- => 4 start ------------
  _getPreviousNoEmptyToken(tokenIter);
  //------------- => 4 done 5 start ------------
  _handleUrlParamsToken(tokenIter, _curContext);
  //------------- => 5 end, 6/7 start ------------
  _handleUrlPathToken(tokenIter, _curContext, parser);
  //------------- => 6/7 end 8/9 start ------------
  _addOtherAttrs(_curContext);
  //------------- => 8/9 end 10 start ------------
  _addMethod(tokenIter, _curContext);
  return _curContext;
};

const _getBodyCurrentMethodAndTokenPaths = (
  tokenIter: any,
  parser: any,
  startPos: Position,
  _curContext: CurContext
) => {
  // 1,2,6,7,9,10
  const isValid = _handleBody(tokenIter, startPos, _curContext);
  if (isValid === false) {
    // console.info("=> 3");
    return {};
  }
  _curContext.requestStartRow = tokenIter.getCurrentPosition().lineNumber;
  _handleUrlPathToken(tokenIter, _curContext, parser);
  _addOtherAttrs(_curContext);
  _addMethod(tokenIter, _curContext);
  return _curContext;
};
// refactored
function _getCurrentMethodAndTokenPaths(
  editor: CoreEditor,
  pos: Position,
  parser: any
) {
  const tokenIter = createTokenIterator({
    editor,
    position: pos,
  });
  const _curContext: CurContext = {
    method: "",
    token: null,
    otherTokenValues: [],
    urlTokenPath: [],
    urlParamsTokenPath: [],
    bodyTokenPath: [],
  };
  let curToken = tokenIter.getCurrentToken();
  // 自动补全只有两种情况: 1. url 2.body
  const isURL = curToken && isURLToken(curToken);
  return isURL
    ? _getUrlCurrentMethodAndTokenPaths(tokenIter, parser, _curContext)
    : _getBodyCurrentMethodAndTokenPaths(tokenIter, parser, pos, _curContext);
}

export default function ({
  editor,
  parser,
}: {
  editor: CoreEditor;
  parser: any;
}) {
  function isUrlPathToken(token: Token | null) {
    switch ((token || ({} as any)).type) {
      case "url.slash":
      case "url.comma":
      case "url.part":
        return true;
      default:
        return false;
    }
  }
  // helper for complete context.autoCompleteSet;
  // list -> context.autoCompleteSet meta -> endpoint
  function _addMetaToTermsList(list: any, meta: any, template?: string) {
    return list.map(function (t: any) {
      if (typeof t !== "object") {
        t = { name: t };
      }
      return _defaults(t, { meta, template });
    });
  }

  function applyTerm(term: any) {
    const context = term.context;

    // make sure we get up to date replacement info.
    _addReplacementInfoToContext(
      context,
      editor.getCurrentPosition(),
      term.insertValue
    );

    let termAsString;
    if (context.autoCompleteType === "body") {
      termAsString =
        typeof term.insertValue === "string"
          ? '"' + term.insertValue + '"'
          : term.insertValue + "";
      if (term.insertValue === "[" || term.insertValue === "{") {
        termAsString = "";
      }
    } else {
      termAsString = term.insertValue + "";
    }

    let valueToInsert = termAsString;
    let templateInserted = false;
    if (
      context.addTemplate &&
      term.template !== undefined &&
      term.template !== null
    ) {
      let indentedTemplateLines;
      // In order to allow triple quoted strings in template completion we check the `__raw_`
      // attribute to determine whether this template should go through JSON formatting.
      if (term.template.__raw && term.template.value) {
        indentedTemplateLines = term.template.value.split("\n");
      } else {
        indentedTemplateLines = jsonToString(term.template, true).split("\n");
      }
      let currentIndentation = editor.getLineValue(
        context.rangeToReplace.start.lineNumber
      );
      currentIndentation = currentIndentation.match(/^\s*/)![0];
      for (
        let i = 1;
        i < indentedTemplateLines.length;
        i++ // skip first line
      ) {
        indentedTemplateLines[i] =
          currentIndentation + indentedTemplateLines[i];
      }

      valueToInsert += ": " + indentedTemplateLines.join("\n");
      templateInserted = true;
    } else {
      templateInserted = true;
      if (term.value === "[") {
        valueToInsert += "[]";
      } else if (term.value === "{") {
        valueToInsert += "{}";
      } else {
        templateInserted = false;
      }
    }

    valueToInsert = context.prefixToAdd + valueToInsert + context.suffixToAdd;

    // disable listening to the changes we are making.
    editor.off("changeSelection", editorChangeListener);

    if (
      context.rangeToReplace.start.column !== context.rangeToReplace.end.column
    ) {
      editor.replace(context.rangeToReplace, valueToInsert);
    } else {
      editor.insert(valueToInsert);
    }

    editor.clearSelection(); // for some reason the above changes selection

    // go back to see whether we have one of ( : { & [ do not require a comma. All the rest do.
    let newPos = {
      lineNumber: context.rangeToReplace.start.lineNumber,
      column:
        context.rangeToReplace.start.column +
        termAsString.length +
        context.prefixToAdd.length +
        (templateInserted ? 0 : context.suffixToAdd.length),
    };

    const tokenIter = createTokenIterator({
      editor,
      position: newPos,
    });

    if (context.autoCompleteType === "body") {
      // look for the next place stand, just after a comma, {
      let nonEmptyToken = parser.nextNonEmptyToken(tokenIter);
      switch (nonEmptyToken ? nonEmptyToken.type : "NOTOKEN") {
        case "paren.rparen":
          newPos = tokenIter.getCurrentPosition();
          break;
        case "punctuation.colon":
          nonEmptyToken = parser.nextNonEmptyToken(tokenIter);
          if ((nonEmptyToken || ({} as any)).type === "paren.lparen") {
            nonEmptyToken = parser.nextNonEmptyToken(tokenIter);
            newPos = tokenIter.getCurrentPosition();
            if (nonEmptyToken && nonEmptyToken.value.indexOf('"') === 0) {
              newPos.column++;
            } // don't stand on "
          }
          break;
        case "paren.lparen":
        case "punctuation.comma":
          tokenIter.stepForward();
          newPos = tokenIter.getCurrentPosition();
          break;
      }
      editor.moveCursorToPosition(newPos);
    }

    // re-enable listening to typing
    editor.on("changeSelection", editorChangeListener);
  }

  function _getAutoCompleteContext(
    ctxEditor: CoreEditor,
    pos: Position
  ): Context | null {
    // deduces all the parameters need to position and insert the auto complete
    // @ts-ignore
    const context: Context = {
      autoCompleteSet: null, // instructions for what can be here
      endpoint: null,
      urlPath: "",
      method: null,
      activeScheme: null,
      editor: ctxEditor,
    };
    context.autoCompleteType = _getAutoCompleteType(pos);
    switch (context!.autoCompleteType) {
      case AutocompleteType.path:
        _addPathAutoCompleteSetToContext(context, pos);
        // debugger;
        break;
      case AutocompleteType.url_params:
        addUrlParamsAutoCompleteSetToContext(context, pos);
        break;
      case AutocompleteType.method:
        _addMethodAutoCompleteSetToContext(context);
        break;
      case AutocompleteType.body:
        addBodyAutoCompleteSetToContext(context, pos);
        break;
      default:
        return null;
    }
    // here context.autoCompleteSet should be no empty array
    if (!context.autoCompleteSet) {
      return null; // nothing to do..
    }
    _addReplacementInfoToContext(context, pos);

    context.createdWithToken = clone(context.updatedForToken);
    return context;
  }
  // refactored
  function _getAutoCompleteType(pos: Position): AutocompleteType | null {
    let rowMode = parser.getRowParseMode();
    // in request must be body;
    if (rowMode & parser.MODE.IN_REQUEST) {
      return AutocompleteType.body;
    }
    // if is start line, it should be url path || url params || method
    if (rowMode & parser.MODE.REQUEST_START) {
      const tokenIter = createTokenIterator({
        editor,
        position: pos,
      });
      let curToken = tokenIter.getCurrentToken();

      while (curToken!.type === "url.comma") {
        curToken = tokenIter.stepBackward();
      }
      switch (curToken!.type) {
        case "method":
          return AutocompleteType.method;
        case "whitespace":
          curToken = parser.prevNonEmptyToken(tokenIter);
          if (curToken && isMethodToken(curToken)) {
            // we need to move back one step
            return AutocompleteType.method;
          }
          return isUrlPathToken(curToken)
            ? AutocompleteType.path
            : isUrlParamsToken(curToken)
            ? AutocompleteType.url_params
            : null;
        default:
          return isUrlPathToken(curToken)
            ? AutocompleteType.path
            : isUrlParamsToken(curToken)
            ? AutocompleteType.url_params
            : null;
      }
    }

    // after start to avoid single line url only requests
    if (rowMode & parser.MODE.REQUEST_END) {
      return AutocompleteType.body;
    }
    // in between request on an empty
    if (editor.getLineValue(pos.lineNumber).trim() === "") {
      // check if the previous line is a single line beginning of a new request
      rowMode = parser.getRowParseMode(pos.lineNumber - 1);
      const isSingleLineBegin =
        rowMode & parser.MODE.REQUEST_START &&
        rowMode & parser.MODE.REQUEST_END;
      if (isSingleLineBegin) {
        return AutocompleteType.body;
      }
      // otherwise suggest a method
      return AutocompleteType.method;
    }
    return null;
  }

  function _addReplacementInfoToContext(
    context: any,
    pos: Position,
    replacingTerm?: any
  ) {
    // extract the initial value, rangeToReplace & textBoxPosition

    // Scenarios for current token:
    //   -  Nice token { "bla|"
    //   -  Broken text token {   bla|
    //   -  No token : { |
    //   - Broken scenario { , bla|
    //   - Nice token, broken before: {, "bla"

    context.updatedForToken = clone(
      editor.getTokenAt({ lineNumber: pos.lineNumber, column: pos.column })
    );
    if (!context.updatedForToken) {
      context.updatedForToken = {
        value: "",
        type: "",
        position: { column: pos.column, lineNumber: pos.lineNumber },
      };
    } // empty line

    let anchorToken = context.createdWithToken;
    if (!anchorToken) {
      anchorToken = context.updatedForToken;
    }

    switch (context.updatedForToken.type) {
      case "variable":
      case "string":
      case "text":
      case "constant.numeric":
      case "constant.language.boolean":
      case "method":
      case "url.index":
      case "url.type":
      case "url.id":
      case "url.method":
      case "url.endpoint":
      case "url.part":
      case "url.param":
      case "url.value":
        context.rangeToReplace = {
          start: {
            lineNumber: pos.lineNumber,
            column: anchorToken.position.column,
          },
          end: {
            lineNumber: pos.lineNumber,
            column:
              context.updatedForToken.position.column +
              context.updatedForToken.value.length,
          },
        } as Range;
        context.replacingToken = true;
        break;
      default:
        if (replacingTerm && context.updatedForToken.value === replacingTerm) {
          context.rangeToReplace = {
            start: { lineNumber: pos.lineNumber, column: anchorToken.column },
            end: {
              lineNumber: pos.lineNumber,
              column:
                context.updatedForToken.position.column +
                context.updatedForToken.value.length,
            },
          } as Range;
          context.replacingToken = true;
        } else {
          // standing on white space, quotes or another punctuation - no replacing
          context.rangeToReplace = {
            start: { lineNumber: pos.lineNumber, column: pos.column },
            end: { lineNumber: pos.lineNumber, column: pos.column },
          } as Range;
          context.replacingToken = false;
        }
        break;
    }

    context.textBoxPosition = {
      lineNumber: context.rangeToReplace.start.lineNumber,
      column: context.rangeToReplace.start.column,
    };
    // console.info(`=> get ${context.autoCompleteType} auto complete`);
    switch (context.autoCompleteType) {
      case "path":
        _addPathPrefixSuffixToContext(context);
        break;
      case "url_params":
        _addUrlParamsPrefixSuffixToContext(context);
        break;
      case "method":
        addMethodPrefixSuffixToContext(context);
        break;
      case "body":
        addBodyPrefixSuffixToContext(context);
        break;
    }
  }

  function addBodyPrefixSuffixToContext(context: any) {
    // Figure out what happens next to the token to see whether it needs trailing commas etc.

    // Templates will be used if not destroying existing structure.
    // -> token : {} or token ]/} or token , but not token : SOMETHING ELSE

    context.prefixToAdd = "";
    context.suffixToAdd = "";

    let tokenIter = createTokenIterator({
      editor,
      position: editor.getCurrentPosition()!,
    });
    let nonEmptyToken = parser.nextNonEmptyToken(tokenIter);
    switch (nonEmptyToken ? nonEmptyToken.type : "NOTOKEN") {
      case "NOTOKEN":
      case "paren.lparen":
      case "paren.rparen":
      case "punctuation.comma":
        context.addTemplate = true;
        break;
      case "punctuation.colon":
        // test if there is an empty object - if so we replace it
        context.addTemplate = false;

        nonEmptyToken = parser.nextNonEmptyToken(tokenIter);
        if (!(nonEmptyToken && nonEmptyToken.value === "{")) {
          break;
        }
        nonEmptyToken = parser.nextNonEmptyToken(tokenIter);
        if (!(nonEmptyToken && nonEmptyToken.value === "}")) {
          break;
        }
        context.addTemplate = true;
        // extend range to replace to include all up to token
        context.rangeToReplace.end.lineNumber = tokenIter.getCurrentTokenLineNumber();
        context.rangeToReplace.end.column =
          tokenIter.getCurrentTokenColumn() + nonEmptyToken.value.length;

        // move one more time to check if we need a trailing comma
        nonEmptyToken = parser.nextNonEmptyToken(tokenIter);
        switch (nonEmptyToken ? nonEmptyToken.type : "NOTOKEN") {
          case "NOTOKEN":
          case "paren.rparen":
          case "punctuation.comma":
          case "punctuation.colon":
            break;
          default:
            context.suffixToAdd = ", ";
        }

        break;
      default:
        context.addTemplate = true;
        context.suffixToAdd = ", ";
        break; // for now play safe and do nothing. May be made smarter.
    }

    // go back to see whether we have one of ( : { & [ do not require a comma. All the rest do.
    tokenIter = createTokenIterator({
      editor,
      position: editor.getCurrentPosition(),
    });
    nonEmptyToken = tokenIter.getCurrentToken();
    let insertingRelativeToToken; // -1 is before token, 0 middle, +1 after token
    if (context.replacingToken) {
      insertingRelativeToToken = 0;
    } else {
      const pos = editor.getCurrentPosition();
      if (pos.column === context.updatedForToken.position.column) {
        insertingRelativeToToken = -1;
      } else if (
        pos.column <
        context.updatedForToken.position.column +
          context.updatedForToken.value.length
      ) {
        insertingRelativeToToken = 0;
      } else {
        insertingRelativeToToken = 1;
      }
    }
    // we should actually look at what's happening before this token
    if (parser.isEmptyToken(nonEmptyToken) || insertingRelativeToToken <= 0) {
      nonEmptyToken = parser.prevNonEmptyToken(tokenIter);
    }

    switch (nonEmptyToken ? nonEmptyToken.type : "NOTOKEN") {
      case "NOTOKEN":
      case "paren.lparen":
      case "punctuation.comma":
      case "punctuation.colon":
      case "method":
        break;
      default:
        if (nonEmptyToken && nonEmptyToken.type.indexOf("url") < 0) {
          context.prefixToAdd = ", ";
        }
    }

    return context;
  }

  function _addUrlParamsPrefixSuffixToContext(context: any) {
    context.prefixToAdd = "";
    context.suffixToAdd = "";
  }

  function addMethodPrefixSuffixToContext(context: any) {
    context.prefixToAdd = "";
    context.suffixToAdd = "";
    const tokenIter = createTokenIterator({
      editor,
      position: editor.getCurrentPosition(),
    });
    const lineNumber = tokenIter.getCurrentPosition().lineNumber;
    const t = parser.nextNonEmptyToken(tokenIter);

    if (tokenIter.getCurrentPosition().lineNumber !== lineNumber || !t) {
      // we still have nothing next to the method, add a space..
      context.suffixToAdd = " ";
    }
  }

  function _addPathPrefixSuffixToContext(context: any) {
    context.prefixToAdd = "";
    context.suffixToAdd = "";
  }

  function _addMethodAutoCompleteSetToContext(context: any) {
    context.autoCompleteSet = ["GET", "PUT", "POST", "DELETE", "HEAD"].map(
      (m, i) => ({
        name: m,
        score: -i,
        meta: "console.autocomplete.addMethodMetaText",
      })
    );
  }
  // main function to get path autocompletes
  function _addPathAutoCompleteSetToContext(context: any, pos: Position) {
    const _curContext = _getCurrentMethodAndTokenPaths(editor, pos, parser);
    context.method = _curContext.method;
    context.token = _curContext.token;
    context.otherTokenValues = _curContext.otherTokenValues;
    context.urlTokenPath = _curContext.urlTokenPath;
    // get all candidates in this method
    const components = getTopLevelUrlCompleteComponents(context.method);
    // get and put valid autoCompleteSet to context
    populateContext(
      _curContext.urlTokenPath,
      context,
      editor,
      true,
      components
    );
    // before run next, the context.autoCompleteSet shoud be a valid array.
    context.autoCompleteSet = _addMetaToTermsList(
      context.autoCompleteSet,
      "endpoint"
    );
  }

  function addUrlParamsAutoCompleteSetToContext(context: any, pos: Position) {
    const _curContext = _getCurrentMethodAndTokenPaths(editor, pos, parser);
    context.method = _curContext.method;
    context.otherTokenValues = _curContext.otherTokenValues;
    context.urlTokenPath = _curContext.urlTokenPath;
    if (!_curContext.urlTokenPath) {
      // zero length tokenPath is true
      return context;
    }

    populateContext(
      _curContext.urlTokenPath,
      context,
      editor,
      false,
      getTopLevelUrlCompleteComponents(context.method)
    );

    if (!context.endpoint) {
      return context;
    }

    if (!_curContext.urlParamsTokenPath) {
      // zero length tokenPath is true
      return context;
    }
    let tokenPath: any[] = [];
    const currentParam = _curContext.urlParamsTokenPath.pop();
    if (currentParam) {
      tokenPath = Object.keys(currentParam); // single key object
      context.otherTokenValues = currentParam[tokenPath[0]];
    }

    populateContext(
      tokenPath,
      context,
      editor,
      true,
      context.endpoint.paramsAutocomplete.getTopLevelComponents(context.method)
    );
    return context;
  }

  function addBodyAutoCompleteSetToContext(context: any, pos: Position) {
    const _curContext = _getCurrentMethodAndTokenPaths(editor, pos, parser);
    context.method = _curContext.method;
    context.otherTokenValues = _curContext.otherTokenValues;
    context.urlTokenPath = _curContext.urlTokenPath;
    context.requestStartRow = _curContext.requestStartRow;
    if (_curContext.urlTokenPath.length === 0) {
      // zero length tokenPath is true
      return context;
    }
    populateContext(
      _curContext.urlTokenPath,
      context,
      editor,
      false,
      getTopLevelUrlCompleteComponents(context.method)
    );
    context.bodyTokenPath = _curContext.bodyTokenPath;
    if (!_curContext.bodyTokenPath) {
      // zero length tokenPath is true
      return context;
    }

    // needed for scope linking + global term resolving
    context.endpointComponentResolver = getEndpointBodyCompleteComponents;
    context.globalComponentResolver = getGlobalAutocompleteComponents;
    const components = context.endpoint
      ? context.endpoint.bodyAutocompleteRootComponents
      : getUnmatchedEndpointComponents();
    populateContext(
      _curContext.bodyTokenPath,
      context,
      editor,
      true,
      components
    );
    return context;
  }
  // refactored
  const _evaluateCurrentTokenAfterAChange = debounce(
    function _evaluateCurrentTokenAfterAChange(pos: Position) {
      function _handleEmptyToken(curToken: Token) {
        const nextToken = editor.getTokenAt({
          ...pos,
          column: pos.column + 1,
        })!;
        if (parser.isEmptyToken(nextToken)) {
          // Empty line, or we're not on the edge of current token. Save the current position as base
          curToken.position.column = pos.column;
          lastEvaluatedToken = curToken;
        } else {
          nextToken.position.lineNumber = pos.lineNumber;
          lastEvaluatedToken = nextToken;
        }
        return;
      }
      let currentToken = editor.getTokenAt(pos);
      if (!currentToken && pos.lineNumber === 1) {
        lastEvaluatedToken = null;
        return;
      }
      currentToken = currentToken || {
        position: { column: 0, lineNumber: 0 },
        value: "",
        type: "",
      }; // empty row

      currentToken.position.lineNumber = pos.lineNumber; // extend token with row. Ace doesn't supply it by default
      if (parser.isEmptyToken(currentToken)) {
        _handleEmptyToken(currentToken);
      }

      if (!lastEvaluatedToken) {
        lastEvaluatedToken = currentToken;
        return; // wait for the next typing.
      }

      const isNothingChange = lastEvaluatedToken.value === currentToken.value;
      const isNotOnTheSamePlace =
        lastEvaluatedToken.position.column !== currentToken.position.column ||
        lastEvaluatedToken.position.lineNumber !==
          currentToken.position.lineNumber;
      if (isNothingChange || isNotOnTheSamePlace) {
        // not on the same place or nothing changed, cache and wait for the next time
        lastEvaluatedToken = currentToken;
        return;
      }

      // don't automatically open the auto complete if some just hit enter (new line) or open a parentheses
      // all tokenTypes is metioned in types/token.ts
      switch (currentToken.type || "UNKNOWN") {
        case "paren.lparen":
        case "paren.rparen":
        case "punctuation.colon":
        case "punctuation.comma":
        case "UNKNOWN":
          return;
      }
      lastEvaluatedToken = currentToken;
      editor.execCommand("startAutocomplete");
    },
    100
  );
  // if autocomplete component isn't showing, do something
  function editorChangeListener() {
    const position = editor.getCurrentPosition();
    if (position && !editor.isCompleterActive()) {
      _evaluateCurrentTokenAfterAChange(position);
    }
  }

  function getCompletions(
    position: Position,
    prefix: string,
    callback: (...args: any[]) => void
  ) {
    try {
      const context = _getAutoCompleteContext(editor, position);
      // if you wanna show autocomplete here, the context.autoCompleteSet should not be empty;
      if (!context) {
        callback(null, []);
      } else {
        const terms: any[] = [];
        // filter null terms and normalize term
        context &&
          context.autoCompleteSet!.forEach((term: any) => {
            // only handle valid terms
            if (!!term && term.name !== null) {
              term =
                typeof term === "object"
                  ? Object.assign({}, term)
                  : {
                      name: term,
                    };
              const defaults: any = {
                value: term.name,
                meta: "API",
                score: 0,
                context,
              };
              // we only need our custom insertMatch behavior for the body
              if (context.autoCompleteType === "body") {
                defaults.completer = {
                  insertMatch() {
                    return applyTerm(term);
                  },
                };
              }
              terms.push(_defaults(term, defaults));
            }
          });
        terms
          .sort(function (t1: any, t2: any) {
            /* score sorts from high to low */
            if (t1.score !== t2.score) {
              return t1.score < t2.score ? 1 : -1;
            }
            /* names sort from low to high */
            if (t1.name <= t2.name) {
              return t1.name === t2.name ? 0 : -1;
            }
            return 1;
          })
          .map(function (t: any, i: any) {
            t.insertValue = t.insertValue || t.value;
            t.value = "" + t.value; // normalize to strings
            t.score = -i;
            return t;
          });
        // debugger;
        callback(null, terms);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      callback(e, null);
    }
  }

  editor.on("changeSelection", editorChangeListener);
  return getCompletions;
}
