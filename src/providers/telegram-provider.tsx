import { useEffect, type ReactNode } from "react"
import { useMatches, useRouter } from "@tanstack/react-router"
import useSound from 'use-sound'
import {
    backButton,
    closingBehavior,
    initFp,
    isTMA,
    swipeBehavior,
    viewport,
} from '@tma.js/sdk'
import { NODE_ENV, Page } from "@/lib/constants"

export const TelegramProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter()
    const pathnames = useMatches()
    const [playButtonSound] = useSound('/sounds/Button.aac', {
        interrupt: true,
    })
    /** ***************************************************************/
    /*                           TWA Init                            */
    /** ***************************************************************/

    useEffect(() => {
        initFp()
    }, [])

    useEffect(() => {
        if (NODE_ENV === 'production' && !isTMA()) {
            router.navigate({ to: Page.ErrorAuth as string })
            return
        }

        ; (async () => {
            if (isTMA()) {
                initFp()
                // fullscreen mode - ON
                if (viewport.mount.isAvailable()) {
                    await viewport.mount()
                    await viewport.requestFullscreen()
                }

                // enable closing behavior - ON
                if (closingBehavior.mount.isAvailable()) {
                    await closingBehavior.mount()
                }
                if (closingBehavior.mount.isAvailable()) {
                    await closingBehavior.enableConfirmation()
                }

                // disable swipe mode - ON
                if (swipeBehavior.mount.isAvailable()) {
                    await swipeBehavior.mount()
                }
                if (swipeBehavior.disableVertical.isAvailable()) {
                    await swipeBehavior.disableVertical()
                }
            }
        })()
    }, [])

    /** ***************************************************************/
    /*                        TWA Back Button                        */
    /** ***************************************************************/
    useEffect(() => {
        ; (async () => {
            if (await isTMA()) {
                if (backButton.mount.isAvailable()) {
                    await backButton.mount()
                }

                if (
                    pathnames[1].pathname === '/' &&
                    backButton.hide.isAvailable()
                ) {
                    await backButton.hide()
                } else {
                    if (backButton.show.isAvailable()) {
                        await backButton.show()
                    }
                }

                if (backButton.onClick.isAvailable()) {
                    backButton.onClick(() => {
                        playButtonSound()
                        if (pathnames[1].pathname === '/') return
                        router.navigate({ to: '/' })
                    })
                }
            }
        })()
    }, [pathnames])

    return children
}