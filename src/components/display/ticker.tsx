'use client';

import { classes, combineClasses } from '../../../src/core/utils';
import { Selectors } from '../../../src/types';
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createStyles } from '../../core/style';
import { Animate, LayoutGroup } from '@infinityfx/lively';
import { Animator } from '@infinityfx/lively';

const toChars = (str: string | number) => str.toString().split('');

const deepCopy = (array: string[][]) => array.slice().map(value => value.slice());

function isEqual(data: string[][], value: string) {
    if (data.length !== value.length) return false;

    for (let i = 0; i < data.length; i++) {
        if (data[i][0] !== value[i]) return false;
    }

    return true;
}

const styles = createStyles('ticker', {
    '.ticker': {
        boxSizing: 'content-box',
        height: 'calc(1em * var(--line-height))',
        overflow: 'hidden'
    },

    '.fade': {
        paddingBlock: '.2em',
        maskImage: 'linear-gradient(transparent, white .25em, white calc(1em * var(--line-height) + .25em), transparent)'
    },

    '.row': {
        display: 'flex',
        alignItems: 'start',
        height: 'calc(1em * var(--line-height))'
    },

    '.column': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start'
    },

    '.column > *': {
        height: 'calc(1em * var(--line-height))',
        lineHeight: 'var(--line-height)',
        width: '100%',
        whiteSpace: 'pre'
    },

    '.column > :not(:first-child)': {
        width: '0px'
    }
});

export type TickerSelectors = Selectors<'ticker' | 'fade' | 'row' | 'column'>;

/**
 * Animated text/number display.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/ticker}
 */
export default function Ticker({ cc = {}, value, lineHeight = 1.1, selective, interpolateNumbers, fadeEdges = true, duration = .4, stagger = .05, ...props }: {
    ref?: React.Ref<HTMLDivElement>;
    cc?: TickerSelectors;
    value: number | string;
    /**
     * @default 1.1 // todo: change default based on fadeEdges?
     */
    lineHeight?: number;
    /**
     * Only animate characters that have changed since last render.
     * 
     * @default false
     */
    selective?: boolean;
    /**
     * Add intermediate values when animating between different numbers.
     * 
     * @default false
     */
    interpolateNumbers?: boolean;
    /**
     * @default true
     */
    fadeEdges?: boolean;
    /**
     * Animation duration in seconds.
     * 
     * @default .4
     */
    duration?: number;
    /**
     * Animation staggering in seconds.
     * 
     * @default .05
     */
    stagger?: number;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
    const style = combineClasses(styles, cc);

    const timeouts = useRef<any[]>([]);
    const cullTimeout = useRef<any>(0);
    const animator = useRef<Animator<'scroll' | 'animate'>>(null);
    const data = useRef(toChars(value).map(char => [char]));
    const [columns, setColumns] = useState(deepCopy(data.current));
    const pendingAnimation = useRef<{
        tag: string;
        changed: boolean[];
    } | null>(null);

    const cull = useCallback((count: number) => {
        cullTimeout.current = 0;

        for (let i = data.current.length - 1; i >= 0; i--) {
            const column = data.current[i];
            const index = Math.min(column.length - 1, count);

            if (index > 0) column.splice(-index, index);

            if (column.every(val => !val)) data.current.splice(i, 1);
        }

        setColumns(deepCopy(data.current));
    }, []);

    const update = useCallback((value: string[]) => {
        const delta = value.length - data.current.length;

        if (delta > 0) data.current.push(...new Array(delta).fill(0).map(() => ['']));

        let changed = new Array(data.current.length),
            rows = 0;
        for (let i = 0; i < data.current.length; i++) {
            const column = data.current[i];
            changed[i] = !selective || value[i] !== column[0];

            if (changed[i]) column.unshift(value[i] ?? '');
            rows = Math.max(rows, column.length);
        }

        const tag = Date.now().toString();
        pendingAnimation.current = { tag, changed };

        setColumns(deepCopy(data.current));

        if (!cullTimeout.current) {
            cullTimeout.current = setTimeout(() => cull(rows - 1), (duration + stagger * data.current.length) * 1000);
        }
    }, [selective, duration, stagger, cull]);

    useLayoutEffect(() => {
        if (!pendingAnimation.current || !animator.current) return;

        const { tag, changed } = pendingAnimation.current;
        pendingAnimation.current = null;

        animator.current.play('scroll', { tag });
        animator.current.forEachTrack((track, i) => {
            if (!changed[i]) track.clear(tag);
        });
    }, [columns]);

    useEffect(() => {
        if (isEqual(data.current, value.toString())) return;

        timeouts.current.forEach(clearTimeout);
        timeouts.current = [];

        if (typeof value === 'number' && interpolateNumbers) {
            const previous = parseFloat(data.current.map(col => col[0]).join(''));
            const delta = value - previous;
            const length = value.toString().length;

            for (let i = 0; i < 4; i++) {
                const addition = delta / 4 * (i + 1);
                const chars = toChars(previous + addition);

                timeouts.current.push(
                    setTimeout(() => update(chars.slice(0, length)), i * 50) // todo: fix causes flashing..
                );
            }
        } else {
            update(toChars(value));
        }
    }, [value]);

    useEffect(() => () => {
        timeouts.current.forEach(clearTimeout);
        clearTimeout(cullTimeout.current);
        cullTimeout.current = 0;
    }, []);

    return <div
        {...props}
        style={{
            ...props.style,
            '--line-height': lineHeight
        } as any}
        className={classes(
            style.ticker,
            fadeEdges && style.fade,
            props.className
        )}>
        <LayoutGroup skipInitialMount ignoreWarnings>
            <div className={style.row}>
                <Animate
                    ref={animator}
                    correction="parent"
                    stagger={stagger}
                    clips={{
                        scroll: {
                            translate: [`0em -${lineHeight}em`, '0em 0em'],
                            composite: 'combine',
                            duration
                        }
                    }}>
                    {columns.map((column, i) => {

                        return <div key={i}>
                            <Animate
                                transition={{
                                    cache: ['width'],
                                    duration
                                }}
                                animate={{
                                    maxWidth: ['0em', '1.2em'],
                                    translate: [`0em -${lineHeight}em`, '0em 0em'],
                                    duration
                                }}
                                triggers={{
                                    animate: [{ on: 'mount', commit: false }]
                                }}>
                                <div className={style.column}>
                                    {column.map((char, j) =>
                                        <span key={j}>{char}</span>
                                    )}
                                </div>
                            </Animate>
                        </div>;
                    })}
                </Animate>
            </div>
        </LayoutGroup >
    </div >;
}