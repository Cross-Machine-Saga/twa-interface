export const ADMIN_ID = import.meta.env.VITE_ADMIN_ID || 5234015190;
export const TELEGRAM_APP_URL = import.meta.env.VITE_TELEGRAM_APP_LINK || 'https://t.me/cross_stitch_machine_bot/app';
export const NODE_ENV = import.meta.env.VITE_NODE_ENV || 'production';
export const ADS_GRAM_UNIT_ID = import.meta.env.VITE_ADS_GRAM_UNIT_ID || 0;
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