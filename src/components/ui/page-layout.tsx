import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'
import { AnimatedThemeToggler } from './animated-theme-toggler'
import { useAccount } from '@/hooks/use-account'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'

export const PageLayout = ({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) => {
    const { user, userFullName } = useAccount();
    return (
        <div className='min-h-screen w-full max-w-[810px] mx-auto overflow-x-hidden'>
            <header className='w-full h-16 inline-flex items-center justify-between px-4'>
                <div className='h-10 bg-[#1f1f1f] rounded-2xl px-2 inline-flex gap-2 items-center'>
                    <Avatar>
                        <AvatarImage src={user?.photo_url} />
                        <AvatarFallback>{userFullName.fallback}</AvatarFallback>
                    </Avatar>
                    <div className='bg-white rounded-lg px-1 max-w-20'>
                        <p className='text-black font-bold max-w-16 truncate'>
                            {userFullName.name}asdfasdfsadfsadf
                        </p>
                    </div>
                </div>
                <AnimatedThemeToggler />
            </header>

            <main
                className={cn(
                    'size-full relative px-4',
                    className,
                )}
            >
                {children}
            </main>
        </div>
    )
}