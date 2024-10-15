import { AccountSettingsSection } from '@/components/views/AccountSettingsSection'
import { PageWrapper } from '@/components/PageWrapper'
import { useTitle } from '@/hooks/useTitle'
import { SimpleGrid } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_user/account')({
    component: Account,
})

function Account() {
    useTitle('Account')

    return (
        <PageWrapper title="Account">
            <SimpleGrid spacing="md" cols={2}>
                <AccountSettingsSection />
            </SimpleGrid>
        </PageWrapper>
    )
}