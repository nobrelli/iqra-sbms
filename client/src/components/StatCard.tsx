import classes from '@/styles/pages/dashboard.module.css'
import { Card, Text, Title } from '@mantine/core'

interface StatCardProps {
  isLoading: boolean
  title: string
  value?: number | string
}

export const StatCard = (props: StatCardProps) => {
  const {
    isLoading,
    title,
    value
  } = props

  return (
    <Card shadow="sm" radius="md" withBorder>
      <Title className={classes.cardTitle}>{title}</Title>
      <Text className={classes.cardValue}>
        {isLoading ? '...' : value}
      </Text>
    </Card>
  )
}