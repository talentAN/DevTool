import forEach from "lodash.foreach";
import {
  TypeAutocompleteComponent,
  IdAutocompleteComponent,
  IndexAutocompleteComponent,
  FieldAutocompleteComponent,
  ListComponent,
  TemplateAutocompleteComponent,
  UsernameAutocompleteComponent,
} from "./components";
import { API_Endpoints } from "../utils/mocks/API_Endpoints"; // fake api at the moment, we can use our own later
import Api from "./api";

let ACTIVE_API: any = new (Api as any)(undefined, undefined);

const isNotAnIndexName = (name: string[] | string): boolean =>
  name[0] === "_" && name !== "_all";

const _idAutocompleteComponentFactory = (name: string, parent: any) => {
  return new IdAutocompleteComponent(name, parent);
};

// url path解析是支持变量的;
// 有些变量是共通的(比如indices, 就是一串数字), 不需要每个path单独注册的;
// 我们把相应的默认值放在这个函数里面
const _parametrizedComponentFactories = {
  getComponent: function (name: string, parent: any, provideDefault: any) {
    if (this[name]) {
      return this[name];
    } else if (provideDefault) {
      return _idAutocompleteComponentFactory;
    }
  },
  index: function (name: string, parent: any) {
    if (isNotAnIndexName(name)) return;
    return new IndexAutocompleteComponent(name, parent, false);
  },
  indices: function (name: string, parent: any) {
    if (isNotAnIndexName(name)) return;
    return new IndexAutocompleteComponent(name, parent, true);
  },
  type: function (name: string, parent: any) {
    return new TypeAutocompleteComponent(name, parent, false);
  },
  types: function (name: string, parent: any) {
    return new TypeAutocompleteComponent(name, parent, true);
  },
  id: function (name: string, parent: any) {
    return _idAutocompleteComponentFactory(name, parent);
  },
  transform_id: function (name: string, parent: any) {
    return _idAutocompleteComponentFactory(name, parent);
  },
  username: function (name: string, parent: any) {
    return new UsernameAutocompleteComponent(name, parent);
  },
  user: function (name: string, parent: any) {
    return new UsernameAutocompleteComponent(name, parent);
  },
  template: function (name: string, parent: any) {
    return new TemplateAutocompleteComponent(name, parent);
  },
  task_id: function (name: string, parent: any) {
    return _idAutocompleteComponentFactory(name, parent);
  },
  ids: function (name: string, parent: any) {
    return _idAutocompleteComponentFactory(name, parent);
  },
  fields: function (name: string, parent: any) {
    return new FieldAutocompleteComponent(name, parent, true);
  },
  field: function (name: string, parent: any) {
    return new FieldAutocompleteComponent(name, parent, false);
  },
  nodes: function (name: string, parent: any) {
    return new ListComponent(
      name,
      [
        "_local",
        "_master",
        "data:true",
        "data:false",
        "master:true",
        "master:false",
      ],
      parent
    );
  },
  node: function (name: string, parent: any) {
    return new ListComponent(name, [], parent, false);
  },
};

export function getUnmatchedEndpointComponents() {
  return ACTIVE_API.getUnmatchedEndpointComponents();
}

export function getEndpointDescriptionByEndpoint(endpoint: string) {
  return ACTIVE_API.getEndpointDescriptionByEndpoint(endpoint);
}

export function getEndpointBodyCompleteComponents(endpoint: string) {
  const desc = getEndpointDescriptionByEndpoint(endpoint);
  if (!desc) {
    throw new Error("failed to resolve endpoint ['" + endpoint + "']");
  }
  return desc.bodyAutocompleteRootComponents;
}

export function getTopLevelUrlCompleteComponents(method: string) {
  return ACTIVE_API.getTopLevelUrlCompleteComponents(method);
}

export function getGlobalAutocompleteComponents(
  term: any,
  throwOnMissing: any
) {
  return ACTIVE_API.getGlobalAutocompleteComponents(term, throwOnMissing);
}

function loadApisFromJson(
  json: any,
  urlParametrizedComponentFactories?: any,
  bodyParametrizedComponentFactories?: any
) {
  urlParametrizedComponentFactories =
    urlParametrizedComponentFactories || _parametrizedComponentFactories;

  bodyParametrizedComponentFactories =
    bodyParametrizedComponentFactories || urlParametrizedComponentFactories;

  const api: any = new (Api as any)(
    urlParametrizedComponentFactories,
    bodyParametrizedComponentFactories
  );
  const names: string[] = [];
  forEach(json, function (apiJson: any, name: string) {
    names.unshift(name);
    // FIXME: global autocomplete seem useless for us, pay attention to this later;
    forEach(apiJson.globals || {}, function (globalJson, globalName) {
      // console.info("xxx", globalName, globalJson);
      api.addGlobalAutocompleteRules(globalName, globalJson);
    });
    forEach(apiJson.endpoints || {}, function (
      endpointJson: any,
      endpointName: string
    ) {
      api.addEndpointDescription(endpointName, endpointJson);
    });
  });
  api.name = names.join(",");
  return api;
}
// register autocomplete components to apis
ACTIVE_API = loadApisFromJson(API_Endpoints);
