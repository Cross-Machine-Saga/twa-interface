import { useEffect } from 'react'
import { TelegramProvider } from './telegram-provider'
import { NODE_ENV } from '@/lib/constants'


export const Provider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        if (NODE_ENV !== 'production') {
            import('vconsole').then((m) => new m.default())
        }
    }, [])

    return (
        <TelegramProvider>
            {children}
        </TelegramProvider>
    )
}
