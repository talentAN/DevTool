import _ from "lodash";
import { CoreEditor } from "../types";
import { sortArr } from "../utils/helpers/PureFns";
import _default from "lodash.defaults";
import _isEmpty from "lodash.isempty";
import foreach from "lodash.foreach";
type Context = {
  activeScheme: any;
  autoCompleteSet: any;
  autoCompleteType: string;
  editor: CoreEditor;
  endpoint: null;
  method: string;
  otherTokenValues: string;
  token: undefined | string;
  urlPath: null | string;
  urlTokenPath: string[];
};

type I_WalkingState = {
  parentName: string;
  components: any[];
  contextExtensionList: any[];
  depth: number;
  priority: number | undefined;
  name?: string;
};

// what this for?
function _passThroughContext(context: Context, extensionList: any) {
  function PTC() {}

  PTC.prototype = context;
  const result = new (PTC as any)();
  if (extensionList) {
    extensionList.unshift(result);
    // TODO: don't really understand
    _.assign.apply(_, extensionList);
    extensionList.shift();
  }
  return result;
}

export function WalkingState(
  parentName: string,
  components: any[],
  contextExtensionList: any[],
  depth?: number,
  priority?: any
): I_WalkingState {
  this.parentName = parentName;
  this.components = components;
  this.contextExtensionList = contextExtensionList;
  this.depth = depth || 0;
  this.priority = priority;
  return this;
}

export function walkTokenPath(
  tokenPaths: string[],
  walkingStates: I_WalkingState[],
  context: Context,
  editor: CoreEditor
): any {
  // walkingStates是中间态及最后返回值, context, editor是不变的变量
  if (!tokenPaths || tokenPaths.length === 0) {
    return walkingStates;
  }
  const token = tokenPaths[0];
  const nextWalkingStates: I_WalkingState[] = [];
  walkingStates.forEach(function (ws: I_WalkingState) {
    const contextForState = _passThroughContext(
      context,
      ws.contextExtensionList
    );
    ws.components.forEach(function (component: any) {
      const result = component.match(token, contextForState, editor);
      if (result && !_isEmpty(result)) {
        let next;
        let extensionList: any[] = [];
        if (result.next && !Array.isArray(result.next)) {
          next = [result.next];
        } else {
          next = result.next;
        }
        if (result.context_values) {
          extensionList.push(ws.contextExtensionList);
          extensionList.push(result.context_values);
        } else {
          extensionList = ws.contextExtensionList;
        }
        // handle priority
        let priority = ws.priority;
        if (typeof result.priority === "number") {
          priority =
            typeof priority === "number"
              ? Math.min(priority, result.priority)
              : result.priority;
        }

        nextWalkingStates.push(
          new (WalkingState as any)(
            component.name,
            next,
            extensionList,
            ws.depth + 1,
            priority
          )
        );
      }
    });
  });
  // no where to go, still return context variables returned so far..
  if (nextWalkingStates.length === 0) {
    return walkingStates.map(
      (ws: I_WalkingState) =>
        new (WalkingState as any)(ws.name, [], ws.contextExtensionList)
    );
  }
  return walkTokenPath(tokenPaths.slice(1), nextWalkingStates, context, editor);
}

export function wrapComponentWithDefaults(component: any, defaults: any) {
  const originalGetTerms = component.getTerms;
  component.getTerms = function (context: Context, editor: CoreEditor) {
    let result = originalGetTerms.call(component, context, editor);
    if (!result) {
      return result;
    }
    result = result.map((term: any) => {
      if (typeof term !== "object") {
        term = { name: term };
      }
      return _default(term, defaults);
    });
    return result;
  };
  return component;
}

export function populateContext(
  tokenPath: string[], // affirmatory part of url path split by '/' like ["_cluster", "123"]
  context: Context,
  editor: CoreEditor,
  includeAutoComplete: boolean,
  components: any[]
): void {
  let walkStates = walkTokenPath(
    tokenPath,
    [new (WalkingState as any)("ROOT", components, [])],
    context,
    editor
  );
  if (includeAutoComplete) {
    let autoCompleteSet: any[] = [];
    walkStates.forEach(function (ws: I_WalkingState) {
      const contextForState = _passThroughContext(
        context,
        ws.contextExtensionList
      );
      ws.components.forEach(function (component) {
        const terms = component.getTerms(contextForState, editor);
        foreach(terms, function (term: any) {
          if (typeof term !== "object") {
            term = { name: term };
          }
          autoCompleteSet.push(term);
        });
      });
    });
    autoCompleteSet = Array.from(new Set(autoCompleteSet));
    context.autoCompleteSet = autoCompleteSet;
  }

  // apply what values were set so far to context, selecting the deepest on which sets the context
  if (walkStates.length !== 0) {
    let wsToUse = sortArr(walkStates).find((ws: I_WalkingState) =>
      _isEmpty(ws.components)
    );
    wsToUse = wsToUse || walkStates[0];
    wsToUse.contextExtensionList.forEach((extension: any) =>
      Object.assign(context, extension)
    );
  }
}
