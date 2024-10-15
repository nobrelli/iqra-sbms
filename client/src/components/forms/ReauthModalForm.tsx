import { useLogin } from "@/api/auth"
import { LoginFields } from "@/types/schemas"
import { Alert, Button, Flex, PasswordInput, Stack, TextInput } from "@mantine/core"
import { IconAlertCircle } from "@tabler/icons-react"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"

const defaultValues: LoginFields = {
  adminId: '',
  password: ''
}

interface ReauthFormProps {
  requestModalClose: () => void
}

export const ReauthForm = ({ requestModalClose }: ReauthFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { isValid }
  } = useForm<LoginFields>({
    mode: 'onChange',
    defaultValues
  })

  const queryClient = useQueryClient()
  const { mutate, isPending } = useLogin()
  const [disabled, setDisabled] = useState(false)

  const onSubmit: SubmitHandler<LoginFields> = data => {
    mutate(data, {
      onSuccess: () => {
        queryClient.refetchQueries()
        requestModalClose()
      },
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
        <Alert variant="light" color="red" icon={<IconAlertCircle />}>
          Your session has expired. Please enter your credentials to continue.
        </Alert>
        <Controller
          name="adminId"
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
              label="Admin ID"
              error={fieldState.error?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{
            required: {
              value: true,
              message: 'This is required.'
            }
          }}
          disabled={disabled}
          render={({ field, fieldState }) => (
            <PasswordInput
              label="Password"
              error={fieldState.error?.message}
              {...field}
            />
          )}
        />
        <Flex justify="end" gap="md">
          <Button
            type="submit"
            loading={disabled}
            disabled={!isValid}
          >
            Continue
          </Button>
        </Flex>
      </Stack>
    </form>
  )
}