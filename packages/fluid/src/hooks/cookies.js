import { addEventListener, removeEventListener } from '@core/utils/event';
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

    const set = (key, val) => {
        document.cookie = `${key}=${val}`;
        window.dispatchEvent(new Event('cookieupdate'));
    };

    useEffect(() => {
        addEventListener('cookieupdate', parse);
        parse(); // FIX FLASHING

        return () => removeEventListener('cookieupdate', parse);
    }, []);

    return [cookies, set];
}