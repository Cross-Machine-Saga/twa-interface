import { PageLayout } from '@/components/ui/page-layout'
import { createFileRoute, Link } from '@tanstack/react-router'
import { shareURL } from '@tma.js/sdk';
import { useAdsgram } from '@adsgram/react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ADS_GRAM_UNIT_ID, Page, TELEGRAM_APP_URL } from '@/lib/constants'
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
// import logo from '../logo.svg'

export const Route = createFileRoute(Page.Home)({
  component: App,
})

function App() {
  const { show } = useAdsgram({
    blockId: ADS_GRAM_UNIT_ID,
    debug: false,
    onReward: () => {toast.success('Удалось посмотреть рекламу')},
    onError: () => {toast.error('Не удалось посмотреть рекламу')},
  })


  return (
    <PageLayout className="flex flex-col items-center mt-[140px] px-4">
      <div className="grid w-full grid-cols-2 sm:grid-cols-3 gap-3">
        <CardLink
          linkTo={Page.Roulette}
          lottieUrl="https://lottie.host/59e7bb98-9088-4e50-906e-e707687d2d6f/Y8qaol5Ezq.lottie"
          title="Рулетка"
          subtitle="играть"
          mode="режим"
          description="Запустить задания"
        />
        <CardLink
          linkTo={Page.Statistics}
          lottieUrl="https://lottie.host/67c4aa47-f19a-428c-bfc5-cc2a1f96da01/hQ7AfUdy8W.lottie"
          title="Статистика"
          subtitle="участники"
          mode="инфо"
          description="Статистика по участникам"
        />
        <CardLink
          linkTo={Page.Raffles}
          lottieUrl="https://lottie.host/0d9fccc8-887a-4716-9c6f-0b1cb1b6dc19/yqiDHNMSdf.lottie"
          title="Розогрыши"
          subtitle="участвуй"
          mode="доп. игры"
          description="Крутые розогрыши"
        />
        <CardLink
          linkTo={Page.Donate}
          lottieUrl="https://lottie.host/143a2c0d-1a44-4d70-8659-e34da2b70771/PbOE4mMaDz.lottie"
          title="Поддержать"
          subtitle="донат"
          mode="поддержка"
          description="На развитие проекта"
        />
        <CardLink
          lottieUrl="https://lottie.host/541be56e-d87d-4171-a21c-08d263b3ddec/nETa8dWKkG.lottie"
          title="Реклама"
          subtitle="бесплатно"
          mode="не надо платить"
          description="Посмотри бесплатно"
          onClick={show}
        />
        <CardLink
          lottieUrl="https://lottie.host/6838f3bf-01ab-4379-96a3-7af625e0571d/iKw0w0qOPX.lottie"
          title="Поделиться"
          subtitle="Распространяй"
          mode="друзья"
          description="Поделиться с друзьями"
          onClick={() => {
            if (shareURL.isAvailable()) {
              shareURL(
                TELEGRAM_APP_URL,
                '🧵💛 Хочешь новое вышивальное задание? Крест-Машина крутанёт рулетку и подкинет свежую идею! 🎰✨ Попробуй сама — это веселее, чем кажется! 😉',
              )
            }
          }}
        />
      </div>
    </PageLayout>
  )
}


function CardLink({
  linkTo,
  lottieUrl,
  title = "Title",
  subtitle = "Subtitle",
  mode = "Mode",
  description = "",
  className,
  onClick,
}: {
  lottieUrl: string,
  linkTo?: Page,
  title?: string,
  subtitle?: string,
  mode?: string,
  description?: string,
  className?: string,
  onClick?: () => void,
}) {

  const contentChildren = (
    <>
      <DotLottieReact
        src={lottieUrl}
        loop
        autoplay
      />
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span className="uppercase tracking-[0.16em]">{subtitle}</span>
        <span className="text-[10px] opacity-70 hidden sm:block">{mode}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-lg font-semibold">{title}</span>
        <p className="text-xs text-neutral-400 truncate max-w-[152px]">
          {description}
        </p>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-3xl border border-white/5 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
    </>
  );

  if(linkTo) {
    return (
      <Link
      // @ts-ignore
      to={linkTo}
      className={cn("group relative flex aspect-square flex-col justify-between rounded-3xl bg-[#1f1f1f] p-3 text-white transition-transform duration-150 hover:bg-[#252525]", className)}
      onClick={onClick}
    >
      {contentChildren}
    </Link>
    );
  }
  return (
    <button
      className={cn("group relative flex aspect-square flex-col justify-between rounded-3xl bg-[#1f1f1f] p-3 text-white transition-transform duration-150 hover:bg-[#252525]", className)}
      onClick={onClick}
    >
      {contentChildren}
    </button>
  );
}