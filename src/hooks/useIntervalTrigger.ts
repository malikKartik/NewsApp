import { useEffect, useRef } from "react"

export const useIntervalTrigger = (cb: () => void, timeout: number) => {
    const timerRef = useRef<NodeJS.Timeout>()
    useEffect(() => {
        timerRef.current = setInterval(cb, timeout)
        return () => {
            clearInterval(timerRef.current);
        }
    }, [])

    const resetTimer = () => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(cb, timeout)
    }
    return resetTimer
}