import { useEffect, useRef } from "react"

export const useRenderCount = (componentName: string) => {
    const renderCountRef = useRef(0)

    useEffect(() => {
        renderCountRef.current++

        if (import.meta.env.DEV)
            console.log(componentName, renderCountRef.current)
    })
}