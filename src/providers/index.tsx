import { useEffect } from 'react'
import { TelegramProvider } from './telegram-provider'
import { NODE_ENV } from '@/lib/constants'
import { Toaster } from 'sonner'


export const Provider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        if (NODE_ENV !== 'production') {
            import('vconsole').then((m) => new m.default())
        }
    }, [])

    return (
        <TelegramProvider>
            {children}
            <Toaster
                className="mt-20!"
                position="top-center"
                toastOptions={{
                className:
                    '!font-inter !text-[#FFFFFF] !font-[400] !leading-[20px] !text-[16px] !border !rounded-[12px] !p-4 !border-foreground/40 !bg-background',
                }}
                duration={5000}
                invert={true}
            />
        </TelegramProvider>
    )
}
