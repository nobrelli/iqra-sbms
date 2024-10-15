import { useFetchBill } from '@/api/bill'
import { useFetchReceipt } from '@/api/payment'
import { useFetchStudent } from '@/api/student'
import { useRenderCount } from '@/hooks/useRenderCount'
import { FormModalHandle } from '@/types/modals'
import { Payment } from '@/types/schemas'
import { Button, Center, Collapse, Flex, Loader, Modal, Stack } from "@mantine/core"
import { useDisclosure } from '@mantine/hooks'
import { forwardRef, memo, useImperativeHandle, useRef, useState } from 'react'
import { ReceiptView, ReceiptViewHandle } from '../views/ReceiptView'

export type ReceiptModalHandle = FormModalHandle<Pick<Payment, 'id' | 'billId'>>

export const ReceiptModal = memo(forwardRef<ReceiptModalHandle>((_, ref) => {
  useRenderCount('ReceiptModal')

  const [billId, setBillId] = useState('')
  const [paymentId, setPaymentId] = useState('')
  const [opened, { open, close }] = useDisclosure(false)
  const { bill, isLoading: isBillLoading } = useFetchBill(billId)
  const { receipt, isLoading: isReceiptLoading, isError } = useFetchReceipt(paymentId)
  const { student, isLoading: isStudentLoading } = useFetchStudent(bill?.studentId?.toString() ?? '')
  const isAllLoading = isBillLoading || isReceiptLoading || isStudentLoading || !student || !bill || !receipt
  const receiptViewRef = useRef<ReceiptViewHandle>(null)

  useImperativeHandle(ref, () => ({
    open,
    setInitialData(data) {
      setBillId(data.billId)
      setPaymentId(data.id!)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [])

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={'Receipt'}
      size="lg"
    >
      {isAllLoading ?
        <Center><Loader /></Center> : (
          <>
            <Collapse in={!isError}>
              <Stack>
                <ReceiptView
                  ref={receiptViewRef}
                  bill={bill}
                  student={student}
                  receipt={receipt}
                />
                <Flex justify="end" mt="md">
                  <Button
                    type="button"
                    onClick={() => receiptViewRef.current?.print()}
                  >
                    Print
                  </Button>
                </Flex>
              </Stack>
            </Collapse>
          </>
        )}
    </Modal>
  )
})
)