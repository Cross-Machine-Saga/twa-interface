import { PageLayout } from '@/components/ui/page-layout'
import { createFileRoute, Link } from '@tanstack/react-router'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Page } from '@/lib/constants'
import { cn } from '@/lib/utils';
// import logo from '../logo.svg'

export const Route = createFileRoute(Page.Home)({
  component: App,
})

function App() {
  return (
    <PageLayout className="flex flex-col items-center mt-[140px] px-4">
      <div className="grid w-full grid-cols-1 sm:grid-cols-3 gap-3">
        <CardLink
          linkTo={Page.Roulette}
          lottieUrl="https://lottie.host/59e7bb98-9088-4e50-906e-e707687d2d6f/Y8qaol5Ezq.lottie"
          title="Рулетка"
          subtitle="играть"
          mode="режим"
          description="Запустить задания"
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
      </div>
    </PageLayout>
  )
}


function CardLink ({
  linkTo,
  lottieUrl,
  title = "Title",
  subtitle = "Subtitle",
  mode = "Mode",
  description = "",
  className,
}:{
  linkTo: Page,
  lottieUrl: string,
  title?: string,
  subtitle?: string,
  mode?: string,
  description?: string,
  className?: string,
}) {
  return (
    <Link
      // @ts-ignore
      to={linkTo}
      className={cn("group relative flex aspect-square flex-col justify-between rounded-3xl bg-[#1f1f1f] p-3 text-white transition-transform duration-150 hover:bg-[#252525]", className)}
    >
      <DotLottieReact
        src={lottieUrl}
        loop
        autoplay
      />
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span className="uppercase tracking-[0.16em]">{subtitle}</span>
        <span className="text-[10px] opacity-70">{mode}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-lg font-semibold">{title}</span>
        <span className="text-xs text-neutral-400">
          {description}
        </span>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-3xl border border-white/5 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
    </Link>
  );
}