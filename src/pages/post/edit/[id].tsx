import { Box, Button, Textarea } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import InputField from "../../../components/InputField";
import { useUpdatePostMutation } from "../../../generated/graphql";
import Layout from "../../../components/Layout";
import { useIsAuth } from "../../../utils/useIsAuth";
import { getPostFromUrlById } from "../../../utils/useGetPostFromUrlById";
import { getIntIdFromUrl } from "../../../utils/useGetIntIdFromUrl";
import { useRouter } from "next/router";
import { withApollo } from "../../../utils/withApollo";

const EditPost: React.FC<{}> = ({}) => {
  const intId = getIntIdFromUrl();
  const { data, loading } = getPostFromUrlById(intId);
  const router = useRouter();

  useIsAuth();
  const [updatePost] = useUpdatePostMutation();
  if (loading) {
    return <div>Loading...</div>;
  } else if (!loading && !data?.post) {
    return <div>could not find post</div>;
  }
  return (
    <Layout variant="small">
      <Formik
        initialValues={{
          title: data?.post?.title || "",
          text: data?.post?.text || "",
        }}
        onSubmit={async (values, { setErrors }) => {
          // console.log(data?.post?.text);
          const { errors } = await updatePost({
            variables: {
              id: intId,
              title: values.title,
              text: data?.post?.text || "",
            },
          });

          if (errors) {
          } else {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              type="text"
              name="title"
              placeholder="title"
              label="Title"
            ></InputField>
            <Box mt={4}>
              <Textarea
                onChange={(e) => {
                  if (data?.post) {
                    data.post.text = e.target.value;
                  }
                  // console.log(data?.post?.text);
                }}
                name="abc"
                placeholder="text..."
              >
                {data?.post?.text || ""}
              </Textarea>
            </Box>
            <Box mt={4}>
              <Button
                mt={-4}
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
              >
                Edit Post
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditPost);
