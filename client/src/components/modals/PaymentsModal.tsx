import { useFetchPayments } from "@/api/payment"
import { useRenderCount } from "@/hooks/useRenderCount"
import { FormModalHandle } from "@/types/modals"
import { Payment } from "@/types/schemas"
import { formatAmount, formatDateTime } from "@/utils/formatters"
import { ActionIcon, Card, Center, Collapse, Loader, Modal, Stack, Table, Text, Tooltip } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconReceipt } from "@tabler/icons-react"
import { forwardRef, memo, useImperativeHandle, useRef, useState } from "react"
import { AnimatedProgress } from "../AnimatedProgress"
import { TableLoader } from "../tables/TableLoader"
import { ReceiptModal, ReceiptModalHandle } from "./ReceiptModal"

export const PaymentsModal = memo(forwardRef<FormModalHandle<Payment['billId']>>((_, ref) => {
  useRenderCount('PaymentsModal')

  const [billId, setBillId] = useState('')
  const [opened, { open, close }] = useDisclosure(false)
  const {
    payments,
    isLoading,
    isError
  } = useFetchPayments(billId)
  const receiptModalRef = useRef<ReceiptModalHandle>(null)

  const handleOpenReceipt = (paymentId: string) => {
    receiptModalRef.current?.setInitialData!({
      id: paymentId,
      billId
    })
    receiptModalRef.current?.open()
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
      title={'Payment History'}
      size="xl"
    >
      {(isLoading && !payments) ?
        <Center><Loader /></Center> : (
          <Stack>
            <Card>
              <Card.Section>
                <AnimatedProgress in={isLoading} />
                <Table withColumnBorders withRowBorders>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>ACTIONS</Table.Th>
                      <Table.Th>ID</Table.Th>
                      <Table.Th>CREATED</Table.Th>
                      <Table.Th>AMOUNT</Table.Th>
                      <Table.Th>METHOD</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {payments?.length ? payments.map((payment, index) => (
                      <Table.Tr key={index}>
                        <Table.Td>
                          <Tooltip label="View Receipt">
                            <ActionIcon
                              variant="light"
                              color="green"
                              size="lg"
                              aria-label="View Receipt"
                              disabled={isLoading}
                              onClick={() => handleOpenReceipt(payment.id!)}
                            >
                              <IconReceipt />
                            </ActionIcon>
                          </Tooltip>
                        </Table.Td>
                        <Table.Td>{payment.id}</Table.Td>
                        <Table.Td>{formatDateTime(payment.created!)}</Table.Td>
                        <Table.Td>{formatAmount(payment.amount)}</Table.Td>
                        <Table.Td>{payment.method}</Table.Td>
                      </Table.Tr>
                    )) : (
                      <Table.Tr>
                        <Table.Td colSpan={5}>
                          <Collapse in={isLoading}>
                            <TableLoader isError={isError} />
                          </Collapse>
                          <Collapse in={!payments?.length && !isLoading}>
                            <Text ta="center">No payments made yet.</Text>
                          </Collapse>
                        </Table.Td>
                      </Table.Tr>
                    )}
                  </Table.Tbody>
                </Table>
              </Card.Section>
            </Card>
          </Stack>
        )}
      <ReceiptModal ref={receiptModalRef} />
    </Modal>
  )
}))