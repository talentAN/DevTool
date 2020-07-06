import { Token } from "../../types";
import _ from "lodash";
import foreach from "lodash.foreach";

let perIndexTypes: any = {};
let perAliasIndexes: any = [];
let templates: any[] = [];

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

function _expandAliases(indicesOrAliases: any) {
  // takes a list of indices or aliases or a string which may be either and returns a list of indices
  // returns a list for multiple values or a string for a single.

  if (!indicesOrAliases) {
    return indicesOrAliases;
  }

  if (typeof indicesOrAliases === "string") {
    indicesOrAliases = [indicesOrAliases];
  }
  indicesOrAliases = indicesOrAliases.map((iOrA: string) => {
    if (perAliasIndexes[iOrA]) {
      return perAliasIndexes[iOrA];
    }
    return [iOrA];
  });
  let ret: any = [].concat.apply([], indicesOrAliases);
  ret.sort();
  let last: any;
  ret = ret.map((v: string) => {
    const r = last === v ? null : v;
    last = v;
    return r;
  });
  return ret.length > 1 ? ret : ret[0];
}
// in use
export function getTemplates() {
  return [...templates];
}
// in use
export function getFields(indices: any, types: any) {
  // get fields for indices and types. Both can be a list, a string or null (meaning all).
  let ret: any[] = [];
  indices = _expandAliases(indices);

  if (typeof indices === "string") {
    const typeDict = perIndexTypes[indices];
    if (!typeDict) {
      return [];
    }

    if (typeof types === "string") {
      const f = typeDict[types];
      ret = f ? f : [];
    } else {
      // filter what we need
      typeDict.each(function (type: any, fields: any) {
        if (
          !types ||
          types.length === 0 ||
          types.some((t: string) => t === type)
        ) {
          ret.push(fields);
        }
      });

      ret = [].concat.apply([], ret);
    }
  } else {
    // multi index mode.
    perIndexTypes.each(function (index: string) {
      if (
        !indices ||
        indices.length === 0 ||
        indices.some((i: string) => i === index)
      ) {
        ret.push(getFields(index, types));
      }
    });
    ret = [].concat.apply([], ret);
  }
  return Array.from(new Set(ret.map((r) => `${r.name}:${r.type}`)));
}
// in use
export function getTypes(indices: any) {
  let ret: any[] = [];
  indices = _expandAliases(indices);
  if (typeof indices === "string") {
    const typeDict = perIndexTypes[indices];
    if (!typeDict) {
      return [];
    }

    // filter what we need
    typeDict.each((type: string) => ret.push(type));
  } else {
    // multi index mode.
    perIndexTypes.each((index: string) => {
      if (!indices || indices.some((i: string) => i === index)) {
        ret.push(getTypes(index));
      }
    });
    ret = [].concat.apply([], ret);
  }

  return _.uniq(ret);
}
// in use
export function getIndices(includeAliases: any) {
  const ret: any[] = [];
  foreach(perIndexTypes, function (index) {
    ret.push(index);
  });
  if (typeof includeAliases === "undefined" ? true : includeAliases) {
    foreach(perAliasIndexes, function (alias) {
      ret.push(alias);
    });
  }
  return ret;
}
