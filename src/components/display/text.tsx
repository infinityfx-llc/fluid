'use client';

import { classes, combineClasses } from '../../../src/core/utils';
import { Selectors } from '../../../src/types';
import { forwardRef, useEffect, useState, useRef } from 'react';
import { createStyles } from '../../core/style';
import { useTrigger } from '@infinityfx/lively/hooks';
import { Animatable } from '@infinityfx/lively';

const Text = forwardRef(({ children, cc = {}, align = 'right', selective, ...props }: {
    children: number | string;
    cc?: Selectors;
    align?: 'left' | 'right';
    selective?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('text', {
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
            minWidth: '1ch'
        },

        '.column > *': {
            lineHeight: 1.2
        }
    });
    const style = combineClasses(styles, cc);

    const duration = .7, stagger = .1;
    const trigger = useTrigger();
    const prev = useRef(children.toString());
    const mutable = useRef(children.toString().split('').map(char => [char]));
    const prevLastRow = useRef<string[]>([]);
    const [state, setState] = useState(mutable.current);

    function trim() {
        const trimmed = [];

        for (let i = 0; i < mutable.current.length; i++) {
            const chars = mutable.current[i].slice(1);

            if (chars[0] !== ' ' || chars.length > 1) trimmed.push(chars);
        }

        mutable.current = trimmed;
        setState(trimmed);
    }

    useEffect(() => {
        if (prev.current === children.toString()) return;

        prev.current = children.toString();
        const arr = prev.current.split(''), updated = mutable.current;
        const len = updated.length, diff = len - arr.length;

        prevLastRow.current = updated.map(col => col[col.length - 1]);

        if (diff > 0) arr[align === 'right' ? 'unshift' : 'push'](...new Array(diff).fill(' '));

        for (let i = arr.length - 1; i >= 0; i--) {
            if (i < len) {
                updated[i].push(arr[i]);
            } else {
                updated[align === 'right' ? 'unshift' : 'push']([arr[i]]);
            }
        }

        setTimeout(trim, (duration + (updated.length - 1) * stagger) * 1000);
        setState(updated.slice());
        trigger();
    }, [children]);

    return <div ref={ref} {...props} className={classes(style.counter, props.className)}>
        {state.map((column, i) => {
            return <Animatable key={i}
                initial={{ translate: '0em 0em' }}
                animate={{ translate: ['0em 1.2em', '0em 0em'], composite: 'combine', duration, delay: i * stagger }}
                triggers={[{ on: trigger, name: !selective || prevLastRow.current[i] !== column[column.length - 1] ? 'animate' : 'undefined' }]}>

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

Text.displayName = 'Text';

export default Text;