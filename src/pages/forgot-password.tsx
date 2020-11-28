import React, { useState } from "react";
import { Form, Formik } from "formik";
import { Box, Button } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useForgotPasswordMutation } from "../generated/graphql";
import { useRouter } from "next/router";

const ForgotPassword: React.FC<{}> = () => {
  const router = useRouter();
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setErrors }) => {
          await forgotPassword({ variables: { email: values.email } });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              We sent a password reset email to the address you provided
            </Box>
          ) : (
            <Form>
              <InputField
                type="email"
                name="email"
                placeholder="email"
                label="Email"
              ></InputField>
              <Box mt={4}>
                <Button
                  type="submit"
                  colorScheme="teal"
                  isLoading={isSubmitting}
                >
                  Send Password Reset Email
                </Button>
              </Box>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default ForgotPassword;
