import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import isServer from "../utils/isServer";
import { useApolloClient } from "@apollo/client";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const { data, loading } = useMeQuery({ skip: isServer() });
  const apolloClient = useApolloClient();
  let body = null;
  if (loading) {
    // data is being fetched
  } else if (!data?.me) {
    // user is not logged in
    body = (
      <>
        <NextLink href="/login">
          <Link color="white" mr={4}>
            Log In
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex align="center">
        <Box mr={6}>
          <NextLink href="/create-post">
            <Button as={Link} mr={4}>
              create post
            </Button>
          </NextLink>
        </Box>
        <Box mr={4}>{data.me.username}</Box>
        <Button
          onClick={async () => {
            await logout();
            apolloClient.resetStore();
          }}
          isLoading={logoutLoading}
          variant="link"
          color="block"
        >
          Log Out
        </Button>
      </Flex>
    );
    // user is logged in
  }
  return (
    <Flex zIndex={1} position="sticky" top={0} bg="#0af" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading color="white">Gareddit</Heading>
          </Link>
        </NextLink>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};

export default NavBar;
