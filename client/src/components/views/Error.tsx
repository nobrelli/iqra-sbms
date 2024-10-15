import classes from '@/styles/error.module.css'
import { Button } from '@mantine/core'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorComponentProps, useNavigate, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

export const ErrorComponent = ({ error }: ErrorComponentProps) => {
  const navigate = useNavigate()
  const router = useRouter()
  const queryErrorResetBoundary = useQueryErrorResetBoundary()

  useEffect(() => {
    // Reset the query error boundary
    queryErrorResetBoundary.reset()
  }, [queryErrorResetBoundary])

  return (
    <section className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.inner}>
          <h1 className={classes.title}>Ooops!</h1>
          <p className={classes.subtitle}>Something went wrong here.</p>
          <p className={classes.cause}><span className="font-bold">{error.name}:</span> {error.message}</p>
          <div className={classes.buttons}>
            <Button onClick={() => router.invalidate()}>Retry</Button>
            <Button onClick={() => navigate({ to: '/' })}>Back to Dashboard</Button>
          </div>
        </div>
      </div>
    </section>
  )
}