import _defaults from "lodash.defaults";
import foreach from "lodash.foreach";
import clone from "lodash.clone";
import {
  ConstantComponent,
  ListComponent,
  SharedComponent,
} from "./components";

class ParamComponent extends ConstantComponent {
  description: any;
  constructor(name: string, parent: any, description: any) {
    super(name, parent);
    this.description = description;
  }
  getTerms() {
    const t: any = { name: this.name };
    if (this.description === "__flag__") {
      t.meta = "flag";
    } else {
      t.meta = "param";
      t.insertValue = this.name + "=";
    }
    return [t];
  }
}

export class UrlParams {
  rootComponent: any;
  constructor(description: any, defaults?: any) {
    // This is not really a component, just a handy container to make iteration logic simpler
    this.rootComponent = new SharedComponent("ROOT");
    defaults = defaults || {
      pretty: "__flag__",
      format: ["json", "yaml"],
      filter_path: "",
    };
    description = clone(description || {});
    _defaults(description, defaults);
    foreach(
      description,
      function (pDescription: any, param: any) {
        const component = new ParamComponent(
          param,
          this.rootComponent,
          pDescription
        );
        if (Array.isArray(pDescription)) {
          new ListComponent(param, pDescription, component);
        } else if (pDescription === "__flag__") {
          new ListComponent(param, ["true", "false"], component);
        }
      }.bind(this)
    );
  }
  getTopLevelComponents() {
    return this.rootComponent.next;
  }
}
