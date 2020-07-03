import _ from "lodash";
import _defaults from "lodash.defaults";
import { UrlPatternMatcher } from "./components";
import { UrlParams } from "./url_params";
import {
  globalsOnlyAutocompleteComponents,
  compileBodyDescription,
} from "./body_completer";

/**
 *
 * @param urlParametrizedComponentFactories a dictionary of factory functions
 * that will be used as fallback for parametrized path part (i.e., {indices} )
 * see UrlPatternMatcher
 * @constructor
 * @param bodyParametrizedComponentFactories same as urlParametrizedComponentFactories but used for body compilation
 */
function Api(
  urlParametrizedComponentFactories: any,
  bodyParametrizedComponentFactories: any
) {
  this.globalRules = Object.create(null);
  this.endpoints = Object.create(null);
  this.urlPatternMatcher = new UrlPatternMatcher(
    urlParametrizedComponentFactories
  );
  this.globalBodyComponentFactories = bodyParametrizedComponentFactories;
  this.name = "";
}

(function (cls) {
  cls.addGlobalAutocompleteRules = function (parentNode: any, rules: any) {
    this.globalRules[parentNode] = compileBodyDescription(
      "GLOBAL." + parentNode,
      rules,
      this.globalBodyComponentFactories
    );
  };

  cls.getGlobalAutocompleteComponents = function (
    term: any,
    throwOnMissing: any
  ) {
    const result = this.globalRules[term];
    if (
      result === undefined &&
      (throwOnMissing || throwOnMissing === undefined)
    ) {
      throw new Error(
        "failed to resolve global components for  ['" + term + "']"
      );
    }
    return result;
  };

  cls.addEndpointDescription = function (
    endpoint: string,
    description: any = {}
  ) {
    // endpoint is the kEY of endpoints;
    // description is endpoints[KEY]
    const copiedDescription: any = {};
    _.extend(copiedDescription, description);
    // Add default in case code break down here.
    _defaults(copiedDescription, {
      id: endpoint,
      patterns: [endpoint],
      methods: ["GET"],
    });
    copiedDescription.patterns.forEach(
      function (p: string) {
        this.urlPatternMatcher.addEndpoint(p, copiedDescription);
      }.bind(this)
    );
    copiedDescription.paramsAutocomplete = new UrlParams(
      copiedDescription.url_params
    );
    copiedDescription.bodyAutocompleteRootComponents = compileBodyDescription(
      copiedDescription.id,
      copiedDescription.data_autocomplete_rules,
      this.globalBodyComponentFactories
    );

    this.endpoints[endpoint] = copiedDescription;
  };

  cls.getEndpointDescriptionByEndpoint = function (endpoint: string) {
    return this.endpoints[endpoint];
  };
  cls.getTopLevelUrlCompleteComponents = function (method: string) {
    return this.urlPatternMatcher.getTopLevelComponents(method);
  };

  cls.getUnmatchedEndpointComponents = function () {
    return globalsOnlyAutocompleteComponents();
  };

  cls.clear = function () {
    this.endpoints = {};
    this.globalRules = {};
  };
})(Api.prototype);

export default Api;
