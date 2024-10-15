import { useLayoutEffect } from "react"

export const useTitle = (title: string) => {
  useLayoutEffect(() => {
    document.title = title
  }, [title])
}