import { DeleteIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import React from "react";
import { useDeletePostMutation } from "../generated/graphql";

interface DeleteButtonProps {
  id: number;
  fontSize?: string | undefined;
  show: boolean;
}

const DeletePostButton: React.FC<DeleteButtonProps> = ({
  id,
  fontSize,
  show,
}) => {
  const [deletePost] = useDeletePostMutation();
  return show ? (
    <IconButton
      onClick={async () => {
        await deletePost({ variables: { id } });
      }}
      variant=""
      fontSize={fontSize || "20px"}
      aria-label="Delete Post"
      icon={<DeleteIcon></DeleteIcon>}
    ></IconButton>
  ) : null;
};

export default DeletePostButton;
