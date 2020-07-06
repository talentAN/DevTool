import _ from "lodash";
import { ListComponent } from "./list_component";
import { getTypes } from "../Helper";

function TypeGenerator(context) {
  return getTypes(context.indices);
}
function nonValidIndexType(token) {
  return !(token === "_all" || token[0] !== "_");
}
export class TypeAutocompleteComponent extends ListComponent {
  constructor(name, parent, multiValued) {
    super(name, TypeGenerator, parent, multiValued);
  }
  validateTokens(tokens) {
    if (!this.multiValued && tokens.length > 1) {
      return false;
    }

    return !_.find(tokens, nonValidIndexType);
  }

  getDefaultTermMeta() {
    return "type";
  }

  getContextKey() {
    return "types";
  }
}
