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
        height: '1.25em',
        overflow: 'hidden'
    },

    '.column': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },

    '.column > *': {
        height: '1.25em',
        lineHeight: 1.2,
        width: '100%',
        whiteSpace: 'pre'
    }
});

export type TickerSelectors = Selectors<'text' | 'column'>;

/**
 * Animated text display.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/ticker}
 */
export default function Ticker({ children, cc = {}, align = 'left', selective, duration = .7, stagger = .1, ...props }: {
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
    const mutable = useRef<{
        char: string | null;
        active: 0 | 1;
    }[][]>(children.toString().split('').map(char => [{
        char,
        active: 1
    }]));
    const prevLastRow = useRef<(string | null)[]>([]);
    const [state, setState] = useState(mutable.current);

    function trim() {
        // trim character arrays to remove characters that are out of view
        const trimmed = [];

        for (let i = 0; i < mutable.current.length; i++) {
            let chars = mutable.current[i];
            chars = chars.slice(chars.length > 2 ? 1 : 0);

            if (chars[chars.length - 1].char !== null || chars.length > 2) trimmed.push(chars);
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

        prevLastRow.current = updated.map(col => col[col.length - 1].char);

        // match length between previous and current content by filling from left or right with null values
        if (diff > 0) chars[align === 'right' ? 'unshift' : 'push'](...new Array(diff).fill(null));

        // loop over new content character by character
        for (let i = chars.length - 1; i >= 0; i--) {
            const columnIndex = align == 'right' ? i + Math.min(diff, 0) : i;

            if (Array.isArray(updated[columnIndex])) {
                // if character index already exists in previous content, append to array
                updated[columnIndex].push({
                    char: chars[i],
                    active: 1
                });
            } else {
                // else add a new array at the left or right
                const newColumn = [{
                    char: chars[i],
                    active: 1 as const
                }];

                align === 'right' ?
                    updated.unshift(newColumn) :
                    updated[columnIndex] = newColumn;
            }

            setTimeout(() => {
                // set offscreen characters to "inactive", so they don't take up width
                const col = mutable.current[i];
                if (col?.length > 1) col[col.length - 2].active = 0;

                setState(mutable.current.slice());
            }, i * stagger * 1000);
        }

        // after animation ends remove previous characters that are out of view
        setTimeout(trim, (duration + (updated.length - 1) * stagger) * 1000);
        trigger();
    }, [children]);

    return <div {...props} className={classes(style.ticker, props.className)}>
        <LayoutGroup
            initialMount={false}
            transition={{ duration }}>
            {state.map((column, i) => {
                const key = (align === 'right' ? state.length - 1 - i : i).toString();

                return <Animatable
                    key={key}
                    id={key}
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
                    triggers={[
                        {
                            on: trigger,
                            name: !selective || prevLastRow.current[i] !== column[column.length - 1].char ? 'animate' : '_',
                            commit: false
                        },
                        {
                            on: 'mount',
                            commit: false
                        }
                    ]}>

                    <div className={style.column}>
                        {column.map(({ char, active }, j) => <div key={j}>
                            <div style={{
                                position: active ? undefined : 'absolute'
                            }}>
                                {char || ' '}
                            </div>
                        </div>)}
                    </div>
                </Animatable>
            })}
        </LayoutGroup>
    </div>;
}