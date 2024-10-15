import { useRenderCount } from "@/hooks/useRenderCount"
import { Button, Flex, MantineColor, Modal, ModalProps } from "@mantine/core"
import { ReactElement } from "react"

interface ConfirmModalProps extends Omit<ModalProps, 'onClose'> {
  isLoading: boolean
  message: ReactElement | string
  severity: 'info' | 'warning' | 'error'
  onDecline?: () => void
  onConfirm?: () => void
  closeFn?: () => void
  manualCloseAfterCallback?: boolean
}

export const ConfirmModal = (props: ConfirmModalProps) => {
  useRenderCount('ConfirmModal')

  const { 
    message, 
    isLoading, 
    onDecline, 
    onConfirm, 
    severity, 
    closeFn, 
    manualCloseAfterCallback = false,
    ...rest
  } = props

  const buttonColors: Record<typeof severity, MantineColor> = {
    info: 'blue',
    warning: 'orange',
    error: 'red'
  }

  const handleDefaultConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }

    if (!manualCloseAfterCallback && closeFn)
      closeFn()
  }

  const handleDefaultDecline = () => {
    if (onDecline) { 
      onDecline()
    }

    if (!manualCloseAfterCallback && closeFn)
      closeFn()
  }

  return (
    <Modal
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      onClose={handleDefaultDecline}
      {...rest}
    >
      {message}
      <Flex justify="end" gap="md">
        <Button
          type="button"
          variant="default"
          onClick={handleDefaultDecline}
          disabled={isLoading}
        >
          No
        </Button>
        <Button
          type="button"
          color={buttonColors[severity]}
          onClick={handleDefaultConfirm}
          loading={isLoading}
        >
          Yes
        </Button>
      </Flex>
    </Modal>
  )
}