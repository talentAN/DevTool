### Issue List
- main concepts:
  - token
  - 
- main functions:
  - custom actions
  - smart
    - resize => always keep current top line in view
    - paste => format curl to json automatically
  - curl request
    - auto parse curl past
    - get request in curl type when copy
  - autocomplete
    - fn chain
      1. register description in API
      2. get Context
      - method
      - token
      - otherTokenValues
      - urlTokenPath
      3. get recommonded suggestions from description registered before;
      - 本质上是把路径切割成一块一块, 然后用一棵树去进行分段查找
      - 自动补全要支持你输入的字符串不一定是开头, 要可以拼接, 所以要处理这个地方的查找会比较复杂.
        => replace
    - body
    - TODO:
      - what globals for?
      - what endpoints for => 补全
      - what **flag** for ?
      - what patterns for? => 语法识别
        - {indices} => 目前看来是数字变量
        - {type}
        - {id}
        - {metrics}
      - what documentation for ?
      - what templates for ?
      - what url_components for => 给变量用的

  ```javascript
  // structer of endpoints[key]
  var endpoints = {
    key: {
      methods: [], // methods can be used
      patterns: [
        "_cluster/state",
        "_cluster/state/{metrics}",
        "_cluster/state/{metrics}/{indices}",
      ], // target path that matches. metrics and indices are defined in url_components
      url_componets: {}, // variables used in patterns
      data_autocomplete_rules:{} // params to autocomplete
      documentation: "", // the api's documentation,
      id: "key", // the key of this object
    },
  };
  ```

- highlight current requests

  - not done yet

- why autocomplete seperate to so many component
  - what's the difference and common

```javascript
type Ret = {
  method: string,
  token: any,
  otherTokenValues: any,
  urlTokenPath: any,
  requestStartRow: any,
  bodyTokenPath: any,
  urlParamsTokenPath: any,
};
```
