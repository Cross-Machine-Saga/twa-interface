export const ADMIN_ID = import.meta.env.VITE_ADMIN_ID || 5234015190;
export const TELEGRAM_APP_URL = import.meta.env.VITE_TELEGRAM_APP_LINK || 'https://t.me/cross_stitch_machine_bot/app';
export const NODE_ENV = import.meta.env.VITE_NODE_ENV || 'production';

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