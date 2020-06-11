
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
