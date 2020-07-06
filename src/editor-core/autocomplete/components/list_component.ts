import difference from "lodash.difference";
import _defaults from "lodash.defaults";
import { SharedComponent } from ".";
export class ListComponent extends SharedComponent {
  listGenerator: any;
  multiValued: any;
  allowNonValidValues: any;
  constructor(
    name: string,
    list: any,
    parent: any,
    multiValued?: any,
    allowNonValidValues?: boolean
  ) {
    super(name, parent);
    this.listGenerator = Array.isArray(list)
      ? function () {
          return list;
        }
      : list;
    this.multiValued = multiValued === undefined ? true : multiValued;
    this.allowNonValidValues =
      allowNonValidValues === undefined ? false : allowNonValidValues;
  }
  // @ts-ignore
  getTerms(context: any, editor: CoreEditor) {
    if (!this.multiValued && context.otherTokenValues) {
      // already have a value -> no suggestions
      return [];
    }
    let alreadySet = context.otherTokenValues || [];
    if (typeof alreadySet === "string") {
      alreadySet = [alreadySet];
    }
    let ret = difference(this.listGenerator(context, editor), alreadySet);

    if (this.getDefaultTermMeta()) {
      const meta = this.getDefaultTermMeta();
      ret = ret.map(function (term) {
        if (typeof term === "string") {
          term = { name: term };
        }
        return _defaults(term, { meta: meta });
      });
    }

    return ret;
  }

  validateTokens(tokens: string[]) {
    if (!this.multiValued && tokens.length > 1) {
      return false;
    }

    // verify we have all tokens
    const list = this.listGenerator();
    const notFound = tokens.every(function (token: string) {
      return list.indexOf(token) === -1;
    });

    if (notFound) {
      return false;
    }
    return true;
  }

  getContextKey() {
    return this.name;
  }

  getDefaultTermMeta() {
    return this.name;
  }
  //@ts-ignore
  match(token, context, editor) {
    if (!Array.isArray(token)) {
      token = [token];
    }
    if (!this.allowNonValidValues && !this.validateTokens(token)) {
      return null;
    }
    //@ts-ignore
    const result: any = super.match(token, context, editor);
    result.context_values = result.context_values || {};
    result.context_values[this.getContextKey()] = token;
    return result;
  }
}
