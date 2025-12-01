import { TG_API_URL, TG_BOT_TOKEN } from "@/lib/constants"

type CreateInvoiceArgs = {
    stars: number
    comment?: string
}




export function useInvoice() {
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
    }
}