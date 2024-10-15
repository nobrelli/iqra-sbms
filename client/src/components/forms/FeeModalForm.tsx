import { Fee } from "@/types/schemas"
import { FetchResponse, RequestError } from "@/types/utils"
import { Button, Flex, NumberInput, Stack, TextInput } from "@mantine/core"
import { IconCurrencyPeso } from "@tabler/icons-react"
import { UseMutationResult } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"

const defaultValues: Omit<Fee, 'created'> = {
  id: '',
  amount: 0,
  description: ''
}

interface FeeModalFormProps {
  initialValues?: Fee
  mutationResult: UseMutationResult<FetchResponse<unknown>, RequestError, Fee>
  requestModalClose: () => void
}

export const FeeModalForm = (props: FeeModalFormProps) => {
  const { initialValues, mutationResult, requestModalClose } = props
  const { mutate, isPending } = mutationResult
  const [disabled, setDisabled] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { isValid }
  } = useForm<Fee>({
    mode: 'onChange',
    defaultValues: initialValues ?? defaultValues
  })

  const onSubmit: SubmitHandler<Fee> = data => {
    mutate(data, {
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
      <input type="hidden" {...register('id')} />
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
            {initialValues ? 'Save' : 'Add'}
          </Button>
        </Flex>
      </Stack>
    </form>
  )
}