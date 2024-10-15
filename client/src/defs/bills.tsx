import { FormModalHandle } from '@/types/modals'
import { Bill, Payment } from '@/types/schemas'
import { formatAmount, formatDateTime, getDueStatus } from '@/utils/formatters'
import { ActionIcon, Anchor, Badge, BadgeProps, Group, Tooltip } from '@mantine/core'
import { IconCashRegister, IconList } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { RefObject } from 'react'

const columnHelper = createColumnHelper<Bill>()
const paymentStatusBadgeColor: Record<string, BadgeProps['color']> = {
  unpaid: 'gray',
  partial: 'orange',
  complete: 'green'
}
const dueStatusBadgeColor: Record<string, BadgeProps['color']> = {
  pending: 'blue',
  near: 'yellow',
  today: 'orange',
  overdue: 'red'
}

export const billColumnDefinition = (
  settleModalRef: RefObject<FormModalHandle<Payment['billId']>>,
  viewModalRef: RefObject<FormModalHandle<Payment['billId']>>
) => {
  const handleSettleClick = (rowId: string) => {
    settleModalRef.current?.open()
    settleModalRef.current?.setInitialData!(rowId)
  }

  const handleViewClick = (rowId: string) => {
    viewModalRef.current?.open()
    viewModalRef.current?.setInitialData!(rowId)
  }

  return [
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Group gap="sm">
          <Tooltip label="Settle">
            <ActionIcon
              variant="light"
              color="green"
              size="lg"
              aria-label="Settle Bill"
              disabled={row.original.status === 'complete'}
              onClick={() => handleSettleClick(row.id)}
            >
              <IconCashRegister />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="View Payments">
            <ActionIcon
              variant="light"
              color="green"
              size="lg"
              aria-label="View Payments"
              disabled={row.original.status === 'unpaid'}
              onClick={() => handleViewClick(row.id)}
            >
              <IconList />
            </ActionIcon>
          </Tooltip>
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
      size: 200
    }),
    columnHelper.accessor('studentId', {
      header: 'Student ID',
      cell: cell =>
        <Anchor
          component={Link}
          to={`/students/${cell.getValue()}`}
          fw="bold"
          size="sm"
        >
          {cell.getValue()}
        </Anchor>
    }),
    columnHelper.accessor('totalAmount', {
      header: 'Total Amount',
      cell: cell => formatAmount(cell.getValue()),
    }),
    columnHelper.accessor('totalPaid', {
      header: 'Total Paid',
      cell: cell => formatAmount(cell.getValue()),
    }),
    columnHelper.accessor('status', {
      header: 'Payment Status',
      cell: cell => (
        <Badge
          color={paymentStatusBadgeColor[cell.getValue()]}
          autoContrast
        >
          {cell.getValue().toUpperCase()}
        </Badge>
      )
    }),
    columnHelper.accessor('dueDate', {
      header: 'Due Status',
      cell: cell => {
        const status = getDueStatus(cell.getValue())

        return (
          <Badge
            color={dueStatusBadgeColor[status]}
            autoContrast
          >
            {status.toUpperCase()}
          </Badge>
        )
      }
    }),
  ]
}