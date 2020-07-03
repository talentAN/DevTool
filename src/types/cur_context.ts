import { Token } from "./token";

export interface CurContext {
  method: string;
  token: Token | null;
  otherTokenValues: string | Array<Token | null>;
  urlTokenPath: string[];
  urlParamsTokenPath: { [propname: string]: string }[];
  bodyTokenPath: string[];
  requestStartRow?: number;
}
