import {
  TypeAutocompleteComponent,
  IdAutocompleteComponent,
  IndexAutocompleteComponent,
  FieldAutocompleteComponent,
  ListComponent,
  TemplateAutocompleteComponent,
  UsernameAutocompleteComponent,
} from "../autocomplete/components";

import _ from "lodash";
import { API_Endpoints } from "../../mocks/API_Endpoints";
import Api from "./api";

let ACTIVE_API = new Api();

const isNotAnIndexName = (name) => name[0] === "_" && name !== "_all";

const _idAutocompleteComponentFactory = (name, parent) => {
  return new IdAutocompleteComponent(name, parent);
};
const _parametrizedComponentFactories = {
  getComponent: function (name, parent, provideDefault) {
    if (this[name]) {
      return this[name];
    } else if (provideDefault) {
      return _idAutocompleteComponentFactory;
    }
  },
  index: function (name, parent) {
    if (isNotAnIndexName(name)) return;
    return new IndexAutocompleteComponent(name, parent, false);
  },
  indices: function (name, parent) {
    if (isNotAnIndexName(name)) return;
    return new IndexAutocompleteComponent(name, parent, true);
  },
  type: function (name, parent) {
    return new TypeAutocompleteComponent(name, parent, false);
  },
  types: function (name, parent) {
    return new TypeAutocompleteComponent(name, parent, true);
  },
  id: function (name, parent) {
    return _idAutocompleteComponentFactory(name, parent);
  },
  transform_id: function (name, parent) {
    return _idAutocompleteComponentFactory(name, parent);
  },
  username: function (name, parent) {
    return new UsernameAutocompleteComponent(name, parent);
  },
  user: function (name, parent) {
    return new UsernameAutocompleteComponent(name, parent);
  },
  template: function (name, parent) {
    return new TemplateAutocompleteComponent(name, parent);
  },
  task_id: function (name, parent) {
    return _idAutocompleteComponentFactory(name, parent);
  },
  ids: function (name, parent) {
    return _idAutocompleteComponentFactory(name, parent, true);
  },
  fields: function (name, parent) {
    return new FieldAutocompleteComponent(name, parent, true);
  },
  field: function (name, parent) {
    return new FieldAutocompleteComponent(name, parent, false);
  },
  nodes: function (name, parent) {
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
  node: function (name, parent) {
    return new ListComponent(name, [], parent, false);
  },
};

export function getUnmatchedEndpointComponents() {
  return ACTIVE_API.getUnmatchedEndpointComponents();
}

export function getEndpointDescriptionByEndpoint(endpoint) {
  return ACTIVE_API.getEndpointDescriptionByEndpoint(endpoint);
}

export function getEndpointBodyCompleteComponents(endpoint) {
  const desc = getEndpointDescriptionByEndpoint(endpoint);
  if (!desc) {
    throw new Error("failed to resolve endpoint ['" + endpoint + "']");
  }
  return desc.bodyAutocompleteRootComponents;
}
//TODO:
export function getTopLevelUrlCompleteComponents(method) {
  return ACTIVE_API.getTopLevelUrlCompleteComponents(method);
}

export function getGlobalAutocompleteComponents(term, throwOnMissing) {
  return ACTIVE_API.getGlobalAutocompleteComponents(term, throwOnMissing);
}

function loadApisFromJson(
  json,
  urlParametrizedComponentFactories = _parametrizedComponentFactories,
  bodyParametrizedComponentFactories
) {
  bodyParametrizedComponentFactories =
    bodyParametrizedComponentFactories || urlParametrizedComponentFactories;

  const api = new Api(
    urlParametrizedComponentFactories,
    bodyParametrizedComponentFactories
  );
  const names = [];
  _.each(json, function (apiJson, name) {
    names.unshift(name);
    // FIXME: global autocomplete seem useless for us, pay attention to this later;
    // _.each(apiJson.globals || {}, function (globalJson, globalName) {
    //   console.info("xxx", globalName, globalJson);
    //   api.addGlobalAutocompleteRules(globalName, globalJson);
    // });
    _.each(apiJson.endpoints || {}, function (endpointJson, endpointName) {
      api.addEndpointDescription(endpointName, endpointJson);
    });
  });
  api.name = names.join(",");
  return api;
}
// add autocomplete components to apis
ACTIVE_API = loadApisFromJson(API_Endpoints);
