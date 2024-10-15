import { routeTree } from '@/routeTree.gen'
import { IconCurrencyPeso, IconFileInvoice, IconHome, IconReceipt2, IconReceiptTax, IconUser } from '@tabler/icons-react'
import { ParseRoute } from '@tanstack/react-router'
import { ReactElement } from 'react'

interface SidebarItem {
  label: string
  icon: ReactElement
  href: ParseRoute<typeof routeTree>['fullPath']
}

export const links: SidebarItem[] = [
  {
    label: 'Dashboard',
    icon: <IconHome />,
    href: '/'
  },
  {
    label: 'Students',
    icon: <IconUser />,
    href: '/students'
  },
  {
    label: 'Fees',
    icon: <IconReceipt2 />,
    href: '/fees'
  },
  {
    label: 'Discounts',
    icon: <IconReceiptTax />,
    href: '/discounts'
  },
  {
    label: 'Billings',
    icon: <IconFileInvoice />,
    href: '/bills'
  },
  {
    label: 'Cash out',
    icon: <IconCurrencyPeso />,
    href: '/cashout'
  },
]