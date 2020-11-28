import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";
import { withApollo } from "../utils/withApollo";

function MyApp({ Component, pageProps }: any) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default withApollo({ ssr: true })(MyApp);
