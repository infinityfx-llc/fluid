import { hashObject } from '@core/utils/css';
import { is } from '@core/utils/helper';
import { useEffect, useMemo, useRef } from 'react';
import useStylesheet from './stylesheet';

export default function useGlobalStyles(rules = {}) {
    const stylesheet = useStylesheet();
    const id = useRef();

    const [hash, ruleset] = useMemo(() => {
        const ruleset = is.function(rules) ? rules() : rules;

        return [hashObject(ruleset), ruleset];
    }, [rules]);

    useEffect(() => {
        return () => stylesheet.delete(id.current);
    }, []);

    if (hash === id.current) return;

    stylesheet.delete(id.current);
    stylesheet.insert(hash, ruleset, true);
    id.current = hash;
};