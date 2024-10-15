import { DeleteDiscountConfirmModalHandle } from '@/components/modals/DiscountModals'
import { TableDeleteActionButton } from '@/components/tables/TableDeleteActionButton'
import { TableEditActionButton } from '@/components/tables/TableEditActionButton'
import { FormModalHandle } from '@/types/modals'
import { Discount } from '@/types/schemas'
import { formatDateTime } from '@/utils/formatters'
import { Group, NumberFormatter } from '@mantine/core'
import { createColumnHelper } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { RefObject } from 'react'

const columnHelper = createColumnHelper<Discount>()

export const discountColumnDefinition = (
  editModalRef: RefObject<FormModalHandle<Discount>>,
  deleteModalRef: RefObject<DeleteDiscountConfirmModalHandle>
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
              discountName: row.original.description,
              rowId: row.id
            }}
          />
        </Group>
      )
    }),
    columnHelper.accessor('id', {
      header: 'ID',
    }),
    columnHelper.accessor('isPercent', {
      header: 'Is Percent',
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
      cell: ({ row: { original: { isPercent } }, cell }) =>
        <NumberFormatter
          prefix={!isPercent ? '₱ ' : undefined}
          decimalScale={isPercent ? 0 : 2}
          fixedDecimalScale
          thousandSeparator
          value={cell.getValue<string>()}
          suffix={isPercent ? '%' : undefined}
        />,
    }),
    columnHelper.accessor(({ validFrom }) =>
      dayjs(validFrom).format('ll'), {
      header: 'Valid from',
    }),
    columnHelper.accessor(({ validUntil }) =>
      validUntil ? dayjs(validUntil).format('ll') : '', {
      header: 'Expires on',
      cell: cell => <span>{!cell.getValue() ? '-' : cell.getValue()}</span>
    })
  ]