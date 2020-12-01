import { createWithApollo } from "./createWithApollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { PaginatedPosts } from "../generated/graphql";
import { NextPageContext } from "next";
import { NEXT_PUBLIC_API_URL } from "../config/config";

const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    uri: NEXT_PUBLIC_API_URL as string,
    credentials: "include",
    headers: {
      cookie:
        (typeof window === "undefined"
          ? ctx?.req?.headers.cookie
          : undefined) || "",
    },
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: [],
              merge(
                existing: PaginatedPosts | undefined,
                incoming: PaginatedPosts
              ): PaginatedPosts {
                return {
                  ...incoming,
                  posts: [...(existing?.posts || []), ...incoming.posts],
                };
              },
            },
          },
        },
      },
    }),
  });

export const withApollo = createWithApollo(createClient);
// import { ApolloClient, InMemoryCache } from "@apollo/client";
// import { createWithApollo } from "../utils/createWithApollo";
// import { PaginatedPosts } from "../generated/graphql";
// import { GRAPHQL_URL } from "../config/config";
// import { NextPageContext } from "next";

// const createClient = (ctx: NextPageContext) => {
//   new ApolloClient({
//     uri: GRAPHQL_URL,
//     credentials: "include" as const,
//     headers: {
//       cookie:
//         (typeof window === "undefined" ? ctx.req?.headers.cookie : undefined) ||
//         "",
//     },
//     cache: new InMemoryCache({
//       typePolicies: {
//         Query: {
//           fields: {
//             posts: {
//               keyArgs: [],
//               merge(
//                 existing: PaginatedPosts | undefined,
//                 incoming: PaginatedPosts
//               ): PaginatedPosts {
//                 console.log(existing, incoming);
//                 return {
//                   ...incoming,
//                   posts: [...(existing?.posts || []), ...incoming.posts],
//                 };
//               },
//             },
//           },
//         },
//       },
//     }),
//   });
// };

// export const withApollo = createWithApollo(createClient);
