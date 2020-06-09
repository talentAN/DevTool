
export const DEFAULT_INPUT_VALUE = 
`GET _search
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

POST delete
{
  "a": {
    "b": "b",
    "c": "c"
  }
}
`;
