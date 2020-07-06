// @ts-ignore
import { ConstantComponent } from "./constant_component";
export class FullRequestComponent extends ConstantComponent {
  readonly name: string;
  constructor(name: string, parent: any, private readonly template: string) {
    super(name, parent);
    this.name = name;
  }

  getTerms() {
    return [{ name: this.name, snippet: this.template }];
  }
}
