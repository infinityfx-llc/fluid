'use client';

import { classes, combineClasses } from '../../../src/core/utils';
import { Selectors } from '../../../src/types';
import { forwardRef, useState, useRef, useEffect } from 'react';
import { createStyles } from '../../core/style';
import { useTrigger } from '@infinityfx/lively/hooks';
import { Animatable } from '@infinityfx/lively';

const styles = createStyles('ticker', {
    '.text': {
        display: 'flex',
        alignItems: 'flex-end',
        height: '1.2em',
        overflow: 'hidden'
    },

    '.column': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },

    '.column > *': {
        height: '1.2em',
        lineHeight: 1.2
    }
});

export type TickerSelectors = Selectors<'text' | 'column'>;

const Ticker = forwardRef(({ children, cc = {}, align = 'right', selective, duration = .7, stagger = .1, ...props }: {
    children: number | string | (number | string)[];
    cc?: TickerSelectors;
    align?: 'left' | 'right';
    selective?: boolean;
    duration?: number;
    stagger?: number;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = combineClasses(styles, cc);

    const trigger = useTrigger();
    const prev = useRef(children.toString());
    const mutable = useRef<(string | null)[][]>(children.toString().split('').map(char => [char]));
    const prevLastRow = useRef<(string | null)[]>([]);
    const [state, setState] = useState(mutable.current);

    function trim() {
        const trimmed = [];

        for (let i = 0; i < mutable.current.length; i++) {
            let chars = mutable.current[i];
            chars = chars.slice(chars.length > 2 ? 1 : 0);

            if (chars[0] !== null || chars.length > 1) trimmed.push(chars);
        }

        mutable.current = trimmed;
        setState(trimmed);
    }

    useEffect(() => {
        if (prev.current === children.toString()) return;
        prev.current = children.toString();

        const chars = prev.current.split(''),
            updated = mutable.current,
            diff = updated.length - chars.length;

        prevLastRow.current = updated.map(col => col[col.length - 1]);

        if (diff > 0) chars[align === 'right' ? 'unshift' : 'push'](...new Array(diff).fill(null));

        for (let i = chars.length - 1; i >= 0; i--) {
            if (i < updated.length) {
                updated[i].push(chars[i]);
            } else {
                updated[align === 'right' ? 'unshift' : 'push']([chars[i]]);
            }
        }

        setTimeout(trim, (duration + (updated.length - 1) * stagger) * 1000);
        setState(updated.slice());
        trigger();
    }, [children]);

    return <div ref={ref} {...props} className={classes(style.text, props.className)}>
        {state.map((column, i) => {

            return <Animatable key={i}
                initial={{ translate: '0em 0em' }}
                animate={{ translate: ['0em 1.2em', '0em 0em'], composite: 'combine', duration, delay: i * stagger }}
                triggers={[{ on: trigger, name: !selective || prevLastRow.current[i] !== column[column.length - 1] ? 'animate' : 'undefined', commit: false }]}>

                <pre className={style.column}>
                    {column.map((char, i) => <div key={i}>{char || ' '}</div>)}
                </pre>
            </Animatable>
        })}
    </div>;
});

Ticker.displayName = 'Ticker';

export default Ticker;