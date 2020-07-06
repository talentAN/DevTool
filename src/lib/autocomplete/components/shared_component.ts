import { AutocompleteComponent } from "./autocomplete_component";

export class SharedComponent extends AutocompleteComponent {
  _nextDict: any;
  constructor(name: string, parent: any) {
    super(name);
    this._nextDict = {};
    if (parent) {
      parent.addComponent(this);
    }
  }
  getComponent(name: string) {
    return this._nextDict[name] && this._nextDict[name][0];
  }

  addComponent(component: any) {
    this._nextDict[component.name] = this._nextDict[component.name] || [];
    this._nextDict[component.name].push(component);
    this.next = Object.values(this._nextDict).map((a: any) => a[0]);
  }
}