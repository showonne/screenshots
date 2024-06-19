import { useEffect, useState } from "react";
import useStore from "./useStore";


export function useColor() {
    const { globalEvents, operation } = useStore()
    const [color, setColor] = useState('#F84135')

    const handleUpdateColor = (color: string) => {
        setColor(color)
    }

    useEffect(() => {
        globalEvents.on('update:color', handleUpdateColor)

        return () => globalEvents.off('update:color', handleUpdateColor)
    }, [])

    return { color, setColor }
}