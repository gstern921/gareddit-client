import { Box, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import EditPostButton from "../../components/EditPostButton";
import Layout from "../../components/Layout";
import { useMeQuery } from "../../generated/graphql";
import createUrqlClient from "../../utils/createUrqlClient";
import { getIntIdFromUrl } from "../../utils/useGetIntIdFromUrl";
import { getPostFromUrlById } from "../../utils/useGetPostFromUrlById";
import { isPostEditableByUser } from "../../utils/IsPostEditableByUser";
import DeletePostButton from "../../components/DeletePostButton";

const Post = () => {
  const intId = getIntIdFromUrl();
  const [{ data, fetching }] = getPostFromUrlById(intId);
  const [{ data: meData, fetching: fetchingMeData }] = useMeQuery();

  if (fetching || fetchingMeData) {
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

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
