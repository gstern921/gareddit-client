const NODE_ENV = process.env.NODE_ENV || "development";
export const IS_PROD = NODE_ENV !== "development";
export const GRAPHQL_URL = "https://gareddit-server.herokuapp.com/graphql";
export const NEXT_PUBLIC_API_URL = "https://gareddit-server.herokuapp.com";
