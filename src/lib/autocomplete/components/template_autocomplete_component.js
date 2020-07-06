import { ListComponent } from './list_component';
import { getTemplates } from "../Helper";

export class TemplateAutocompleteComponent extends ListComponent {
  constructor(name, parent) {
    super(name, getTemplates, parent, true, true);
  }
  getContextKey() {
    return 'template';
  }
}
