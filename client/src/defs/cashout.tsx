import { Fee } from '@/types/schemas'
import { formatAmount, formatDateTime } from '@/utils/formatters'
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<Fee>()

export const cashoutColumnDefinition = [
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