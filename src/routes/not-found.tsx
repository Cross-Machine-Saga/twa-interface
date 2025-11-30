import { PageLayout } from "@/components/ui/page-layout";
import { Page } from "@/lib/constants";
import { Link } from "@tanstack/react-router";

export function NotFoundPage() {
  return (
    <PageLayout className="flex flex-col items-center gap-4 mt-[140px] px-4">
      {/* Значок 404 */}
      <div className="inline-flex items-center justify-center rounded-3xl bg-[#1f1f1f] px-4 py-2">
        <span className="text-sm font-semibold text-white tracking-[0.24em] uppercase">
          404
        </span>
      </div>

      {/* Заголовок + текст */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Страница не найдена
        </h1>
        <p className="max-w-[320px] text-sm text-foreground">
          Возможно, ссылка устарела или была набрана с ошибкой.
          Попробуй вернуться на главную и начать отсюда.
        </p>
      </div>

      {/* Кнопка "На главную" в твоём стиле */}
      {/* @ts-ignore */}
      <Link
        to={Page.Home}
        className="mt-2 w-[332px] rounded-2xl bg-[#1f1f1f] py-2 px-1.5 text-center text-sm font-semibold text-white"
      >
        Вернуться на главную
      </Link>

      {/* Доп. подпись поменьше */}
      <p className="mt-1 text-xs text-foreground">
        Если проблема повторяется - проверь адрес или обнови страницу.
      </p>
    </PageLayout>
  );
}
