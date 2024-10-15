import { Discount } from "@/types/schemas"
import { FetchResponse, RequestError } from "@/types/utils"
import { formatDate } from "@/utils/formatters"
import { Button, Flex, NumberInput, SegmentedControl, Stack, Text, TextInput } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { IconCurrencyPeso, IconPercentage } from "@tabler/icons-react"
import { UseMutationResult } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"

const FORMAT = 'YYYY-MM-DD'

const defaultValues: Omit<Discount, 'created'> = {
  id: '',
  amount: 0,
  description: '',
  isPercent: false,
  validFrom: '',
  validUntil: ''
}

interface DiscountModalFormProps {
  initialValues?: Discount
  mutationResult: UseMutationResult<FetchResponse<unknown>, RequestError, Discount>
  requestModalClose: () => void
}

export const DiscountModalForm = (props: DiscountModalFormProps) => {
  const { initialValues, mutationResult, requestModalClose } = props
  const { mutate, isPending } = mutationResult
  const [disabled, setDisabled] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { isValid }
  } = useForm<Discount>({
    mode: 'onChange',
    defaultValues: initialValues ?? defaultValues
  })
  const isPercent = watch('isPercent')

  const handleSetPercent = (value: string) => {
    setValue('isPercent', value === 'per' ? true : false)
    setValue('amount', 0)
  }

  const onSubmit: SubmitHandler<Discount> = data => {
    const formatted: Discount = {
      ...data,
      validFrom: data.validFrom ? formatDate(data.validFrom.toString(), FORMAT) : undefined,
      validUntil: data.validUntil ? formatDate(data.validUntil.toString(), FORMAT) : undefined,
    }

    mutate(formatted, {
      onSuccess: () => requestModalClose(),
      onSettled: () => setDisabled(false)
    })
  }

  useEffect(() => {
    if (isPending)
      setDisabled(true)
  }, [isPending])

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      {initialValues && <input type="hidden" {...register('id')} />}
      <Stack gap="md">
        <Controller
          name="description"
          control={control}
          rules={{
            required: {
              value: true,
              message: 'This is required.'
            }
          }}
          disabled={disabled}
          render={({ field, fieldState }) => (
            <TextInput
              label="Description"
              error={fieldState.error?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="isPercent"
          control={control}
          disabled={disabled}
          render={({ field }) => (
            <div>
              <Text size="sm" fw={500} mb={3}>Amount input mode</Text>
              <SegmentedControl
                fullWidth
                ref={field.ref}
                name={field.name}
                value={field.value ? 'per' : 'abs'}
                onChange={handleSetPercent}
                disabled={field.disabled}
                data={[
                  {
                    value: 'abs',
                    label: 'Absolute'
                  },
                  {
                    value: 'per',
                    label: 'Percentage'
                  }
                ]}
              />
            </div>
          )}
        />
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
              message: 'Please enter > 0'
            },
          }}
          disabled={disabled}
          render={({ field, fieldState }) => (
            <NumberInput
              label="Amount"
              leftSection={!isPercent && <IconCurrencyPeso />}
              rightSection={isPercent && <IconPercentage />}
              decimalScale={isPercent ? 0 : 2}
              fixedDecimalScale
              thousandSeparator
              hideControls
              error={fieldState.error?.message}
              min={0}
              max={isPercent ? 100 : undefined}
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
          name="validFrom"
          control={control}
          disabled={disabled}
          rules={{
            required: {
              value: true,
              message: 'Don\'t leave this empty.'
            }
          }}
          render={({ field, fieldState }) => (
            <DatePickerInput
              clearable
              label="Valid from"
              description="This discount becomes valid on this date. You can leave the date as it is."
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
          name="validUntil"
          control={control}
          disabled={disabled}
          render={({ field, fieldState }) => (
            <DatePickerInput
              clearable
              label="Valid until"
              description="This discount expires on this date. Leave blank for no expiration."
              placeholder="Pick date"
              minDate={new Date()}
              hideOutsideDates
              error={fieldState.error?.message}
              {...field}
              value={field.value ? new Date(formatDate(field.value)) : undefined}
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
            loading={disabled}
            disabled={!isValid}
          >
            {initialValues ? 'Save' : 'Make'}
          </Button>
        </Flex>
      </Stack>
    </form>
  )
}