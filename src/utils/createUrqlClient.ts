import { dedupExchange, fetchExchange, stringifyVariables } from "@urql/core";
import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import Router from "next/router";
import { Exchange } from "urql";
import { pipe, tap } from "wonka";
import gql from "graphql-tag";
import * as config from "../config/config";
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { VoteMutationVariables } from "../generated/graphql";
import isServer from "./isServer";

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.toLowerCase().includes("not authenticated")) {
        Router.replace("/login");
      }
    })
  );
};

export type MergeMode = "before" | "after";

export interface PaginationParams {
  offsetArgument?: string;
  limitArgument?: string;
  mergeMode?: MergeMode;
}

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isInCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isInCache;
    console.log(`isInCache: `, isInCache);

    const results: string[] = [];
    let hasMore: boolean = true;
    fieldInfos.forEach((fieldInfo) => {
      const key = cache.resolveFieldByKey(
        entityKey,
        fieldInfo.fieldKey
      ) as string;
      const data = cache.resolve(key, "posts") as string[];
      if (!cache.resolve(key, "hasMore")) {
        hasMore = false;
      }
      console.log(data);
      console.log(hasMore);
      results.push(...data);
    });

    const obj = { __typename: "PaginatedPosts", hasMore, posts: results };

    console.log(`thing returned: `, obj);

    return obj;
  };
};

const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = "";
  if (isServer()) {
    cookie = ctx.req.headers.cookie;
  }
  return {
    url: config.GRAPHQL_URL,
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    },

    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            vote: (result, args, cache, info) => {
              const { postId, value } = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: postId } as any
              );
              if (data) {
                if (data.voteStatus === value) {
                  return;
                }
                const newPoints =
                  (data.points as number) +
                  (data.voteStatus ? 2 * value : value);

                cache.writeFragment(
                  gql`
                    fragment __ on Post {
                      id
                      points
                      voteStatus
                    }
                  `,
                  { id: postId, points: newPoints, voteStatus: value } as any
                );
              }
            },
            login: (result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                result,
                (res, query) => {
                  if (res.login.errors) {
                    return query;
                  } else {
                    return {
                      me: res.login.user,
                    };
                  }
                }
              );
            },
            register: (result, args, cache, info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                result,
                (res, query) => {
                  if (res.register.errors) {
                    return query;
                  } else {
                    return {
                      me: res.register.user,
                    };
                  }
                }
              );
            },
            createPost: (result, args, cache, info) => {
              const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === "posts"
              );
              fieldInfos.forEach((info) => {
                cache.invalidate("Query", "posts", info.arguments || {});
              });
            },
            logout: (result, args, cache, info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                result,
                () => ({
                  me: null,
                })
              );
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
export default createUrqlClient;
