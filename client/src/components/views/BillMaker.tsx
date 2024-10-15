import { useFetchDiscounts } from '@/api/discount'
import { useFetchStudentsByIds } from '@/api/student'
import { useRenderCount } from '@/hooks/useRenderCount'
import { useAdminStore } from '@/lib/storeContext'
import { Box, Button, Flex } from "@mantine/core"
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { LoadingOverlay } from '../LoadingOverlay'
import { BillingForm } from '../forms/BillingForm'

export const BillMaker = () => {
  useRenderCount('BillMaker')

  const selectedStudentIds = useAdminStore(state => state.selectedStudentIds)
  const navigate = useNavigate()
  const {
    students: selectedStudents,
    isLoading: isStudentsLoading
  } = useFetchStudentsByIds(selectedStudentIds ?? new Set())
  // Students data should have been loaded in the /students route
  const {
    discounts,
    isLoading: isDiscountsLoading,
    isError
  } = useFetchDiscounts()
  const isAllLoading = isStudentsLoading || isDiscountsLoading || isError

  useEffect(() => {
    if (!selectedStudentIds)
      navigate({ to: '/students' })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudentIds])
  
  return (
    <Box pos="relative">
      <LoadingOverlay visible={isAllLoading} />
      {!isAllLoading &&
        <BillingForm
          selectedStudents={selectedStudents}
          discounts={discounts!}
        />
      }
      <Flex justify="end" gap="md" mt="md">
        <Button
          type="button"
          size="lg"
          form="bill-form"
          variant="default"
          onClick={() => navigate({ to: '/students' })}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="lg"
          form="bill-form"
        >
          Confirm
        </Button>
      </Flex>
    </Box>
  )
}