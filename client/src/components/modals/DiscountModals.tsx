import { useDeleteDiscount, useEditDiscount, useMakeDiscount } from "@/api/discount"
import { useRenderCount } from "@/hooks/useRenderCount"
import { DeleteConfirmModalHandle, FormModalHandle } from "@/types/modals"
import { Discount } from "@/types/schemas"
import { Modal, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { forwardRef, memo, useEffect, useImperativeHandle, useState } from "react"
import { DiscountModalForm } from "../forms/DiscountModalForm"
import { ConfirmModal } from "./ConfirmModal"

export const CreateDiscountModal = memo(forwardRef<FormModalHandle<Discount>>((_, ref) => {
  useRenderCount('CreateDiscountModal')

  const mutationResult = useMakeDiscount()
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
      title={'Add Fee'}
    >
      <DiscountModalForm
        mutationResult={mutationResult}
        requestModalClose={close}
      />
    </Modal>
  )
}))

export const EditDiscountModal = memo(forwardRef<FormModalHandle<Discount>>((_, ref) => {
	useRenderCount('EditDiscountModal')

	const mutationResult = useEditDiscount()
	const [opened, { open, close }] = useDisclosure(false)
	const [initialData, setInitialData] = useState<Discount>()

	useImperativeHandle(ref, () => ({
		open,
		setInitialData
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}), [])

	return (
		<Modal
			opened={opened}
			onClose={close}
			withCloseButton={false}
			closeOnClickOutside={false}
			closeOnEscape={false}
			title={'Edit Fee'}
		>
			<DiscountModalForm
				initialValues={initialData!}
				mutationResult={mutationResult}
				requestModalClose={close}
			/>
		</Modal>
	)
}))

interface DiscountDeleteConfirmProps {
	rowId: string,
	discountName: string
}

export type DeleteDiscountConfirmModalHandle = DeleteConfirmModalHandle<DiscountDeleteConfirmProps>

export const DeleteDiscountConfirmModal =
	memo(forwardRef<DeleteDiscountConfirmModalHandle>((_, ref) => {
		useRenderCount('DeleteDiscountConfirmModal')
		
		const { mutate: deleteDiscount, isPending } = useDeleteDiscount()
		const [isLoading, setIsLoading] = useState(false)
		const [deleteProps, setDeleteProps] = useState<DiscountDeleteConfirmProps>()
		const [opened, { open, close }] = useDisclosure(false)

		useImperativeHandle(ref, () => ({
			open,
			setLoading() {
				setIsLoading(true)
			},
			setDeleteProps
		// eslint-disable-next-line react-hooks/exhaustive-deps
		}), [])

		const onDelete = () => {
			deleteDiscount(deleteProps!.rowId, {
				onSuccess: () => close(),
				onSettled: () => setIsLoading(false)
			})
		}

		useEffect(() => {
			if (isPending)
				setIsLoading(true)
		}, [isPending])

		return (
			<ConfirmModal
				opened={opened}
				isLoading={isLoading}
				message={<Text>Are you sure you want to delete{' '}
					<span style={{ fontWeight: 'bold' }}>{deleteProps?.discountName}</span>?{' '}
					This action cannot be undone.</Text>}
				title="Delete Fee"
				severity="error"
				onConfirm={onDelete}
				onDecline={close}
				manualCloseAfterCallback={true}
			/>
		)
	}))