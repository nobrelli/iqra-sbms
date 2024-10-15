import { Loader, Stack, ThemeIcon } from "@mantine/core"
import { IconX } from "@tabler/icons-react"

export const TableLoader = ({ isError = false }: { isError?: boolean }) => {
    return (
        <Stack gap="sm" align="center" p="md">
            {!isError ? <Loader /> : (
                <ThemeIcon radius="xl" color="red">
                    <IconX />
                </ThemeIcon>
            )}
            <span>{!isError ? 'Fetching data...' : 'Could not fetch data.'}</span>
        </Stack>
    )
}