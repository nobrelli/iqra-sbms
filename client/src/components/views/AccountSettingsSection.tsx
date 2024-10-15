import { useChangePasswod } from "@/api/auth"
import { ChangePasswordFields } from "@/types/schemas"
import { Button, Card, Flex, PasswordInput, Stack, Title } from "@mantine/core"
import { Controller, SubmitHandler, useForm } from "react-hook-form"

export const AccountSettingsSection = () => {
  const {
    control,
    handleSubmit,
    getValues,
    trigger,
    reset
  } = useForm<ChangePasswordFields>({
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      rePassword: ''
    }
  })
  const { mutate: changePassword, isPending, isError } = useChangePasswod()
  const disableFields = isPending && !isError

  const onSubmit: SubmitHandler<Omit<ChangePasswordFields, 'newPassword'>> = data => {
    changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.rePassword
    }, {
      onSuccess: () => reset()
    })
  }

  return (
    <Card withBorder>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Stack>
          <Title order={4}>Change Password</Title>
          <Stack gap="sm">
            <Controller
              name="currentPassword"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'This is required.'
                },
              }}
              disabled={disableFields}
              render={({ field, fieldState }) => (
                <PasswordInput
                  label="Current password"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="newPassword"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'This is required.'
                },
                onChange: () => trigger('rePassword')
              }}
              disabled={disableFields}
              render={({ field, fieldState }) => (
                <PasswordInput
                  label="New password"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="rePassword"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'This is required.'
                },
                validate: value => {
                  if (value !== getValues('newPassword'))
                    return 'Passwords are not the same.'
                }
              }}
              disabled={disableFields}
              render={({ field, fieldState }) => (
                <PasswordInput
                  label="Re-type password"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />
          </Stack>
          <Flex justify="end">
            <Button type="submit" loading={disableFields}>Save</Button>
          </Flex>
        </Stack>
      </form>
    </Card>
  )
}