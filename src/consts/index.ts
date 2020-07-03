export const DEFAULT_INPUT_VALUE = `GET _cluster/state

POST _aliases
{
  "actions": [
    {
      "add": {
        "index": "test1",
        "alias": "alias1"
      }
    }
  ]
}

POST _add
{

}

PUT delete
{
  "a": {
    "b": "b",
    "c": "c"
  }
}

GET _search
{
  "query": {
    "match_all": {}
  }
}

POST _add
{
  "a": {
    "b": false,
    "c": {}
  }
}

POST _add
{
  "a": {
    "e": "b",
    "f": "c"
  }
}

PUT delete
{
  "a": {
    "b": "b",
    "c": "c"
  }
}
`;

export const METHODS = ["HEAD", "GET", "PUT", "POST", "DELETE"];
