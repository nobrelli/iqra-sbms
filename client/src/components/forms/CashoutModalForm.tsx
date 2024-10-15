import { Outflow } from "@/types/schemas"
import { FetchResponse, RequestError } from "@/types/utils"
import { Button, Flex, NumberInput, Stack, TextInput } from "@mantine/core"
import { IconCurrencyPeso } from "@tabler/icons-react"
import { UseMutationResult } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"

const defaultValues: Outflow = {
  amount: 0,
  description: ''
}

interface CashoutModalFormProps {
  balance: number
  mutationResult: UseMutationResult<FetchResponse<unknown>, RequestError, Outflow>
  requestModalClose: () => void
}

export const CashoutForm = (props: CashoutModalFormProps) => {
  const { balance, mutationResult, requestModalClose } = props
  const { mutate, isPending } = mutationResult
  const [disabled, setDisabled] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { isValid }
  } = useForm<Outflow>({
    mode: 'onChange',
    defaultValues
  })

  const onSubmit: SubmitHandler<Outflow> = data => {
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
            max: {
              value: balance!,
              message: 'The amount exceeds the available balance.'
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
            Cash out
          </Button>
        </Flex>
      </Stack>
    </form>
  )
}