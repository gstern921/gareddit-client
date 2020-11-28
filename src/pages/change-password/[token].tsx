import { Box, Button, Link, Flex } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import React, { useState } from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import toErrorMap from "../../utils/toErrorMap";
import { useChangePasswordMutation } from "../../generated/graphql";
import { useRouter } from "next/router";
import NextLink from "next/link";

const ChangePassword: NextPage = () => {
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, settokenError] = useState("");
  const router = useRouter();
  const token =
    typeof router.query.token === "string" ? router.query.token : "";

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const res = await changePassword({
            variables: {
              token,
              newPassword: values.newPassword,
            },
          });
          const user = res.data?.changePassword?.user;
          if (res.data?.changePassword?.errors) {
            const errorMap = toErrorMap(res.data.changePassword.errors);
            if ("token" in errorMap) {
              settokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              type="password"
              name="newPassword"
              placeholder="new password"
              label="New Password"
            ></InputField>
            {tokenError ? (
              <Flex>
                <Box mr={2} color="#ff0000">
                  {tokenError}
                </Box>
                <NextLink href="/forgot-password">
                  <Link>click here to get a new one</Link>
                </NextLink>
              </Flex>
            ) : null}

            <Box mt={4}>
              <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
                Change Password
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default ChangePassword;
