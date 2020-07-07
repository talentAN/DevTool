### Issue List

- main concepts:
  - token
  - terms(条件)
- main classes
  - Autocomplete
  - RowParser
  - \*\*Component
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

      4. 替换

    - TODO:
      - what globals for?
      - what templates for ?

- highlight current requests

```javascript
const API_Endpoints = {
  examble_version_1: {
    name: "examble_version_1",
    globals: {}, //TODO:
    endpoints: {
      key: {
        url_params: {
          value_empty: "", // the value is empty, means only autocomplete the key,
          value_list: ["a", "b", "c", "d"], // the value is array, the cdds to autocomplete
          value_flag: "__flag__", // the value is true or false, flag will show in meta
        },
        url_components: {
          indices: null,
          metrics: [
            "indexing",
            "merge",
            "query_cache",
            "refresh",
            "request_cache",
            "search",
            "segments",
            "store",
            "suggest",
            "warmer",
          ],
        }, // variables used in url path, if null ,will fall back to default autocomplete or nothing
        methods: ["GET", "POST", "PUT"], // the methods supported by this patterns,
        patterns: ["_bulk", "{indices}/_bulk", "{indices}/{metrics}/_bulk"], // the patterns means the paths to be supported, we support both ordinal string and variables here
        data_autocomplete_rules: {}, // often used in body autocomplete
        documentation:
          "http://www.elastic.co/guide/en/elasticsearch/reference/master/docs-bulk.html", // the doc link of this path
        id: "key", // the key of this examble
      },
    },
  },
};
```
