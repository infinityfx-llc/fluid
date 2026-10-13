import { PolymorphComponentProps } from "../types";
import { COLOR_SCHEME_COOKIE } from "../utils";

function applyColorScheme(cookieName: string) {
    const cookies = document.cookie.split(';').reduce<{ [key: string]: string }>((cookies, cookie) => {
        const [key, value] = cookie.split('=');

        if (key && value) cookies[decodeURIComponent(key.trim())] = decodeURIComponent(value.trim());

        return cookies;
    }, {});

    const scheme = cookies[cookieName];
    const element = document.getElementById('__fluid') || document.documentElement;

    if (!(scheme && /^[a-z0-9-_]+$/i.test(scheme)) || !element) return;

    let current = '';
    element.classList.forEach(name => {
        if (name.startsWith('scheme-')) current = name;
    });

    current ?
        element.classList.replace(current, 'scheme-' + scheme) :
        element.classList.add('scheme-' + scheme);
    
    element.classList.add('__temp__theme');
}

export default function SyncThemeBlocking<E extends React.ElementType = 'script'>({ as, ...props }: PolymorphComponentProps<E>) {

    const Wrapper = as || 'script';

    return <Wrapper {...props} dangerouslySetInnerHTML={{ __html: `(${applyColorScheme.toString()})('${COLOR_SCHEME_COOKIE}')` }} />;
}