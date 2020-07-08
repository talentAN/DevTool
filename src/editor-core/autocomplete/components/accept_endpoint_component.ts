import _ from "lodash";
import { SharedComponent } from "./shared_component";
import { CoreEditor } from "../../types";
export const URL_PATH_END_MARKER = "__url_path_end__";

export class AcceptEndpointComponent extends SharedComponent {
  endpoint: any;
  constructor(endpoint: any, parent: any) {
    super(endpoint.id, parent);
    //@ts-ignore
    this.endpoint = endpoint;
  }
  //@ts-ignore
  match(token: string, context: any, editor: CoreEditor) {
    if (token !== URL_PATH_END_MARKER) {
      return null;
    }
    if (
      this.endpoint.methods &&
      this.endpoint.methods.indexOf(context.method) === -1
    ) {
      return null;
    }
    //@ts-ignore
    const r: any = super.match(token, context, editor);
    r.context_values = r.context_values || {};
    r.context_values.endpoint = this.endpoint;
    if (_.isNumber(this.endpoint.priority)) {
      r.priority = this.endpoint.priority;
    }
    return r;
  }
}
