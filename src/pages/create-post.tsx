import { Box, Button, Textarea } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import { useCreatePostMutation } from "../generated/graphql";
import Layout from "../components/Layout";
import { useIsAuth } from "../utils/useIsAuth";
import { useState } from "react";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [createPost] = useCreatePostMutation();
  const [textAreaValue, setTextAreaValue] = useState("");

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", abc: "" }}
        onSubmit={async (values, { setErrors }) => {
          // console.log(values);
          const { errors } = await createPost({
            variables: {
              input: {
                title: values.title,
                text: textAreaValue,
              },
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
                  setTextAreaValue(e.target.value);
                }}
                name="abc"
                placeholder="text..."
              ></Textarea>
            </Box>
            <Box mt={4}>
              <Button
                mt={-4}
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
              >
                Create Post
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default CreatePost;
