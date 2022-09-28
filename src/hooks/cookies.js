import { addEventListener, removeEventListener } from '@core/utils/helper';
import { useEffect, useState } from 'react';

export default function useCookies() {
    const [cookies, setCookies] = useState({});

    const parse = () => {
        const parsed = document.cookie.split(';').reduce((cookies, cookie) => {
            const [key, value] = cookie.split('=');
            if (key && value) cookies[decodeURIComponent(key.trim())] = decodeURIComponent(value.trim());

            return cookies;
        }, {});

        setCookies(parsed);
    };

    const set = (key, val) => { // TODO
        document.cookie = `${key}=${val}`;

        parse();
    };

    useEffect(() => {
        addEventListener();

        return () => removeEventListener();
    }, []);

    return [cookies, set];
}