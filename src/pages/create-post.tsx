import { Box, Flex, Link, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import toErrorMap from "../utils/toErrorMap";
import login from "./login";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [{}, login] = useCreatePostMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const res = await login(values);
          const user = res.data?.login.user;
          if (res.data?.login.errors) {
            setErrors(toErrorMap(res.data.login.errors));
          } else if (user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              type="text"
              name="usernameOrEmail"
              placeholder="username or email"
              label="Username or Email"
            ></InputField>
            <Box mt={4}>
              <InputField
                type="password"
                name="password"
                placeholder="password"
                label="Password"
              ></InputField>
            </Box>
            <Flex>
              <NextLink href="/forgot-password">
                <Link ml="auto">Forgot password?</Link>
              </NextLink>
            </Flex>
            <Box mt={4}>
              <Button
                mt={-4}
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
              >
                Log in
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default CreatePost;
