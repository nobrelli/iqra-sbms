import { useMakePayment } from "@/api/payment"
import { Bill, Payment } from "@/types/schemas"
import { computeBalance } from "@/utils/compute"
import { formatAmount } from "@/utils/formatters"
import { Button, Flex, NumberInput, Select, Stack, Textarea } from "@mantine/core"
import { IconCurrencyPeso } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"

const defaultValues: Payment = {
  billId: '',
  created: undefined,
  amount: 0,
  method: 'Cash',
  remarks: '',
}

interface FeeModalFormProps {
  bill: Bill
  requestModalClose: () => void
}

export const SettleModalForm = (props: FeeModalFormProps) => {
  const { bill, requestModalClose } = props
  const { mutate, isPending } = useMakePayment()
  const [disabled, setDisabled] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { isValid }
  } = useForm<Payment>({
    mode: 'onChange',
    defaultValues: {
      ...defaultValues,
      billId: bill.id
    }
  })

  const onSubmit: SubmitHandler<Payment> = data => {
    mutate(data, {
      onSuccess: () => requestModalClose(),
      onSettled: () => setDisabled(false)
    })
  }

  const balance = bill ? computeBalance(bill.totalAmount, bill.totalPaid) : 0

  useEffect(() => {
    if (isPending)
      setDisabled(true)
  }, [isPending])

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <input type="hidden" {...register('billId')} />
      <Stack gap="md">
        <Controller
          name="amount"
          control={control}
          rules={{
            required: {
              value: true,
              message: 'This is required.'
            },
            min: {
              value: 1,
              message: 'Please enter at least Php 1.00.'
            },
            max: {
              value: balance,
              message: `${formatAmount(balance)} is the max amount.`
            }
          }}
          disabled={disabled}
          render={({ field, fieldState }) => (
            <NumberInput
              label="Amount"
              leftSection={<IconCurrencyPeso />}
              decimalScale={2}
              fixedDecimalScale
              thousandSeparator
              hideControls
              error={fieldState.error?.message}
              min={0}
              clampBehavior="strict"
              onValueChange={values => {
                setValue('amount', values.floatValue!)
                trigger('amount')
              }}
              {...field}
            />
          )}
        />
        <Controller
          name="method"
          control={control}
          rules={{
            required: {
              value: true,
              message: 'This is required.'
            },
          }}
          disabled={disabled}
          render={({ field, fieldState }) => (
            <Select
              label="Payment method"
              placeholder="Pick value"
              data={['Cash', 'Gcash', 'Bank Transfer']}
              allowDeselect={false}
              error={fieldState.error?.message}
              {...field}
            />
          )}
        />
        {/* <Controller
        name="created"
        control={control}
        disabled={isSubmitting || isSubmitSuccessful}
        render={({ field, fieldState }) => (
          <DatePickerInput
            clearable
            label="Payment date"
            description="Select the payment date if the bill has been paid on a different date; if not, leave it blank."
            placeholder="Pick date"
            maxDate={new Date()}
            highlightToday
            hideOutsideDates
            error={fieldState.error?.message}
            {...field}
            value={field.value as Date}
          />
        )}
      /> */}
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
        <Flex justify="end" gap="md">
          <Button
            type="button"
            variant="default"
            onClick={requestModalClose}
            disabled={disabled}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isValid}
            loading={disabled}
          >
            Settle
          </Button>
        </Flex>
      </Stack>
    </form>
  )
}