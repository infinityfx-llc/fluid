import { StyleContext } from '@components/context/style';
import { hashStyleMap } from '@core/utils/css';
import { useContext, useMemo, useRef } from 'react';

export default function useStyles(rules = {}) {
    const stylesheet = useContext(StyleContext);
    const id = useRef();
    const selectors = useRef({});

    const hash = useMemo(() => hashStyleMap(rules), [rules]);

    if (hash === id.current) return selectors.current;
    stylesheet.delete(id.current);
    id.current = hash;

    return selectors.current = stylesheet.insert(hash, rules);
}