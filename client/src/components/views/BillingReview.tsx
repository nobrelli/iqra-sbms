import { SummaryTable } from '@/components/BillSummaryTable'
import { useRenderCount } from '@/hooks/useRenderCount'
import { Bill, StudentLite } from '@/types/schemas'
import { joinNames } from '@/utils/formatters'
import { lookupPayingStatus } from "@/utils/lookups"
import { ActionIcon, Badge, Card, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { IconCaretLeft, IconCaretRight, IconCertificate, IconDeviceMobile, IconMail, IconStairs } from "@tabler/icons-react"
import { memo, useState } from 'react'
import { Control, useWatch } from "react-hook-form"

interface BillingReviewProps {
    selectedStudents: StudentLite[] | null
    control: Control<Bill>
  }

export const BillingReview = memo((props: BillingReviewProps) => {
    useRenderCount('BillingReview')
  
    const {
      selectedStudents,
      control
    } = props
  
    const { fees } = useWatch<Bill>({ control })
    const [selectedStudentIndex, setSelectedStudentIndex] = useState(0)
    const studentCount = selectedStudents!.length
    const selectedStudent = selectedStudents![selectedStudentIndex]
  
    return (
      <>
        <Title order={3} mb="md">Billing Review</Title>
        <SimpleGrid spacing="md" cols={2}>
          <Stack gap={0}>
            <Group mb="md" justify="space-between">
              <Text size="sm">Viewing {selectedStudentIndex + 1}/{studentCount}</Text>
              <ActionIcon.Group>
                <ActionIcon
                  variant="light"
                  disabled={selectedStudentIndex === 0}
                  onClick={() => setSelectedStudentIndex(value => --value)}
                >
                  <IconCaretLeft />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  disabled={selectedStudentIndex === studentCount - 1}
                  onClick={() => setSelectedStudentIndex(value => ++value)}
                >
                  <IconCaretRight />
                </ActionIcon>
              </ActionIcon.Group>
            </Group>
            <Card withBorder>
              <Stack flex={1} gap="sm">
                <Group gap="lg" justify="space-between">
                  <Stack gap={1}>
                    <Text c="dimmed" size="sm">{selectedStudent.id}</Text>
                    <Title order={4} tt="uppercase">
                      {joinNames(
                        selectedStudent.lastName,
                        selectedStudent.firstName,
                        selectedStudent.midName
                      )}
                    </Title>
                  </Stack>
                  <Stack gap="xs" align="end" flex={1}>
                    <Badge variant="outline" tt="uppercase">{selectedStudent.type}</Badge>
                    <Badge color="blue" variant="outline" tt="uppercase">
                      {lookupPayingStatus(selectedStudent.payingStatus)}
                    </Badge>
                  </Stack>
                </Group>
                <Stack gap="xs">
                  <Group gap="xs">
                    <IconCertificate size={18} />
                    <Text size="sm">{selectedStudent.course}</Text>
                  </Group>
                  <Group gap="xs">
                    <IconStairs size={18} />
                    <Text size="sm">{selectedStudent.yearLevel}</Text>
                  </Group>
                  <Group gap="xs">
                    <IconDeviceMobile size={18} />
                    <Text size="sm">{selectedStudent.phone ?? '-'}</Text>
                  </Group>
                  <Group gap="xs">
                    <IconMail size={18} />
                    <Text size="sm">{selectedStudent.email ?? '-'}</Text>
                  </Group>
                </Stack>
              </Stack>
            </Card>
          </Stack>
          <SummaryTable
            fees={fees ?? []}
            discountType={selectedStudent.payingStatus}
          />
        </SimpleGrid>
      </>
    )
  })