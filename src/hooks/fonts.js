import { fontSetToStyleMap, hashObject } from '@core/utils/css';
import { is } from '@core/utils/helper';
import { useEffect, useMemo, useRef } from 'react';
import useStylesheet from './stylesheet';

export default function useFonts(fonts = {}) {
    const stylesheet = useStylesheet();
    const id = useRef();

    const [hash, fontset] = useMemo(() => {
        const fontset = is.function(fonts) ? fonts() : fonts;

        return [hashObject(fontset), fontset];
    }, [fonts]);

    useEffect(() => {
        return () => stylesheet.delete(id.current);
    }, []);

    if (hash === id.current) return;
    stylesheet.delete(id.current);
    id.current = hash;

    const { styles, uris } = fontSetToStyleMap(fontset);
    stylesheet.insert(hash, styles, true);
    uris.forEach(uri => stylesheet.preconnect(uri));
};