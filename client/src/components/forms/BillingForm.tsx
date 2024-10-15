import { SummaryTable } from '@/components/BillSummaryTable'
import { FeesMultiSelect } from '@/components/FeesMultiSelect'
import { useMakeBill } from '@/api/bill'
import { useRenderCount } from '@/hooks/useRenderCount'
import { Bill, Discount, Student, StudentLite } from '@/types/schemas'
import { computeTotalPayableAmount } from '@/utils/compute'
import { lookupPayingStatus } from "@/utils/lookups"
import { Divider, SimpleGrid, Stack, Textarea } from "@mantine/core"
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { LoadingOverlay } from '../LoadingOverlay'
import { BillingReview } from '../views/BillingReview'
import { DatePickerInput } from '@mantine/dates'
import { formatDate } from '@/utils/formatters'

export const BillingForm = ({ selectedStudents, discounts }:
  {
    selectedStudents: Student[],
    discounts: Discount[]
  }) => {
  useRenderCount('BillingForm')

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { isSubmitSuccessful }
  } = useForm<Bill>({
    mode: 'onChange',
    defaultValues: {
      dueDate: '',
      remarks: '',
      fees: []
    }
  })
  const navigate = useNavigate()
  const { mutate: makeBill, isPending, isSuccess, isError } = useMakeBill()
  const studentCount = selectedStudents.length
  const fees = watch('fees')

  // Recompute total amount payables
  const [totalPayables, setTotalPayables] = useState<number[]>(Array(studentCount).fill(0))

  const onSubmit: SubmitHandler<Bill> = data => {
    // Should send Bill[]
    const formattedData: Bill[] = selectedStudents.map((student, index) => {
      const discount = discounts.find(
        discount => discount.description === lookupPayingStatus(student.payingStatus)
      )

      return {
        ...data,
        studentId: student.id,
        totalAmount: totalPayables[index],
        dueDate: formatDate(data.dueDate.toString(), 'YYYY-MM-DD'),
        discounts: discount ? [[discount.description, discount.amount].join(',')] : []
      }
    })

    makeBill({ bills: formattedData }, {
      onSuccess: () => navigate({ to: '/bills' })
    })
  }

  useEffect(() => {
    selectedStudents.forEach((student, index) => {
      const discount = discounts.find(
        discount => discount.description === lookupPayingStatus(student.payingStatus)
      )

      setTotalPayables(state => {
        state[index] = computeTotalPayableAmount(fees, discount)
        return [...state]
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fees])

  return (
    <>
      <LoadingOverlay visible={(isSubmitSuccessful || isPending || isSuccess) && !isError} />
      <form id="bill-form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <SimpleGrid spacing="md" cols={2}>
          <Stack gap="md" mb="md">
            <FeesMultiSelect
              control={control}
              setValue={setValue}
              trigger={trigger}
            />
            <Controller
              name="dueDate"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Don\'t leave this empty.'
                }
              }}
              render={({ field, fieldState }) => (
                <DatePickerInput
                  clearable
                  label="Due date"
                  placeholder="Pick date"
                  minDate={new Date()}
                  highlightToday
                  hideOutsideDates
                  error={fieldState.error?.message}
                  {...field}
                  value={field.value ? new Date(formatDate(field.value)) : undefined}
                />
              )}
            />
            <Controller
              name="remarks"
              control={control}
              rules={{
                maxLength: {
                  value: 300,
                  message: 'Maximum of 300 characters allowed.'
                }
              }}
              render={({ field, fieldState }) => (
                <Textarea
                  label="Remarks"
                  error={fieldState.error?.message}
                  autosize
                  minRows={2}
                  {...field}
                />
              )}
            />
          </Stack>
          <SummaryTable fees={fees} />
        </SimpleGrid>
      </form>
      <Divider my="lg" />
      <BillingReview
        control={control}
        selectedStudents={selectedStudents as StudentLite[]}
      />
    </>
  )
}