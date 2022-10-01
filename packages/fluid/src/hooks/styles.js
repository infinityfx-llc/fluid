import { hashObject } from '@core/utils/css';
import { is } from '@core/utils/helper';
import { useEffect, useMemo, useRef } from 'react';
import useStylesheet from './stylesheet';

export default function useStyles(rules = {}) {
    const stylesheet = useStylesheet();
    const id = useRef();
    const selectors = useRef({});

    const [hash, ruleset] = useMemo(() => {
        const ruleset = is.function(rules) ? rules() : rules;

        return [hashObject(ruleset), ruleset];
    }, [rules]);

    useEffect(() => {
        return () => stylesheet.delete(id.current);
    }, []);

    if (hash === id.current) return selectors.current;
    stylesheet.delete(id.current);
    id.current = hash;

    return selectors.current = stylesheet.insert(hash, ruleset);
}