/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {
  SharedComponent,
  ConstantComponent,
  AcceptEndpointComponent,
  ListComponent,
  SimpleParamComponent,
} from "./index";
import { METHODS } from "../../../consts";
import { FullRequestComponent } from "./full_request_component";

/**
 * @param parametrizedComponentFactories a dict of the following structure
 * that will be used as a fallback for pattern parameters (i.e.: {indices})
 * {
 *   indices: function (part, parent) {
 *      return new SharedComponent(part, parent)
 *   }
 * }
 * @constructor
 */
export class UrlPatternMatcher {
  constructor(parametrizedComponentFactories) {
    // We'll group endpoints by the methods which are attached to them,
    // to avoid suggesting endpoints that are incompatible with the
    // method that the user has entered.
    METHODS.forEach((method) => {
      this[method] = {
        rootComponent: new SharedComponent("ROOT"),
        parametrizedComponentFactories: parametrizedComponentFactories || {
          getComponent: () => {},
        },
      };
    });
  }
  addEndpoint(pattern, endpoint) {
    // the parttern is endpoints[key].patterns's items
    // endpoint is endpoints[key]
    endpoint.methods.forEach((method) => {
      let c; // c is a temp value which will be assignment to activeComponent
      let activeComponent = this[method].rootComponent;
      // FIXME: Useless for us at the moment Check this later
      if (endpoint.template) {
        new FullRequestComponent(
          pattern + "[body]",
          activeComponent,
          endpoint.template
        );
      }
      const endpointComponents = endpoint.url_components || {};
      const partList = pattern.split("/");
      partList.forEach(
        function (part, partIndex) {
          // 有变量
          if (part.search(/^{.+}$/) >= 0) {
            part = part.substr(1, part.length - 2); // delete '{' and '}', get content inside
            const target = activeComponent.getComponent(part);
            // we already have something for this, reuse
            if (target) {
              activeComponent = target;
              return;
            }
            // a new path, resolve.
            if ((c = endpointComponents[part])) {
              // endpoint specific. Support list
              c = Array.isArray(c)
                ? new ListComponent(part, c, activeComponent)
                : // TODO: why don't push activeComponent here? And since it's not in main tree, how could be found anyway?
                  new SharedComponent(part);
            } else if (
              // 如果变量的内容没有被endpoint定义, 我们到默认值里面找找
              (c = this[method].parametrizedComponentFactories.getComponent(
                part
              ))
            ) {
              // c is a function
              c = c(part, activeComponent);
            } else {
              // 如果默认值里面也没有, just accept whatever with not suggestions
              c = new SimpleParamComponent(part, activeComponent);
            }
            activeComponent = c;
            // ----------------- first if end ------------------------
          } else {
            // 当前lookAhead始终是不包含变量的纯字符串. 如果后面有变量, 跳出循环, 如果没有就拼接上;
            // 最终生成一个ConstantComponent, 并作为当前activeComponent的child.
            let lookAhead = part;
            for (partIndex++; partIndex < partList.length; partIndex++) {
              const cur = partList[partIndex];
              if (cur.indexOf("{") >= 0) {
                break;
              }
              lookAhead += "/" + cur;
            }
            const target = activeComponent.getComponent(part);
            if (target) {
              // we already have something for this, reuse
              activeComponent = target;
              // here activeComponent is a ConstantComponent, so it could use addOption
              activeComponent.addOption(lookAhead);
            } else {
              c = new ConstantComponent(part, activeComponent, lookAhead);
              activeComponent = c;
            }
          }
        }.bind(this)
      );
      // mark end of endpoint path
      new AcceptEndpointComponent(endpoint, activeComponent);
    });
  }
  getTopLevelComponents = function (method) {
    const methodRoot = this[method];
    if (!methodRoot) {
      return [];
    }
    return methodRoot.rootComponent.next;
  };
}
