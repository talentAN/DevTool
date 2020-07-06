
import _ from 'lodash';
import { SharedComponent } from './shared_component';
export const URL_PATH_END_MARKER = '__url_path_end__';

export class AcceptEndpointComponent extends SharedComponent {
  constructor(endpoint, parent) {
    super(endpoint.id, parent);
    this.endpoint = endpoint;
  }
  match(token, context, editor) {
    // console.info('yyyyyyy')
    if (token !== URL_PATH_END_MARKER) {
      return null;
    }
    if (this.endpoint.methods && -1 === _.indexOf(this.endpoint.methods, context.method)) {
      return null;
    }
    const r = super.match(token, context, editor);
    r.context_values = r.context_values || {};
    r.context_values.endpoint = this.endpoint;
    if (_.isNumber(this.endpoint.priority)) {
      r.priority = this.endpoint.priority;
    }
    return r;
  }
}