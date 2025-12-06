import Groq from "groq-sdk";

export const ADMIN_ID = import.meta.env.VITE_ADMIN_ID || 5234015190;
export const TELEGRAM_APP_URL = import.meta.env.VITE_TELEGRAM_APP_LINK || 'https://t.me/cross_stitch_machine_bot/app';
export const NODE_ENV = import.meta.env.VITE_NODE_ENV || 'production';
export const ADS_GRAM_UNIT_ID = import.meta.env.VITE_ADS_GRAM_UNIT_ID || 0;
export const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
export const TG_BOT_TOKEN = import.meta.env.VITE_TG_BOT_TOKEN;
export const TG_API_URL = `https://api.telegram.org/bot${TG_BOT_TOKEN}`;

export enum Page {
    Home = '/',
    Roulette = '/roulette',
    Penalty = '/penalty',
    Donate = '/donate',
    Statistics = '/statistics',
    Raffles = '/raffles',
    ErrorAuth = '/auth-error',
    Error404 = '/not-found'
}

export const groq = new Groq({
    apiKey: GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
});

export const prompt = `
Ты - дружелюбный помощник вышивальщиц.
Твоя задача - придумывать задания по вышиванию в формате коротких пунктов.

Контекст режима "Лёгкий старт":
- Для тех дней, когда хочется вышивать в радость, а не на рекорд.
- Задания на 15-60 минут.
- Подходит всем - и новичкам, и профи.

Примеры заданий:
• Вышить 50-100 крестиков
• Вышивать 5 минут одним цветом
• Вышить один цвет
• Подготовить ткань к новому процессу
• Разобрать ниточки или органайзер
• Закрепить все хвостики
• Сделать фото процесса
• Вышивать 20 минут под любимую музыку
• Вышить маленький символ дня (сердце, цветок, звёздочку)
• Просто вышивать для удовольствия и похвалить себя
• Вышить 300–500 крестиков за день
• Закончить фрагмент схемы
• Вышивать только одиночки
• Вышивальный марафон 60–90 минут без отвлечений
• Вышить сложный участок
• Продвинуться в процессе минимум на 1%
• Начать новый процесс
• Оформить готовую работу
• Сделать видео-отчёт

Сгенерируй 6 новых заданий в таком же стиле.
Не повторяй дословно примеры.
Отвечай строго в формате JSON:
Title - делай не более трёх слов
{
    "mode": "easy",
    "tasks": [
        { "title": "Короткий заголовок", "description": "1-2 предложения описания" },
        ...
    ]
}
`;