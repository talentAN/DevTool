import { SharedComponent } from ".";
import { CoreEditor } from "../../types";
export class ConstantComponent extends SharedComponent {
  options: any;
  constructor(name: string, parent: any, options?: any) {
    super(name, parent);
    options = typeof options === "string" ? [options] : options;
    this.options = options || [name];
  }
  getTerms() {
    return this.options;
  }

  addOption(options: string[] | string) {
    if (!Array.isArray(options)) {
      options = [options];
    }
    this.options = this.options.concat(options);
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
