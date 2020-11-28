import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import EditPostButton from "../../components/EditPostButton";
import Layout from "../../components/Layout";
import { useMeQuery } from "../../generated/graphql";
import { getIntIdFromUrl } from "../../utils/useGetIntIdFromUrl";
import { getPostFromUrlById } from "../../utils/useGetPostFromUrlById";
import DeletePostButton from "../../components/DeletePostButton";
import { withApollo } from "../../utils/withApollo";

const Post = () => {
  const intId = getIntIdFromUrl();
  const { data, loading } = getPostFromUrlById(intId);
  const { data: meData, loading: loadingingMeData } = useMeQuery();

  if (loading || loadingingMeData) {
    return <Layout>Loading...</Layout>;
  }

  if (!data || !data.post) {
    return (
      <Layout>
        <Box> No post found</Box>
      </Layout>
    );
  }

  const showEditAndDeleteButtons =
    meData != undefined &&
    meData.me != undefined &&
    meData.me.id === data.post.creator.id;

  return (
    <Layout>
      <Heading mb={4}>{data.post.title}</Heading>
      <Box mb={4}>{data.post.text}</Box>
      <EditPostButton
        show={showEditAndDeleteButtons}
        id={data.post.id}
      ></EditPostButton>
      <DeletePostButton
        show={showEditAndDeleteButtons}
        id={data.post.id}
      ></DeletePostButton>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
