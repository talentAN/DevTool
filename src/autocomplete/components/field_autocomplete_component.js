import _ from 'lodash';
import { ListComponent } from './list_component';
import { getFields } from "../Helper";

function FieldGenerator(context) {
  return _.map(getFields(context.indices, context.types), function (field) {
    return { name: field.name, meta: field.type };
  });
}

export class FieldAutocompleteComponent extends ListComponent {
  constructor(name, parent, multiValued) {
    super(name, FieldGenerator, parent, multiValued);
  }
  validateTokens(tokens) {
    if (!this.multiValued && tokens.length > 1) {
      return false;
    }

    return !_.find(tokens, function (token) {
      return token.match(/[^\w.?*]/);
    });
  }

  getDefaultTermMeta() {
    return 'field';
  }

  getContextKey() {
    return 'fields';
  }
}
