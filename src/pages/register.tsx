import React from "react";
import { Form, Formik } from "formik";
import { Box, Button } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useRegisterMutation, MeQuery, MeDocument } from "../generated/graphql";
import toErrorMap from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withApollo } from "../utils/withApollo";

interface registerProps {}

const Register: React.FC<registerProps> = () => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "", email: "" }}
        onSubmit={async (values, { setErrors }) => {
          const res = await register({
            variables: { options: values },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: { __typename: "Query", me: data?.register.user },
              });
            },
          });
          const registerErrors = res.data?.register.errors;
          const user = res.data?.register.user;
          if (registerErrors) {
            setErrors(toErrorMap(registerErrors));
          } else if (user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              type="text"
              name="username"
              placeholder="username"
              label="User Name"
            ></InputField>

            <Box mt={4}>
              <InputField
                type="email"
                name="email"
                placeholder="email"
                label="Email"
              ></InputField>
            </Box>

            <Box mt={4}>
              <InputField
                type="password"
                name="password"
                placeholder="password"
                label="Password"
              ></InputField>
            </Box>
            <Box mt={4}>
              <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
                Register
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Register);
