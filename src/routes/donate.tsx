import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { PageLayout } from '@/components/ui/page-layout'
import { invoice } from '@tma.js/sdk';
import { useInvoice } from '@/hooks/use-invoice';
import { toast } from 'sonner';
import { useBotNotification } from '@/hooks/use-bot-notification';
import { useAccount } from '@/hooks/use-account';
import { ADMIN_ID } from '@/lib/constants';

export const Route = createFileRoute('/donate')({
  component: RouteComponent,
})

function RouteComponent() {
  const maxCommentLength = 500
  const [starsAmount, setStarsAmount] = useState<string>('')
  const [comment, setComment] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  
  const {
    create: createInvoice,
    syncLastUpdateId,
    pollPreCheckoutUntilPaid
  } = useInvoice();
  const { notify } = useBotNotification();
  const { user, userFullName } = useAccount();

  const handleCommentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value
    if (value.length <= maxCommentLength) {
      setComment(value)
    } else {
      setComment(value.slice(0, maxCommentLength))
    }
  }

  const handlePresetClick = (value: number) => {
    setStarsAmount(String(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const numericStars = parseInt(starsAmount.replace(/\s/g, ''))

    if (!numericStars || numericStars <= 0) {
      setError('Укажи количество звёзд больше нуля.')
      return
    }

    try {
      setIsSubmitting(true)

      const invoiceUrl = await createInvoice({stars: numericStars});
      await syncLastUpdateId()

      // 3. запускаем параллельный поллер, который будет ловить pre_checkout_query
      const pollingPromise = pollPreCheckoutUntilPaid(60000)


      const invoiceStatus = await invoice.openUrl(invoiceUrl)

      await pollingPromise;

      if(invoiceStatus === 'cancelled') {
        toast.error('Сожалеем, что ты отменил донат. Наверное тебе нужнее :D');
        return;
      }
      if(invoiceStatus === 'paid') {
        toast.success('Вау, спасибо тебе. Ты крут!');
        const message = [
          '<b>⭐ ДОНАТ ⭐</b>',
          `💰 <b>Сумма:</b> <i>${numericStars} ⭐</i>`,
          `👤 <b>От:</b> <a href="https://t.me/${user?.id}">${userFullName.name}</a>`,
        ];
  
        if(comment && comment.length) {
          message.push(
            '💬 <i>Этот пользователь оставил свой комментарий:</i>',
            '',
            `<i>${comment.trim()}</i>`
          );
        }
        await notify(ADMIN_ID, message.join('\n'));
        setSuccess('Спасибо за поддержку! 💛')
      }
    } catch (err) {
      setError('Что-то пошло не так. Попробуй ещё раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const remaining = maxCommentLength - comment.length

  return (
    <PageLayout className="flex flex-col items-center mt-[120px] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[380px] rounded-3xl bg-[#1f1f1f] p-4 flex flex-col gap-4"
      >
        {/* Заголовок */}
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold text-white">
            Поддержать проект
          </h1>
          <p className="text-xs text-neutral-300">
            Донат звёздами в Telegram. После оплаты можно оставить
            короткий комментарий (по желанию).
          </p>
        </div>

        {/* Сумма в звёздах */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="stars-amount"
              className="text-xs font-medium text-neutral-200"
            >
              Количество звёзд
            </label>
            <span className="text-[10px] text-neutral-400 uppercase tracking-[0.16em]">
              Telegram Stars
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="stars-amount"
              type="number"
              min={1}
              inputMode="numeric"
              value={starsAmount}
              onChange={(e) => setStarsAmount(e.target.value)}
              className="flex-1 rounded-2xl border border-[#2a2a2a] bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-neutral-300"
              placeholder="Например, 50"
            />
          </div>

          {/* Пресеты */}
          <div className="flex gap-2">
            {[25, 50, 100].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handlePresetClick(value)}
                className="flex-1 rounded-2xl bg-black/30 py-1.5 text-xs font-semibold text-neutral-200 hover:bg-black/50"
              >
                {value} ⭐
              </button>
            ))}
          </div>
        </div>

        {/* Комментарий (необязательный) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="comment"
              className="text-xs font-medium text-neutral-200"
            >
              Комментарий (опционально)
            </label>
            <span className="text-[10px] text-neutral-500">
              до {maxCommentLength} символов
            </span>
          </div>

          <div className="relative">
            <textarea
              id="comment"
              value={comment}
              onChange={handleCommentChange}
              rows={3}
              maxLength={maxCommentLength}
              className="w-full resize-none rounded-2xl border border-[#2a2a2a] bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-neutral-300"
              placeholder="Можешь написать пару слов, если хочешь 😊"
            />
            <div className="mt-1 flex justify-end text-[10px] text-neutral-500">
              {remaining} осталось
            </div>
          </div>
        </div>

        {/* Ошибка / успех */}
        {(error || success) && (
          <div className="text-xs">
            {error && <p className="text-red-400">{error}</p>}
            {success && <p className="text-emerald-400">{success}</p>}
          </div>
        )}

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 w-full rounded-2xl bg-white py-2 text-sm font-semibold text-black hover:bg-neutral-100 disabled:opacity-70 disabled:hover:bg-white"
        >
          {isSubmitting ? 'Обработка…' : 'Оплатить звёздами'}
        </button>

        <p className="mt-1 text-[10px] text-neutral-500">
          Оплата происходит через официальные Telegram Stars. 
          Никаких доступов к твоему аккаунту мы не получаем.
        </p>
      </form>
    </PageLayout>
  )
}
