import { usePostQuery } from "../generated/graphql";

export const getPostFromUrlById = (id: number) => {
  return usePostQuery({
    pause: id === -1,
    variables: {
      id,
    },
  });
};
