import { usePostQuery } from "../generated/graphql";

export const getPostFromUrlById = (id: number) => {
  return usePostQuery({
    variables: {
      id,
    },
  });
};
