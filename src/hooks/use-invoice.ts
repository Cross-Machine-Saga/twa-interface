import { TG_API_URL, TG_BOT_TOKEN } from "@/lib/constants"

type CreateInvoiceArgs = {
    stars: number
    comment?: string
}



let lastUpdateId: number | undefined;

export function useInvoice() {

    async function syncLastUpdateId() {
        if (!TG_BOT_TOKEN) return;

        const res = await fetch(
            `${TG_API_URL}/getUpdates?limit=1&timeout=0`
        )
        const data = await res.json()

        if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
            lastUpdateId = data.result[data.result.length - 1].update_id
        }
    }

    async function answerPreCheckout(preCheckoutQueryId: string) {
        const body = new URLSearchParams()
        body.set('pre_checkout_query_id', preCheckoutQueryId)
        body.set('ok', 'true')

        const res = await fetch(`${TG_API_URL}/answerPreCheckoutQuery`, {
            method: 'POST',
            body,
        })
        const data = await res.json()
        if (!data.ok) {
            console.error('answerPreCheckoutQuery error:', data)
        }
    }

    async function pollPreCheckoutUntilPaid(timeoutMs = 60000) {
        if (!TG_BOT_TOKEN) return

        const start = Date.now()
        let stop = false

        while (!stop && Date.now() - start < timeoutMs) {
            const params = new URLSearchParams()
            if (typeof lastUpdateId === 'number') {
                params.set('offset', String(lastUpdateId + 1))
            }
            params.set('timeout', '0')
            params.set('limit', '10')

            const res = await fetch(`${TG_API_URL}/getUpdates?${params.toString()}`)
            const data = await res.json()

            if (!data.ok) {
                console.error('getUpdates error:', data)
                await new Promise((r) => setTimeout(r, 1000))
                continue
            }

            const updates: any[] = data.result
            for (const upd of updates) {
                lastUpdateId = upd.update_id

                if (upd.pre_checkout_query) {
                    const q = upd.pre_checkout_query
                    console.log('pre_checkout_query:', q)

                    // подтверждаем платёж
                    await answerPreCheckout(q.id)

                    // дальше можно продолжать цикл, чтобы поймать successful_payment,
                    // но для Stars тебе важнее, что pre_checkout прошёл
                }

                // если хочешь, можешь также ловить successful_payment:
                if (upd.message?.successful_payment) {
                    console.log('successful_payment:', upd.message.successful_payment)
                    stop = true
                }
            }

            // маленькая пауза, чтобы не спамить
            if (!stop) {
                await new Promise((r) => setTimeout(r, 1000))
            }
        }
    }


    async function create({ stars, comment }: CreateInvoiceArgs) {
        if (!TG_BOT_TOKEN) {
            throw new Error('BOT_TOKEN не задан (VITE_TG_BOT_TOKEN)')
        }

        const url = `${TG_API_URL}/createInvoiceLink`

        // Bot API принимает form-data или x-www-form-urlencoded.
        const body = new URLSearchParams()
        body.set('title', 'Поддержка Крест-Машины')
        body.set(
            'description',
            comment && comment.trim().length > 0
                ? comment.slice(0, 255) // у description тоже есть лимит
                : 'Донат звёздами за рулетку 🧵✨'
        )
        body.set('payload', `donate_${Date.now()}`) // твой внутренний ID
        body.set('currency', 'XTR')
        body.set(
            'prices',
            JSON.stringify([
                {
                    label: 'Donate',
                    amount: stars, // для Stars 1 XTR = 1 единица
                },
            ])
        )
        // provider_token НЕ указываем для Stars

        const res = await fetch(url, {
            method: 'POST',
            body,
        })

        const data = await res.json()

        if (!data.ok) {
            console.error('createInvoiceLink error:', data)
            throw new Error(data.description || 'Не удалось создать инвойс')
        }

        // data.result - это строка-ссылка, типа "https://t.me/invoice/AbCdEf123"
        return data.result as string
    }
    return {
        create,
        syncLastUpdateId,
        pollPreCheckoutUntilPaid,
    }
}