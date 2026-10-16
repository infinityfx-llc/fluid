import { FluidColorScheme, PolymorphComponentProps } from "../types";
import { COLOR_SCHEME_COOKIE } from "../utils";

function applyColorScheme(cookieName: string, initialScheme: string) {
    const cookies = document.cookie.split(';').reduce<{ [key: string]: string }>((cookies, cookie) => {
        const [key, value] = cookie.split('=');

        if (key && value) cookies[decodeURIComponent(key.trim())] = decodeURIComponent(value.trim());

        return cookies;
    }, {});

    const scheme = cookies[cookieName] || 'system';
    const element = document.documentElement;

    if (!(scheme && /^[a-z0-9-_]+$/i.test(scheme)) || !element) return;

    element.id = '__fluid__global';
    element.classList.add('scheme-' + scheme);

    const meta = document.getElementById('fluid-color-scheme-meta') as HTMLMetaElement | null;
    if (!meta) return;

    if (scheme === 'dark' ||
        (scheme === 'system' && initialScheme === 'dark')) meta.content = 'dark';
}

/**
 * Synchronous theme injection script, which reads and applies a theme before first paint.
 * 
 * Meant to be used as an alternative to SSR.
 * 
 * Might cause hydration mismatch warnings.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/theming}
 */
export default function FluidThemeScript<E extends React.ElementType = 'script'>({ as, initialColorScheme = 'light', ...props }: {
    initialColorScheme?: FluidColorScheme;
} & PolymorphComponentProps<E>) {

    const Wrapper = as || 'script';

    return <>
        <Wrapper
            {...props}
            dangerouslySetInnerHTML={{ __html: `(${applyColorScheme.toString()})('${COLOR_SCHEME_COOKIE}', '${initialColorScheme}')` }} />
        <meta
            suppressHydrationWarning
            id="fluid-color-scheme-meta"
            name="color-scheme"
            content="only light" />
    </>;
}