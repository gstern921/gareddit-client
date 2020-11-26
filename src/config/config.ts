const NODE_ENV = process.env.NODE_ENV || "development";
export const IS_PROD = NODE_ENV !== "development";
export const GRAPHQL_URL = "http://localhost:4000/graphql";
