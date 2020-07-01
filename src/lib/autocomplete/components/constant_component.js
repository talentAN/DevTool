import { SharedComponent } from ".";

export class ConstantComponent extends SharedComponent {
  constructor(name, parent, options) {
    super(name, parent);
    if (!Array.isArray(options)) {
      options = [options];
    }
    this.options = options || [name];
  }
  getTerms() {
    return this.options;
  }

  addOption(options) {
    if (!Array.isArray(options)) {
      options = [options];
    }

    this.options.push(options);
    this.options = Array.from(new Set(this.options));
  }
  match(token, context, editor) {
    if (token !== this.name) {
      return null;
    }
    return super.match(token, context, editor);
  }
}
