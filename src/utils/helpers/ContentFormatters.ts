import _ from "lodash";

export function textFromRequest(request: any) {
  let data = request.data;
  if (typeof data !== "string") {
    data = data.join("\n");
  }
  return request.method + " " + request.url + "\n" + data;
}

export function jsonToString(data: any, indent: boolean) {
  return JSON.stringify(data, null, indent ? 2 : 0);
}
export function collapseLiteralStrings(data: string) {
  const splitData = data.split(`"""`);
  for (let idx = 1; idx < splitData.length - 1; idx += 2) {
    splitData[idx] = JSON.stringify(splitData[idx]);
  }
  return splitData.join("");
}
export function formatRequestBodyDoc(data: string[], indent: boolean) {
  let changed = false;
  const formattedData = [];
  for (let i = 0; i < data.length; i++) {
    const curDoc = data[i];
    try {
      let newDoc = jsonToString(
        JSON.parse(collapseLiteralStrings(curDoc)),
        indent
      );
      if (indent) {
        newDoc = expandLiteralStrings(newDoc);
      }
      changed = changed || newDoc !== curDoc;
      formattedData.push(newDoc);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      formattedData.push(curDoc);
    }
  }

  return {
    changed,
    data: formattedData,
  };
}

export function extractDeprecationMessages(warnings: string) {
  // pattern for valid warning header
  const re = /\d{3} [0-9a-zA-Z!#$%&'*+-.^_`|~]+ "((?:\t| |!|[\x23-\x5b]|[\x5d-\x7e]|[\x80-\xff]|\\\\|\\")*)"(?: "[^"]*")?/;
  // split on any comma that is followed by an even number of quotes
  return _.map(splitOnUnquotedCommaSpace(warnings), (warning) => {
    const match = re.exec(warning);
    // extract the actual warning if there was a match
    return "#! Deprecation: " + (match !== null ? unescape(match[1]) : warning);
  });
}

export function unescape(s: string) {
  return s.replace(/\\\\/g, "\\").replace(/\\"/g, '"');
}

export function splitOnUnquotedCommaSpace(s: string) {
  let quoted = false;
  const arr = [];
  let buffer = "";
  let i = 0;
  while (i < s.length) {
    let token = s.charAt(i++);
    if (token === "\\" && i < s.length) {
      token += s.charAt(i++);
    } else if (token === "," && i < s.length && s.charAt(i) === " ") {
      token += s.charAt(i++);
    }
    if (token === '"') {
      quoted = !quoted;
    } else if (!quoted && token === ", ") {
      arr.push(buffer);
      buffer = "";
      continue;
    }
    buffer += token;
  }
  arr.push(buffer);
  return arr;
}

/*
  The following regex describes global match on:
  1. one colon followed by any number of space characters
  2. one double quote (not escaped, special case for JSON in JSON).
  3. greedily match any non double quote and non newline char OR any escaped double quote char (non-capturing).
  4. handle a special case where an escaped slash may be the last character
  5. one double quote

  For instance: `: "some characters \" here"`
  Will match and be expanded to: `"""some characters " here"""`

 */

const LITERAL_STRING_CANDIDATES = /((:[\s\r\n]*)([^\\])"(\\"|[^"\n])*\\?")/g;

export function expandLiteralStrings(data: string) {
  return data.replace(LITERAL_STRING_CANDIDATES, (match, string) => {
    // Expand to triple quotes if there are _any_ slashes
    if (string.match(/\\./)) {
      const firstDoubleQuoteIdx = string.indexOf('"');
      const lastDoubleQuoteIdx = string.lastIndexOf('"');

      // Handle a special case where we may have a value like "\"test\"". We don't
      // want to expand this to """"test"""" - so we terminate before processing the string
      // further if we detect this either at the start or end of the double quote section.

      if (
        string[firstDoubleQuoteIdx + 1] === "\\" &&
        string[firstDoubleQuoteIdx + 2] === '"'
      ) {
        return string;
      }

      if (
        string[lastDoubleQuoteIdx - 1] === '"' &&
        string[lastDoubleQuoteIdx - 2] === "\\"
      ) {
        return string;
      }

      const colonAndAnySpacing = string.slice(0, firstDoubleQuoteIdx);
      const rawStringifiedValue = string.slice(
        firstDoubleQuoteIdx,
        string.length
      );
      // Remove one level of JSON stringification
      const jsonValue = JSON.parse(rawStringifiedValue);
      return `${colonAndAnySpacing}"""${jsonValue}"""`;
    } else {
      return string;
    }
  });
}
