import useCheckActiveNav from '@/hooks/useCheckNativeNav'
import { links } from '@/lib/sidebarLinks'
import classes from '@/styles/sidebar.module.css'
import { NavLink, ScrollArea, Stack, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'

export const Sidebar = () => {
  const { checkActiveNav } = useCheckActiveNav()

  return (
    <>
      <ScrollArea flex={1} my="md" px="md">
        <Stack gap="sm">
          {links.map(({ href, icon, label }, index) => (
            <NavLink
              key={index}
              component={Link}
              to={href}
              label={label}
              leftSection={icon}
              active={checkActiveNav(href)}
              activeProps={{
                className: classes.navlinkActive
              }}
              py="lg"
              autoContrast
              className={classes.navlink}
            />
          ))}
        </Stack>
      </ScrollArea>
      <div className={classes.footer}>
        <Text size="sm">v {import.meta.env.VITE_APP_VERSION}</Text>
      </div>
    </>
  )
}