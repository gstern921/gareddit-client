import React from "react";
import { Form, Formik } from "formik";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useLoginMutation, MeQuery, MeDocument } from "../generated/graphql";
import toErrorMap from "../utils/toErrorMap";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { withApollo } from "../utils/withApollo";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const router = useRouter();
  const [login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          const res = await login({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.login.user,
                },
              });
              cache.evict({ fieldName: "posts{}" });
            },
          });
          const user = res.data?.login.user;
          if (res.data?.login.errors) {
            console.log(res.data.login.errors);
            setErrors(toErrorMap(res.data.login.errors));
          } else if (user) {
            const redirectedFrom =
              router.query.next && Array.isArray(router.query.next)
                ? router.query.next[0]
                : router.query.next;
            router.push(redirectedFrom || "/");
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
                <Link mt={1} ml="auto">
                  Forgot password?
                </Link>
              </NextLink>
            </Flex>
            <Box mt={4}>
              <Button
                mt={-4}
                type="submit"
                backgroundColor="#0af"
                color="#fff"
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

export default withApollo({ ssr: false })(Login);
