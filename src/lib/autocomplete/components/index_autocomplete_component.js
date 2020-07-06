import { getIndices } from "../Helper";
import { ListComponent } from "./list_component";
function nonValidIndexType(token) {
  return !(token === "_all" || token[0] !== "_");
}
export class IndexAutocompleteComponent extends ListComponent {
  constructor(name, parent, multiValued) {
    super(name, getIndices, parent, multiValued);
  }
  validateTokens(tokens) {
    if (!this.multiValued && tokens.length > 1) {
      return false;
    }
    return !tokens.find(nonValidIndexType);
  }

  getDefaultTermMeta() {
    return "index";
  }

  getContextKey() {
    return "indices";
  }
}
