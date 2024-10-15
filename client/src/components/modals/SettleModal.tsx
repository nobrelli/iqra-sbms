import { useFetchBill } from "@/api/bill"
import { useGetStudentBalance } from "@/api/mockStudents"
import { useRenderCount } from "@/hooks/useRenderCount"
import { FormModalHandle } from "@/types/modals"
import { Bill, Payment } from "@/types/schemas"
import { formatAmount, formatDate, formatDateTime } from "@/utils/formatters"
import { Card, Center, Group, Loader, Modal, Stack, Text, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconCalendar, IconCalendarTime, IconReceipt } from "@tabler/icons-react"
import { forwardRef, memo, useImperativeHandle, useState } from "react"
import { SettleModalForm } from "../forms/SettleModalForm"

export const BeforeSettleBalanceCard = ({ bill }: { bill: Bill }) => {
  const { balance, isLoading } = useGetStudentBalance(bill.studentId!)

  return (
    <Card withBorder>
      <Stack flex={1} gap="sm">
        <Group gap="lg" align="flex-start" justify="space-between">
          <Stack gap={1}>
            <Text c="dimmed" size="sm">Balance</Text>
            <Title order={4} tt="uppercase">
              {isLoading ? '...' : formatAmount(balance)}
            </Title>
          </Stack>
          <Stack gap="xs" align="end" flex={1}>
            <Text c="dimmed" size="xs">#{bill?.id}</Text>
          </Stack>
        </Group>
        <Stack gap="xs">
          <Group gap="xs">
            <IconReceipt size={18} />
            <Text size="sm">
              Total Paid: <b>{bill && formatAmount(bill.totalPaid)}</b>
            </Text>
          </Group>
          <Group gap="xs">
            <IconCalendarTime size={18} />
            <Text size="sm">
              Last payment: <b>{bill.updated ? formatDateTime(bill.updated) : '-'}</b>
            </Text>
          </Group>
          <Group gap="xs">
            <IconCalendar size={18} />
            <Text size="sm">
              Due date: <b>{bill.dueDate ? formatDate(bill.dueDate) : '-'}</b>
            </Text>
          </Group>
        </Stack>
      </Stack>
    </Card>
  )
}

export const SettleModal = memo(forwardRef<FormModalHandle<Payment['billId']>>((_, ref) => {
  useRenderCount('SettleModal')

  const [billId, setBillId] = useState('')
  const [opened, { open, close }] = useDisclosure(false)
  const { bill, isLoading, refetch: refreshBill } = useFetchBill(billId)

  const onClose = () => {
    refreshBill()
    close()
  }

  useImperativeHandle(ref, () => ({
    open,
    setInitialData(data) {
      setBillId(data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [])

  return (
    <Modal
      opened={opened}
      onClose={close}
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      title={'Settle bill'}
    >
      {(isLoading && !bill) ?
        <Center><Loader /></Center> :
        <Stack>
          <BeforeSettleBalanceCard bill={bill!} />
          <SettleModalForm
            bill={bill!}
            requestModalClose={onClose}
          />
        </Stack>
      }
    </Modal>
  )
}))