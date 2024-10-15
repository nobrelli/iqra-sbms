import { useMakeCashout } from "@/api/cashout"
import { useGetAccountBalance } from "@/api/stats"
import { useRenderCount } from "@/hooks/useRenderCount"
import { FormModalHandle } from "@/types/modals"
import { Outflow } from "@/types/schemas"
import { formatAmount } from "@/utils/formatters"
import { Card, Group, Modal, Stack, Text, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { forwardRef, memo, useImperativeHandle } from "react"
import { CashoutForm } from "../forms/CashoutModalForm"


export const CashoutModal = memo(forwardRef<FormModalHandle<Outflow>>((_, ref) => {
  useRenderCount('CashoutModal')

  const mutationResult = useMakeCashout()
  const [opened, { open, close }] = useDisclosure(false)

  const { balance, isFetching, isPending } = useGetAccountBalance()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useImperativeHandle(ref, () => ({ open }), [])

  return (
    <Modal
      opened={opened}
      onClose={close}
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      title={'Cash out'}
    >
      <Stack>
        <Card withBorder>
          <Stack flex={1} gap="sm">
            <Group gap="lg" align="flex-start" justify="space-between">
              <Stack gap={1}>
                <Text c="dimmed" size="sm">Available Balance</Text>
                <Title order={2} tt="uppercase">
                  {isFetching || isPending ? '...' : formatAmount(balance ?? 0)}
                </Title>
              </Stack>
            </Group>
          </Stack>
        </Card>
        <CashoutForm
          balance={balance}
          mutationResult={mutationResult}
          requestModalClose={close}
        />
      </Stack>
    </Modal>
  )
}))