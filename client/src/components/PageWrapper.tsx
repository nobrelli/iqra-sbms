import { useRenderCount } from '@/hooks/useRenderCount'
import classes from '@/styles/page-wrapper.module.css'
import { Container, Space, Title } from '@mantine/core'
import { memo, ReactNode } from 'react'

interface PageWrapperProps {
  title: string
  children: ReactNode
}

export const PageWrapper = memo(({ title, children }: PageWrapperProps) => {
  useRenderCount(`PageWrapper {${title}}`)

  return (
    <Container p="md" fluid={true}>
      <Title order={3} className={classes.title}>{title}</Title>
      <Space h="lg" />
      {children}
    </Container>
  )
})