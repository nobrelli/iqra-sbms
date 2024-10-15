import { useDeleteFee, useEditFee, useMakeFee } from "@/api/fee"
import { useRenderCount } from "@/hooks/useRenderCount"
import { DeleteConfirmModalHandle, FormModalHandle } from "@/types/modals"
import { Fee } from "@/types/schemas"
import { Modal, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { forwardRef, memo, useEffect, useImperativeHandle, useState } from "react"
import { FeeModalForm } from "../forms/FeeModalForm"
import { ConfirmModal } from "./ConfirmModal"

export const CreateFeeModal = memo(forwardRef<FormModalHandle<Fee>>((_, ref) => {
	useRenderCount('CreateFeeModal')

	const mutationResult = useMakeFee()
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
			<FeeModalForm
				mutationResult={mutationResult}
				requestModalClose={close}
			/>
		</Modal>
	)
}))

export const EditFeeModal = memo(forwardRef<FormModalHandle<Fee>>((_, ref) => {
	useRenderCount('EditFeeModal')

	const mutationResult = useEditFee()
	const [opened, { open, close }] = useDisclosure(false)
	const [initialData, setInitialData] = useState<Fee>()

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
			<FeeModalForm
				initialValues={initialData!}
				mutationResult={mutationResult}
				requestModalClose={close}
			/>
		</Modal>
	)
}))

interface FeeDeleteConfirmProps {
	rowId: string,
	feeName: string
}

export type DeleteFeeConfirmModalHandle = DeleteConfirmModalHandle<FeeDeleteConfirmProps>

export const DeleteFeeConfirmModal =
	memo(forwardRef<DeleteFeeConfirmModalHandle>((_, ref) => {
		useRenderCount('DeleteFeeConfirmModal')
		
		const { mutate: deleteFee, isPending } = useDeleteFee()
		const [isLoading, setIsLoading] = useState(false)
		const [deleteProps, setDeleteProps] = useState<FeeDeleteConfirmProps>()
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
			deleteFee(deleteProps!.rowId, {
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
					<span style={{ fontWeight: 'bold' }}>{deleteProps?.feeName}</span>?{' '}
					This action cannot be undone.</Text>}
				title="Delete Fee"
				severity="error"
				onConfirm={onDelete}
				onDecline={close}
				manualCloseAfterCallback={true}
			/>
		)
	}))