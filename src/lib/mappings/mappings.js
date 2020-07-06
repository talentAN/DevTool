import _ from "lodash";
import foreach from "lodash.foreach";
// NOTE: If this value ever changes to be a few seconds or less, it might introduce flakiness
// due to timing issues in our app.js tests.

let perIndexTypes = {};
let perAliasIndexes = [];
let templates = [];

function _expandAliases(indicesOrAliases) {
  // takes a list of indices or aliases or a string which may be either and returns a list of indices
  // returns a list for multiple values or a string for a single.

  if (!indicesOrAliases) {
    return indicesOrAliases;
  }

  if (typeof indicesOrAliases === "string") {
    indicesOrAliases = [indicesOrAliases];
  }
  indicesOrAliases = indicesOrAliases.map(function (iOrA) {
    if (perAliasIndexes[iOrA]) {
      return perAliasIndexes[iOrA];
    }
    return [iOrA];
  });
  let ret = [].concat.apply([], indicesOrAliases);
  ret.sort();
  let last;
  ret = ret.map(function (v) {
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
export function getFields(indices, types) {
  // get fields for indices and types. Both can be a list, a string or null (meaning all).
  let ret = [];
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
      typeDict.each(function (type, fields) {
        if (!types || types.length === 0 || types.some((t) => t === type)) {
          ret.push(fields);
        }
      });

      ret = [].concat.apply([], ret);
    }
  } else {
    // multi index mode.
    perIndexTypes.each(function (index) {
      if (
        !indices ||
        indices.length === 0 ||
        indices.some((i) => i === index)
      ) {
        ret.push(getFields(index, types));
      }
    });
    ret = [].concat.apply([], ret);
  }
  console.info("xxx", ret);
  return _.uniq(ret, function (f) {
    return f.name + ":" + f.type;
  });
}
// in use
export function getTypes(indices) {
  let ret = [];
  indices = _expandAliases(indices);
  if (typeof indices === "string") {
    const typeDict = perIndexTypes[indices];
    if (!typeDict) {
      return [];
    }

    // filter what we need
    typeDict.each(function (type) {
      ret.push(type);
    });
  } else {
    // multi index mode.
    perIndexTypes.each(function (index) {
      if (!indices || indices.some((i) => i === index)) {
        ret.push(getTypes(index));
      }
    });
    ret = [].concat.apply([], ret);
  }

  return _.uniq(ret);
}
// in use
export function getIndices(includeAliases) {
  const ret = [];
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
