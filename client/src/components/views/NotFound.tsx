import classes from '@/styles/error.module.css'
import { Button } from '@mantine/core'
import { useNavigate } from '@tanstack/react-router'

export const NotFound = () => {
  const navigate = useNavigate()

  return (
    <section className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.inner}>
          <h1 className={classes.title}>404</h1>
          <p className={classes.subtitle}>Not found</p>
          <p className={classes.cause}>The page you're looking for is not defined in this application.</p>
          <Button onClick={() => navigate({ to: '/' })}>Back to Dashboard</Button>
        </div>
      </div>
    </section>
  )
}