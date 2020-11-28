import { EditIcon } from "@chakra-ui/icons";
import { IconButton, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";

interface EditButtonProps {
  id: number;
  fontSize?: string;
  show: boolean;
}

const EditPostButton: React.FC<EditButtonProps> = ({ id, fontSize, show }) => {
  return show ? (
    <NextLink href={"/post/edit/[id]"} as={`/post/edit/${id}`}>
      <IconButton
        as={Link}
        variant=""
        fontSize={fontSize || "20px"}
        aria-label="Edit Post"
        icon={<EditIcon></EditIcon>}
      ></IconButton>
    </NextLink>
  ) : null;
};

export default EditPostButton;
