import logo from '@/assets/logo.png'
import { formatDateTime, joinNames } from '@/utils/formatters'
import { Card, Center, Divider, Group, Image, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { SummaryTable } from '../BillSummaryTable'
import { Bill, Receipt, Student } from '@/types/schemas'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

type ReceiptViewProps = {
  student: Student
  bill: Bill
  receipt: Receipt
}

export type ReceiptViewHandle = {
  print: () => void
}

export const ReceiptView =
  forwardRef<ReceiptViewHandle, ReceiptViewProps>(({ student, bill, receipt }, ref) => {
    const printViewRef = useRef<HTMLDivElement>(null)
    const print = useReactToPrint({ 
      contentRef: printViewRef, 
      ignoreGlobalStyles: false,
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useImperativeHandle(ref, () => ({ print }), [])

    return (
      <Card ref={printViewRef} withBorder>
        <Center>
          <Group gap="md">
            <Image src={logo} radius="xl" w={60} />
            <Stack>
              <Title order={3}>IQRA Development Academy, Inc.</Title>
            </Stack>
          </Group>
        </Center>
        <Card.Section>
          <Divider my="md" />
        </Card.Section>
        <SimpleGrid cols={2}>
          <Stack gap="xs">
            <Group gap="xs">
              <Text size="sm" c="dimmed">STUDENT ID:</Text>
              <Text size="sm" fw="bold">{student.id}</Text>
            </Group>
            <Group gap="xs">
              <Text size="sm" c="dimmed">FULL NAME:</Text>
              <Text size="sm" fw="bold">{joinNames(student.lastName, student.firstName, student.midName)}</Text>
            </Group>
            <Group gap="xs">
              <Text size="sm" c="dimmed">PROGRAM:</Text>
              <Text size="sm" fw="bold">{student.course}</Text>
            </Group>
            <Group gap="xs">
              <Text size="sm" c="dimmed">YEAR LEVEL:</Text>
              <Text size="sm" fw="bold">{student.yearLevel}</Text>
            </Group>
          </Stack>
          <Stack gap="xs">
            <Group gap="xs">
              <Text size="sm" c="dimmed">RECEIPT ID:</Text>
              <Text size="sm" fw="bold">{receipt.id}</Text>
            </Group>
            <Group gap="xs">
              <Text size="sm" c="dimmed">DATE ISSUED:</Text>
              <Text size="sm" fw="bold">{formatDateTime(receipt.created!)}</Text>
            </Group>
          </Stack>
        </SimpleGrid>
        <Card.Section>
          <Divider my="md" />
        </Card.Section>
        <SummaryTable
          title="Payment Receipt"
          fees={bill.fees ?? []}
          discountType={student.payingStatus}
          totalAcc={receipt.totalPaid}
          totalPaid={receipt.payment.amount}
          balance={receipt.balance}
        />
      </Card>
    )
  })