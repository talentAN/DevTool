1. A textarea in a div as \$editorRef;
2. editor = senseEditor.create(editorRef.current!)
   => get coreEditor from legacy_core_editor => return new SenseEditor(coreEditor)
3.

### what in SenseEditor

currentReqRange
parser
autocomplete

### what in CoreEditor

there's a lot event listener in CoreEditor, and the callback should be registered when new SenseEditor

### Issue List

- custom actions
- smart resize => always keep current top line in view
- smart paste => format curl to json automatically
  - match curl paste
  - parse curl paste
- autocomplete

  - fn chain
    => recognize type by position(method, url_path, url_parameter...)
    => get recommonded suggestions
    - 本质上是把路径切割成一块一块, 然后用一棵树去进行分段查找
    - 自动补全要支持你输入的字符串不一定是开头, 要可以拼接, 所以要处理这个地方的查找会比较复杂.
    -
    => replace
  - method
  - url_path
  - url_parameter
  - body
  - todos:
    - what globals for?
    - what endpoints for?
    - what **flag** for ?
    - what patterns for? => 语法识别
      - {indices} => 猜测为系统保留字 目前看来是数字
      - {type} => 猜测为系统保留字
      - {id} => => 猜测为系统保留字
      - {metrics} => defined in url_components
    - what documentation for ?
    - what templates for ?
    - what url_components for ?

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

* why autocomplete seperate to so many component
  - what's the difference and common
