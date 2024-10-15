import { DeleteFeeConfirmModalHandle } from '@/components/modals/FeeModals'
import { TableDeleteActionButton } from '@/components/tables/TableDeleteActionButton'
import { TableEditActionButton } from '@/components/tables/TableEditActionButton'
import { FormModalHandle } from '@/types/modals'
import { Fee } from '@/types/schemas'
import { formatAmount, formatDateTime } from '@/utils/formatters'
import { Group } from '@mantine/core'
import { createColumnHelper } from '@tanstack/react-table'
import { RefObject } from 'react'

const columnHelper = createColumnHelper<Fee>()

export const feeColumnDefinition = (
  editModalRef: RefObject<FormModalHandle<Fee>>,
  deleteModalRef: RefObject<DeleteFeeConfirmModalHandle>
) => [
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      size: 5,
      cell: ({ row }) => (
        <Group gap="sm">
          <TableEditActionButton
            modalRef={editModalRef}
            initData={row.original}
          />
          <TableDeleteActionButton
            modalRef={deleteModalRef}
            deleteProps={{ 
              feeName: row.original.description,
              rowId: row.id
             }}
          />
        </Group>
      )
    }),
    columnHelper.accessor('id', {
      header: 'ID',
    }),
    columnHelper.accessor(({ created }) =>
      formatDateTime(created!), {
      id: 'created',
      header: 'Created',
    }),
    columnHelper.accessor('description', {
      header: 'Description',
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: cell => formatAmount(cell.getValue())
    })
  ]