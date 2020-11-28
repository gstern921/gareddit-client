import { usePostsQuery, useMeQuery } from "../generated/graphql";
import Layout from "../components/Layout";
import NextLink from "next/link";
import {
  Link,
  Stack,
  Box,
  Heading,
  Text,
  Flex,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { UpdootSection } from "../components/UpdootSection";
import EditPostButton from "../components/EditPostButton";
import DeletePostButton from "../components/DeletePostButton";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const { data, loading } = usePostsQuery({ variables });
  const { data: meData } = useMeQuery();

  const posts = data ? data.posts.posts : [];

  return (
    <Layout>
      {!data ? (
        loading ? (
          <div>Loading...</div>
        ) : (
          <div>No posts to show</div>
        )
      ) : (
        <Stack mt={2} spacing={0}>
          {posts.map((post) => {
            const showButtons =
              meData && meData.me && meData.me.id === post.creator.id;
            return !post ? null : (
              <Flex
                key={post.id}
                p={5}
                minHeight="200px"
                maxHeight="300px"
                my={4}
                shadow="md"
                borderWidth="1px"
                overflowY="hidden"
              >
                <UpdootSection post={post}></UpdootSection>
                <Flex
                  alignItems="center"
                  flex={1}
                  alignContent="stretch"
                  wordBreak="break-word"
                  mr={2}
                >
                  <Box>
                    <NextLink href={`/post/[id]`} as={`/post/${post.id}`}>
                      <Link>
                        <Heading display="inline-block" fontSize="xl">
                          {post.title}
                        </Heading>
                      </Link>
                    </NextLink>
                    <br />
                    <Text display="inline-block" fontSize=".8rem" color="#444">
                      posted by {post.creator.username}
                    </Text>
                    <Text mt={4}>{post.textSnippet}</Text>
                  </Box>
                </Flex>
                <Flex ml="auto" direction="column" justifyContent="center">
                  <EditPostButton
                    show={showButtons}
                    id={post.id}
                  ></EditPostButton>
                  <br />
                  <DeletePostButton
                    show={showButtons}
                    id={post.id}
                  ></DeletePostButton>
                </Flex>
              </Flex>
            );
          })}
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
            isLoading={loading}
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

export default Index;
