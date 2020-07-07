import { Position, CoreEditor, Token } from "./index";

export enum AutocompleteType {
  "method" = "method",
  "path" = "path",
  "url_params" = "url_params",
  "body" = "body",
}

export type Context = {
  // common part for Method, URL, Body
  activeScheme: null | string;
  autoCompleteSet: any[] | null;
  autoCompleteType: AutocompleteType | null;
  createdWithToken: Token;
  editor: CoreEditor;
  urlPath: string;
  endpoint: any; // null | any;
  method: null | string;
  prefixToAdd: string;
  rangeToReplace: {
    start: Position;
    end: Position;
  };
  replaceToken: boolean;
  suffixToAdd: string;
  textBoxPosition: Position;
  updatedForToken: Token;
  // comment part for URL, Body
  otherTokenValues: string | string[];
  token: null | Token;
  urlTokenPath: string[] | null;
  // Body part
  addTemplate: boolean;
  bodyTokenPath: string[];
  endpointComponentResolver: Function;
  globalComponentResolver: Function;
  requestStartRow: number;
};
