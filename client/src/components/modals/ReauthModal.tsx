import { useRenderCount } from "@/hooks/useRenderCount"
import { FormModalHandle } from "@/types/modals"
import { LoginFields } from "@/types/schemas"
import { Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { forwardRef, memo, useImperativeHandle } from "react"
import { ReauthForm } from "../forms/ReauthModalForm"

export const ReauthModal = memo(forwardRef<FormModalHandle<LoginFields>>((_, ref) => {
  useRenderCount('ReauthModal')

	const [opened, { open, close }] = useDisclosure(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
	useImperativeHandle(ref, () => ({ open }), [])

  return (
		<Modal
			opened={opened}
			onClose={close}
			withCloseButton={false}
			closeOnClickOutside={false}
			closeOnEscape={false}
			title='Reauthenticate'
		>
			<ReauthForm requestModalClose={close} />
		</Modal>
  )
}))