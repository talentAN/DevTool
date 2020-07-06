import { SharedComponent } from ".";
import { CoreEditor } from "../../types";
export class ConstantComponent extends SharedComponent {
  options: any;
  constructor(name: string, parent: any, options?: any) {
    super(name, parent);
    if (options && !Array.isArray(options)) {
      options = [options];
    }
    this.options = options || [name];
  }
  getTerms() {
    return this.options;
  }

  addOption(options: any) {
    if (!Array.isArray(options)) {
      options = [options];
    }

    this.options.push(options);
    this.options = Array.from(new Set(this.options));
  }
  //@ts-ignore
  match(token: string, context?: any, editor?: CoreEditor) {
    if (token !== this.name) {
      return null;
    }
    return super.match();
  }
}
