import { useFetchFees } from "@/api/fee"
import { Bill } from "@/types/schemas"
import { ActionIcon, MultiSelect, Tooltip } from "@mantine/core"
import { IconChecks } from "@tabler/icons-react"
import { Control, Controller, UseFormSetValue, UseFormTrigger } from "react-hook-form"

interface FeesMultiSelectProps {
  control: Control<Bill>
  setValue: UseFormSetValue<Bill>
  trigger: UseFormTrigger<Bill>
}

export const FeesMultiSelect = ({ control, setValue, trigger }: FeesMultiSelectProps) => {
  // Get fees
  const { fees, isLoading, isError } = useFetchFees()

  const handlePickAll = () => {
    if (fees) {
      setValue('fees', fees?.map(fee =>
        [fee.description, fee.amount].toString())
      )
      trigger('fees')
    }
  }

  return (
    <Controller
      name="fees"
      control={control}
      rules={{
        required: true
      }}
      render={({ field, fieldState }) => (
        <MultiSelect
          {...field}
          label="Fees"
          description="Pick at least one fee to add to the bill."
          placeholder={isLoading ? "Loading fees..." : "Pick value"}
          error={fieldState.error?.message}
          searchable
          clearable
          withAsterisk
          nothingFoundMessage={isError
            ? "An error occurred while loading fees."
            : isLoading
              ? "Loading fees..."
              : "No fees found."
          }
          data={fees?.map(fee => ({
            value: [fee.description, fee.amount].toString(),
            label: fee.description
          }))}
          value={field.value as string[]}
          leftSection={(!isError && !isLoading) &&
            <Tooltip label="Pick all">
              <ActionIcon
                variant="subtle"
                radius="xl"
                onClick={handlePickAll}
              >
                <IconChecks />
              </ActionIcon>
            </Tooltip>
          }
        />
      )}
    />
  )
}