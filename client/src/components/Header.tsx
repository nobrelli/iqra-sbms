import logo from '@/assets/logo.png'
import { useLogout } from '@/api/auth'
import { useAdminStore } from '@/lib/storeContext'
import { Avatar, Drawer, Flex, Group, Image, MantineColorScheme, Menu, Radio, rem, Stack, Text, Title, useMantineColorScheme } from '@mantine/core'
import { useDidUpdate, useDisclosure } from '@mantine/hooks'
import { IconLogout, IconPaint, IconSettings, IconUser } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { ReactElement } from 'react'

const iconStyles = { width: rem(14), height: rem(14) }

export const Header = ({ burger }: { burger: ReactElement }) => {
  const [opened, { open, close }] = useDisclosure(false)
  const { setColorScheme, colorScheme } = useMantineColorScheme({
    keepTransitions: true
  })
  const navigate = useNavigate()
  const router = useRouter()
  const { setIsLoggingOut, setIsAuth } = useAdminStore()
  const { mutate: logoutAdmin, isPending } = useLogout()
  const queryClient = useQueryClient()

  const logout = () => {
    logoutAdmin(undefined, {
      onSettled: async () => {
        setIsAuth(false)
        await queryClient.cancelQueries()
        queryClient.clear()
        await router.invalidate()
        navigate({ to: '/login' })
      }
    })
  }

  const setScheme = (value: string) => {
    setColorScheme(value as MantineColorScheme)
  }

  useDidUpdate(() => {
    if (isPending)
      setIsLoggingOut(true)
  }, [isPending])

  return (
    <>
      <Flex justify="space-between" align="center" h="100%" px="md">
        <Group>
          {burger}
          <Group gap="sm">
            <Image src={logo} radius="xl" h={50} />
            <Stack gap={0} visibleFrom="sm">
              <Title order={3}>IQRA</Title>
              <Text size="xs">Student Billing System</Text>
            </Stack>
          </Group>
        </Group>
        <Menu>
          <Menu.Target>
            <Avatar radius="xl" style={{ cursor: 'pointer' }}>
              <IconUser />
            </Avatar>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconPaint style={iconStyles} />} onClick={open}>Color scheme</Menu.Item>
            <Menu.Label>Account</Menu.Label>
            <Menu.Item
              component={Link}
              to="/account"
              leftSection={<IconSettings style={iconStyles} />}
            >
              Settings
            </Menu.Item>
            <Menu.Item
              leftSection={<IconLogout style={iconStyles} />}
              onClick={logout}
            >
              Log out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
      <Drawer
        position="right"
        opened={opened}
        onClose={close}
        title="Set color scheme"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <Radio.Group value={colorScheme} onChange={setScheme}>
          <Stack gap="sm">
            <Radio label="Light" value="light" />
            <Radio label="Dark" value="dark" />
            <Radio label="Use system" value="auto" />
          </Stack>
        </Radio.Group>
      </Drawer>
    </>
  )
}