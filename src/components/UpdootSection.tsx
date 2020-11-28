import { ApolloCache } from "@apollo/client";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import gql from "graphql-tag";
import React from "react";
import { useState } from "react";
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [updootLoading, setUpdootLoading] = useState<boolean>(false);
  const [downdootLoading, setDowndootLoading] = useState<boolean>(false);
  const [vote] = useVoteMutation();
  const updateAfterVote = (
    value: number,
    postId: number,
    cache: ApolloCache<VoteMutation>
  ) => {
    const data = cache.readFragment<{
      id: number;
      points: number;
      voteStatus: number | null;
    }>({
      id: "Post:" + post.id,
      fragment: gql`
        fragment _ on Post {
          id
          points
          voteStatus
        }
      `,
    });
    if (data) {
      if (data.voteStatus === value) {
        return;
      }
      const newPoints =
        (data.points as number) + (data.voteStatus ? 2 * value : value);

      cache.writeFragment({
        id: "Post:" + postId,
        fragment: gql`
          fragment __ on Post {
            id
            points
            voteStatus
          }
        `,
        data: { points: newPoints, voteStatus: value },
      });
    }
  };
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          if (post.voteStatus && post.voteStatus > 0) {
            return;
          }
          setUpdootLoading(true);
          const successful = await vote({
            variables: { value: 1, postId: post.id },
            update: (cache) => {
              updateAfterVote(1, post.id, cache);
              setUpdootLoading(false);
            },
          });
        }}
        aria-label="Upvote this post"
        color={post.voteStatus && post.voteStatus > 0 ? "#bbb" : "black"}
        variant="true"
        isLoading={updootLoading}
        icon={<ChevronUpIcon fontSize="28px" />}
      ></IconButton>
      {post.points}
      <IconButton
        onClick={async () => {
          if (post.voteStatus && post.voteStatus < 0) {
            return;
          }
          setDowndootLoading(true);
          const successful = await vote({
            variables: { value: -1, postId: post.id },
            update: (cache) => {
              updateAfterVote(-1, post.id, cache);
              setDowndootLoading(false);
            },
          });
        }}
        aria-label="Downvote this post"
        color={post.voteStatus && post.voteStatus < 0 ? "#bbb" : "black"}
        variant="true"
        isLoading={downdootLoading}
        icon={<ChevronDownIcon fontSize="28px" />}
      ></IconButton>
    </Flex>
  );
};
