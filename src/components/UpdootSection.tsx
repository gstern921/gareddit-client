import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [updootLoading, setUpdootLoading] = useState<boolean>(false);
  const [downdootLoading, setDowndootLoading] = useState<boolean>(false);
  const [, vote] = useVoteMutation();
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          setUpdootLoading(true);
          const successful = await vote({ value: 1, postId: post.id });
          setUpdootLoading(false);
        }}
        aria-label="Upvote this post"
        isLoading={updootLoading}
        icon={<ChevronUpIcon fontSize="28px" />}
      ></IconButton>
      {post.points}
      <IconButton
        onClick={async () => {
          setDowndootLoading(true);
          const successful = await vote({ value: -1, postId: post.id });
          setDowndootLoading(false);
        }}
        aria-label="Downvote this post"
        isLoading={downdootLoading}
        icon={<ChevronDownIcon fontSize="28px" />}
      ></IconButton>
    </Flex>
  );
};
