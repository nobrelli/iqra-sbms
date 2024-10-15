import { DeleteConfirmModalHandle } from "@/types/modals";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { RefObject } from "react";

interface TableDeleteActionButtonProps<Data> {
  modalRef: RefObject<DeleteConfirmModalHandle<Data>>
  deleteProps: Data
}

export const TableDeleteActionButton = <Data,>(props: TableDeleteActionButtonProps<Data>) => {
  const { modalRef, deleteProps } = props

  const handleClick = () => {
    if (modalRef.current) {
      modalRef.current.setDeleteProps(deleteProps)
      modalRef.current.open()
    }
  }

  return (
    <Tooltip label="Delete">
      <ActionIcon
        variant="light"
        color="red"
        size="lg"
        aria-label="Delete"
        onClick={handleClick}
      >
        <IconTrash />
      </ActionIcon>
    </Tooltip>
  )
}