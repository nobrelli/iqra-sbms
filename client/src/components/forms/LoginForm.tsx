import { useLogin } from '@/api/auth'
import { useRenderCount } from '@/hooks/useRenderCount'
import { useAdminStore } from '@/lib/storeContext'
import { LoginFields } from '@/types/schemas'
import { Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { useRouter } from '@tanstack/react-router'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

export const LoginForm = () => {
  useRenderCount('LoginForm')

  const {
    control,
    handleSubmit,
    formState: { isSubmitSuccessful, isValid },
  } = useForm<LoginFields>({
    mode: 'onChange',
    defaultValues: {
      adminId: '',
      password: '',
    },
  })

  const router = useRouter()
  const setIsAuth = useAdminStore(state => state.setIsAuth)
  const { mutate: loginAdmin, isError, isPending, isSuccess } = useLogin()
  const disableFields = (isSubmitSuccessful || isPending || isSuccess) && !isError

  const onSubmit: SubmitHandler<LoginFields> = formData => {
    loginAdmin(formData, {
      onSuccess: async () => {
        setIsAuth(true)
        await router.invalidate()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Stack>
        <Controller
          name="adminId"
          control={control}
          disabled={disableFields}
          rules={{
            required: {
              value: true,
              message: 'This is required.'
            }
          }}
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
          disabled={disableFields}
          rules={{
            required: {
              value: true,
              message: 'This is required.'
            }
          }}
          render={({ field, fieldState }) => (
            <PasswordInput
              label="Password"
              error={fieldState.error?.message}
              {...field}
            />
          )}
        />
        <Button
          type="submit"
          loading={disableFields}
          disabled={!isValid}
        >
          Log in
        </Button>
      </Stack>
    </form>
  )
}