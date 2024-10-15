import { FormModalHandle } from "@/types/modals";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { RefObject } from "react";

interface TableEditActionButtonProps<Data> {
  modalRef: RefObject<FormModalHandle<Data>>
  initData: Data
}

export const TableEditActionButton = <Data,>(props: TableEditActionButtonProps<Data>) => {
  const { modalRef, initData } = props
  
  const handleClick = () => {
    if (modalRef.current) {
      modalRef.current.setInitialData!(initData)
      modalRef.current.open()
    }
  }

  return (
    <Tooltip label="Edit">
      <ActionIcon
        variant="light"
        color="green"
        size="lg"
        aria-label="Edit"
        onClick={handleClick}
      >
        <IconEdit />
      </ActionIcon>
    </Tooltip>
  )
}