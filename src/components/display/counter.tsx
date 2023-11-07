'use client';

import { classes, combineClasses } from '../../../src/core/utils';
import { Selectors } from '../../../src/types';
import { forwardRef, useEffect, useState, useRef } from 'react';
import { createStyles } from '../../core/style';
import { useTrigger } from '@infinityfx/lively/hooks';
import { Animatable } from '@infinityfx/lively';

const Counter = forwardRef(({ children, cc = {}, align = 'right', ...props }: {
    children: number | string;
    cc?: Selectors;
    align?: 'left' | 'right';
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('counter', {
        '.counter': {
            display: 'flex',
            alignItems: 'flex-end',
            color: 'var(--f-clr-text-100)',
            height: '1.2em',
            overflow: 'hidden'
        },

        '.column': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '.68em'
        }
    });
    const style = combineClasses(styles, cc);

    const duration = .7, stagger = .1;
    const trigger = useTrigger();
    const timeout = useRef<any>();
    const prev = useRef(children.toString());
    const [state, setState] = useState(children.toString().split('').map(char => [char]));

    function trim(array: string[][]) {
        const trimmed = [];

        for (let i = 0; i < array.length; i++) {
            const chars = array[i].slice(-1);

            if (chars[0] !== ' ') trimmed.push(chars);
        }

        setState(trimmed);
    }

    useEffect(() => {
        if (prev.current === children.toString()) return;

        prev.current = children.toString();
        const arr = prev.current.split('');
        const mutated = state.slice();
        const len = mutated.length,
            diff = len - arr.length;

        if (diff > 0) arr[align === 'right' ? 'unshift' : 'push'](...new Array(diff).fill(' '));

        for (let i = arr.length - 1; i >= 0; i--) {
            if (i < len) {
                mutated[i].push(arr[i]);
            } else {
                mutated[align === 'right' ? 'unshift' : 'push']([arr[i]]);
            }
        }

        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => trim(mutated), (duration + (mutated.length - 1) * stagger) * 1000);
        setState(mutated);
        trigger();
    }, [children]);

    return <div ref={ref} {...props} className={classes(style.counter, props.className)}>
        {state.map((column, i) => {
            return <Animatable key={i}
                initial={{ translate: '0em 0em' }}
                animate={{ translate: ['0em 1.35em', '0em 0em'], composite: 'combine', duration, delay: i * stagger }}
                triggers={[{ on: trigger }]}>

                <div className={style.column}>
                    {column.map((char, i) => {
                        const isEmpty = char === ' ';

                        return <div key={i} style={{ color: isEmpty ? 'transparent' : undefined }}>{isEmpty ? '0' : char}</div>
                    })}
                </div>
            </Animatable>
        })}
    </div>;
});

Counter.displayName = 'Counter';

export default Counter;