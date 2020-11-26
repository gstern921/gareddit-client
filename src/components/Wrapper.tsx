import { Box } from "@chakra-ui/react";
import React from "react";

interface WrapperProps {
  variant?: "small" | "regular";
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant, ...props }) => {
  let maxWidth = "800px";
  if (variant === "small") {
    maxWidth = "400px";
  }
  return (
    <Box mt={4} mx="auto" maxWidth={maxWidth} w="100%" {...props}>
      {children}
    </Box>
  );
};

export default Wrapper;
