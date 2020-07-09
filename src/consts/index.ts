export const DEFAULT_INPUT_VALUE = 
`GET _cluster/health?level="cluster"

POST _cluster/reroute
{
  "move":{
    "index": "", 
    "shard": 0, 
    "from_node": "", 
    "to_node": ""
  }
}
`;

export const METHODS = ["HEAD", "GET", "PUT", "POST", "DELETE"];

export const INTERVAL = 25;
