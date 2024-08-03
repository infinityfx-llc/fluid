'use client';

import { classes, combineClasses } from '../../../src/core/utils';
import { Selectors } from '../../../src/types';
import { useState, useRef, useEffect } from 'react';
import { createStyles } from '../../core/style';
import { useTrigger } from '@infinityfx/lively/hooks';
import { Animatable } from '@infinityfx/lively';
import { LayoutGroup } from '@infinityfx/lively/layout';

const styles = createStyles('ticker', {
    '.ticker': {
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
        lineHeight: 1.2,
        width: '100%'
    },

    '.column > :not(:last-child) > *': {
        position: 'absolute'
    }
});

export type TickerSelectors = Selectors<'text' | 'column'>;

/**
 * Animated text display.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/ticker}
 */
export default function Ticker({ children, cc = {}, align = 'right', selective, duration = .7, stagger = .1, ...props }: {
    children: number | string | (number | string)[];
    ref?: React.Ref<HTMLDivElement>;
    cc?: TickerSelectors;
    align?: 'left' | 'right';
    selective?: boolean;
    duration?: number;
    stagger?: number;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
    const style = combineClasses(styles, cc);

    const trigger = useTrigger();
    const prev = useRef(children.toString());
    const mutable = useRef<(string | null)[][]>(children.toString().split('').map(char => [char]));
    const prevLastRow = useRef<(string | null)[]>([]);
    const [state, setState] = useState(mutable.current);

    function trim() {
        // trim character arrays to remove characters that are out of view
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
        if (prev.current === children.toString()) return; // if content hasn't changed return
        prev.current = children.toString();

        const chars = prev.current.split(''),
            updated = mutable.current,
            diff = updated.length - chars.length;

        prevLastRow.current = updated.map(col => col[col.length - 1]);

        // match length between previous and current content by filling from left or right with null values
        if (diff > 0) chars[align === 'right' ? 'unshift' : 'push'](...new Array(diff).fill(null));

        // loop over new content character by character
        for (let i = chars.length - 1; i >= 0; i--) {
            if (i < updated.length) {
                // if character index already exists in previous content, append to array
                updated[i].push(chars[i]);
            } else {
                // else add a new array at the left or right
                updated[align === 'right' ? 'unshift' : 'push']([chars[i]]);
            }
        }

        // after animation ends remove previous characters that are out of view
        setTimeout(trim, (duration + (updated.length - 1) * stagger) * 1000);
        setState(updated.slice());
        trigger();
    }, [children]);

    return <div {...props} className={classes(style.ticker, props.className)}>
        <LayoutGroup transition={{ duration }}>
            {state.map((column, i) => {
                return <Animatable
                    key={i}
                    id={i.toString()}
                    adaptive
                    deform={false}
                    cachable={['x', 'sx']}
                    initial={{ translate: '0em 0em' }}
                    animate={{
                        translate: ['0em 1.2em', '0em 0em'],
                        composite: 'combine',
                        duration,
                        delay: i * stagger
                    }}
                    triggers={[{
                        on: trigger,
                        name: !selective || prevLastRow.current[i] !== column[column.length - 1] ? 'animate' : 'undefined',
                        commit: false
                    }]}>

                    <div className={style.column}>
                        {column.map((char, i) => <div key={i}>
                            <div>
                                {char || ' '}
                            </div>
                        </div>)}
                    </div>
                </Animatable>
            })}
        </LayoutGroup>
    </div>;
}