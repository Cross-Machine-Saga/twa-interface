import { TG_API_URL } from "@/lib/constants"

export function useBotNotification() {
    async function notify(
        userId: number,
        message: string,
    ) {
        const body = new URLSearchParams()
        body.set('chat_id', userId.toString())
        body.set('text', message)
        body.set('parse_mode', 'HTML')

        const res = await fetch(`${TG_API_URL}/sendMessage`, {
            method: 'POST',
            body,
        })

        const data = await res.json()
        if (!data.ok) {
            console.error('sendMessage error:', data)
        }
    }
    return {
        notify,
    }
}