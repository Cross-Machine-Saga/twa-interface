import { useMemo } from 'react';
import { parseInitDataQuery, initData, isTMA } from '@tma.js/sdk'
import { NODE_ENV } from '@/lib/constants';

const devInitData: string = 'user=%7B%22id%22%3A649685983%2C%22first_name%22%3A%22Dmitriy%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22polienko161%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FyJ_JeNbEN5vPQROkivhZRAoHz5wqfZ1To3Mo_e5EULA.svg%22%7D&chat_instance=-7293269513689266275&chat_type=sender&auth_date=1743505634&signature=QPjIV0WZgTB_g-7R43jvO-Vktj7o-SvRCACHQzVEwBw-GLCFUE59JgBSXV9vImmAySK9w_IoVZSNnI6K-FEoCA&hash=c2061dcd32363814b406676c58eacd394a3c249b80f69fe3f0ea8162a0837932'


/**
 * Хук для получения и парсинга данных из Telegram InitData.
 */
export function useAccount() {
    if(isTMA()) {
        initData.restore();
    }

    const id = useMemo(() => {
        const rawInitData = initData.raw();
        if(isTMA() && rawInitData) {
            return rawInitData;
        }
        return devInitData;
    }, [isTMA, initData, NODE_ENV]);

    const parsedInitData = parseInitDataQuery(id);
    const userFullName = useMemo(() => {
        if(!parsedInitData || !parsedInitData.user) {
            return {
                name: "Unknown",
                fallback: "UN",
            }
        }

        return {
            name: `${parsedInitData.user.first_name} ${parsedInitData.user.last_name}`.trim(),
            fallback: parsedInitData.user.last_name ? `${parsedInitData.user.first_name[0]}${parsedInitData.user.last_name[0]}`.trim().toUpperCase() : `${parsedInitData.user.first_name[0]}${parsedInitData.user.first_name[parsedInitData.user.first_name.length - 1]}`.trim().toUpperCase(),
        }
    }, [parsedInitData]);

    return {
        initData,
        parsedInitData,
        user: parsedInitData?.user,
        userFullName,
    }
}