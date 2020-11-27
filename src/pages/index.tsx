import { withUrqlClient } from "next-urql";
import createUrqlClient from "../utils/createUrqlClient";
import { usePostsQuery, useDeletePostMutation } from "../generated/graphql";
import Layout from "../components/Layout";
import NextLink from "next/link";
import { ChevronUpIcon, ChevronDownIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Link,
  Stack,
  Box,
  Heading,
  Text,
  Flex,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { UpdootSection } from "../components/UpdootSection";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });
  const [, deletePost] = useDeletePostMutation();

  const posts = data ? data.posts.posts : [];

  return (
    <Layout>
      {!data ? (
        fetching ? (
          <div>Loading...</div>
        ) : (
          <div>No posts to show</div>
        )
      ) : (
        <Stack mt={2} spacing={0}>
          {posts.map((post) => (
            <Flex key={post.id} p={5} my={4} shadow="md" borderWidth="1px">
              <UpdootSection post={post}></UpdootSection>
              <Flex alignItems="center" flex={1}>
                <Flex direction="column">
                  <NextLink href={`/post/[id]`} as={`/post/${post.id}`}>
                    <Link>
                      <Heading fontSize="xl">{post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text fontSize=".8rem" color="#444">
                    posted by {post.creator.username}
                  </Text>
                  <Text mt={4}>{post.textSnippet}</Text>
                </Flex>
                <Flex ml="auto">
                  <IconButton
                    onClick={async () => {
                      await deletePost({ id: post.id });
                    }}
                    right={0}
                    variant=""
                    fontSize="20px"
                    ml="auto"
                    aria-label="Delete Post"
                    icon={<DeleteIcon></DeleteIcon>}
                  ></IconButton>
                </Flex>
              </Flex>
            </Flex>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: posts[posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
