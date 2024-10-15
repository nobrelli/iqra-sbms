import { lookupDiscountInfo, lookupPayingStatus } from "@/utils/lookups"
import { useFetchDiscounts } from "@/api/discount"
import { Discount } from "@/types/schemas"
import { formatAmount } from "@/utils/formatters"
import { Card, Group, Stack, Table, Text } from "@mantine/core"
import { IconMinus, IconPlus } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { computeTotalPayableAmount } from "@/utils/compute"

interface SummaryTableProps {
  title?: string
  fees: string[]
  discountType?: string
  totalPaid?: number
  totalAcc?: number
  balance?: number
}

export const SummaryTable = (props: SummaryTableProps) => {
  const { title = 'Summary', fees, discountType, totalPaid, totalAcc, balance } = props
  const { discounts } = useFetchDiscounts()
  const [discount, setDiscount] = useState<Discount>()
  const [totalPayableAmount, setTotalPayableAmount] = useState(0)

  useEffect(() => {
    if (discounts && discountType) {
      setDiscount(lookupDiscountInfo(
        lookupPayingStatus(discountType), discounts
      )!)
    } else {
      setTotalPayableAmount(computeTotalPayableAmount(fees))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountType, fees])

  useEffect(() => {
    setTotalPayableAmount(computeTotalPayableAmount(fees, discount))
  }, [discount, fees])

  return (
    <Stack gap="xs">
      <Text mb="xs">{title}</Text>
      <Card withBorder>
        <Card.Section>
          <Table withColumnBorders withRowBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>PARTICULARS</Table.Th>
                <Table.Th>AMOUNT</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {fees?.length ? (fees as string[]).map((fee, index) => {
                const data = fee.split(',')
                return (
                  <Table.Tr key={index}>
                    <Table.Td>
                      <Group gap="xs">
                        <IconPlus size={14} />
                        <Text size="sm">{data[0]}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>{formatAmount(data[1])}</Table.Td>
                  </Table.Tr>
                )
              }) : (
                <Table.Tr>
                  <Table.Td colSpan={2}>
                    <Text ta="center" c="dimmed">No fees selected.</Text>
                  </Table.Td>
                </Table.Tr>
              )}
              {discount && (
                <Table.Tr c="green">
                  <Table.Td>
                    <Group gap="xs">
                      <IconMinus size={14} />
                      <Stack gap={1}>
                        <Text size="xs" c="dimmed">Miscellaneous fee discount</Text>
                        <Text size="sm">{discount.description}</Text>
                      </Stack>
                    </Group>
                  </Table.Td>
                  <Table.Td>{formatAmount(discount.amount, discount.isPercent)}</Table.Td>
                </Table.Tr>
              )}
              <Table.Tr>
                <Table.Th>{discount ? 'TOTAL AMOUNT PAYABLE' : 'TOTAL'}</Table.Th>
                <Table.Th>{formatAmount(totalPayableAmount)}</Table.Th>
              </Table.Tr>
              {(totalAcc !== undefined) && (
                <Table.Tr>
                  <Table.Th>TOTAL PAYMENTS</Table.Th>
                  <Table.Th>{formatAmount(totalAcc)}</Table.Th>
                </Table.Tr>
              )}
              {(totalPaid !== undefined) && (
                <Table.Tr>
                  <Table.Th>AMOUNT TENDERED</Table.Th>
                  <Table.Th>{formatAmount(totalPaid)}</Table.Th>
                </Table.Tr>
              )}
              {(balance !== undefined) && (
                <Table.Tr>
                  <Table.Th>BALANCE</Table.Th>
                  <Table.Th>{formatAmount(balance)}</Table.Th>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Card.Section>
      </Card>
    </Stack>
  )
}