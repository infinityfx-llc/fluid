'use client';

import { FluidSize, Selectors } from "../../../src/types";
import { Fragment, useId, useRef, useState } from "react";
import { classes, combineClasses } from "../../../src/core/utils";
import { createStyles } from "../../core/style";
import { Icon } from "../../core/icons";
import Halo from "../feedback/halo";
import { Morph } from "@infinityfx/lively/layout";
import { Animatable } from "@infinityfx/lively";
import { useTrigger } from "@infinityfx/lively/hooks";

// arrow controls

const styles = createStyles('pagination', {
    '.pagination': {
        display: 'flex',
        gap: 'var(--f-spacing-xsm)'
    },

    '.pill': {
        gap: 'var(--f-spacing-xxs)'
    },

    '.s__xsm': {
        fontSize: 'var(--f-font-size-xxs)'
    },

    '.s__sml': {
        fontSize: 'var(--f-font-size-xsm)'
    },

    '.s__med': {
        fontSize: 'var(--f-font-size-sml)'
    },

    '.s__lrg': {
        fontSize: 'var(--f-font-size-med)'
    },

    '.buttons': {
        display: 'grid',
        gap: 'inherit',
        gridAutoFlow: 'column'
    },

    '.buttons .layer': {
        width: '100%',
        height: '100%',
        borderRadius: 'var(--f-radius-sml)',
        transition: 'background-color .35s'
    },

    '.pagination:not(.v__minimal) .layer': {
        backgroundColor: 'var(--f-clr-fg-100)'
    },

    '.pagination[aria-disabled="true"] .layer': {
        backgroundColor: 'var(--f-clr-grey-100)'
    },

    '.button': {
        overflow: 'hidden',
        position: 'relative',
        border: 'none',
        outline: 'none',
        background: 'none',
        color: 'var(--f-clr-text-100)',
        width: '2.6em',
        height: '2.6em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--f-radius-sml)',
        fontWeight: 500,
        transition: 'background-color .35s, color .35s',
        WebkitTapHighlightColor: 'transparent'
    },

    '.buttons .button': {
        backgroundColor: 'transparent !important'
    },

    '.pagination:not(.v__minimal) .button:enabled': {
        backgroundColor: 'var(--f-clr-fg-100)'
    },

    '.button:enabled': {
        cursor: 'pointer'
    },

    '.button:disabled': {
        backgroundColor: 'var(--f-clr-grey-100)',
        color: 'var(--f-clr-grey-500)'
    },

    '.button[aria-current="page"]': {
        color: 'var(--f-clr-text-200)'
    },

    '.pagination .layer.selection': {
        backgroundColor: 'var(--color, var(--f-clr-primary-100))',
        boxShadow: 'var(--f-shadow-sml)'
    },

    '.v__neutral .layer.selection': {
        backgroundColor: 'var(--f-clr-text-100)'
    },

    '.pagination[aria-disabled="true"] .layer.selection': {
        backgroundColor: 'var(--f-clr-grey-200)'
    },

    '.round .button': {
        borderRadius: '99px'
    },

    '.round .layer': {
        borderRadius: '99px'
    },

    '.pill > .button:first-child': {
        borderTopLeftRadius: '1.3em',
        borderBottomLeftRadius: '1.3em'
    },

    '.pill > .button:last-child': {
        borderTopRightRadius: '1.3em',
        borderBottomRightRadius: '1.3em'
    },

    '.indices': {
        width: '7.8em',
        height: '2.6em',
        display: 'flex'
    },

    '.indices > *': {
        width: '2.6em',
        height: '2.6em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export type PaginationSelectors = Selectors<'pagination' | 'pill' | 'square' | 'round' | 's__xsm'  | 's__sml' | 's__med' | 's__lrg' | 'v__default' | 'v__neutral' | 'v__minimal' | 'buttons' | 'layer' | 'button' | 'selection' | 'indices'>;

/**
 * A set of inputs used for navigation between pages.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/pagination}
 */
export default function Pagination({ cc = {}, pages, defaultPage = 0, page, onChange, compact, skipable, shape = 'square', size, variant, disabled, color, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: PaginationSelectors;
        pages: number;
        defaultPage?: number;
        page?: number;
        onChange?: (page: number) => void;
        compact?: boolean;
        skipable?: boolean;
        shape?: 'square' | 'round' | 'pill';
        size?: FluidSize;
        variant?: 'default' | 'neutral' | 'minimal';
        disabled?: boolean;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'>) {
    const style = combineClasses(styles, cc);

    const id = useId();
    const trigger = useTrigger();
    const [state, setState] = page !== undefined ? [page, onChange] : useState(defaultPage);

    function getIndices() {
        const len = Math.min(pages, 3);

        return new Array(len)
            .fill(0)
            .map((_, i) => {
                if (!i) return skipable ? Math.min(Math.max(state - 1, 0), pages - 3) : 0;
                if (i < len - 1) return Math.min(Math.max(state, 1), pages - 2);

                return skipable ?
                    Math.max(Math.min(state + 1, pages - 1), 2) :
                    pages - 1;
            });
    }

    const previous = useRef(getIndices());

    const update = (page: number) => {
        previous.current = getIndices();

        setState?.(page);
        onChange?.(page);
        trigger();
    }

    const backDisabled = state < 1 || disabled;
    const forwardDisabled = state >= pages - 1 || disabled;

    return <div
        {...props}
        style={{
            ...props.style,
            '--color': color
        } as any}
        role="navigation"
        aria-disabled={disabled}
        className={classes(
            style.pagination,
            style[`s__${size}`],
            style[`v__${variant}`],
            style[shape],
            props.className
        )}>
        {skipable && <Halo disabled={backDisabled}>
            <button
                disabled={backDisabled}
                aria-label="1"
                className={style.button}
                onClick={() => update(0)}>
                <Icon type="first" />
            </button>
        </Halo>}

        <Halo disabled={backDisabled}>
            <button
                disabled={backDisabled}
                aria-label={state + ''}
                className={style.button}
                onClick={() => update(state - 1)}>
                <Icon type="left" />
            </button>
        </Halo>

        {!compact && <div className={style.buttons}>
            {getIndices().map((index, i) => {
                const previousIndex = previous.current[i],
                    gridStyle = {
                        gridColumn: i + 1,
                        gridRow: 1
                    };

                return <Fragment key={i}>
                    <div className={style.layer} style={gridStyle} />

                    {index === state && <Morph
                        group={`${id}-pagination-selection`}
                        cachable={['x']}
                        transition={{
                            duration: .35
                        }}>
                        <div className={classes(style.layer, style.selection)} style={gridStyle} />
                    </Morph>}

                    <Halo disabled={disabled}>
                        <button
                            type="button"
                            disabled={disabled}
                            className={classes(
                                style.button,
                                style.index
                            )}
                            style={gridStyle}
                            aria-current={index === state ? 'page' : undefined}
                            onClick={() => update(index)}>
                            <Animatable
                                animations={{
                                    forward: {
                                        translate: ['33.3% 0%', '0% 0%'],
                                        duration: .35
                                    },
                                    back: {
                                        translate: ['-33.3% 0%', '0% 0%'],
                                        duration: .35
                                    }
                                }}
                                triggers={[
                                    { name: 'forward', on: previousIndex - index < 0 ? trigger : false, immediate: true },
                                    { name: 'back', on: previousIndex - index > 0 ? trigger : false, immediate: true }
                                ]}>
                                <div className={style.indices}>
                                    <span>
                                        {previousIndex + 1}
                                    </span>
                                    <span>
                                        {index + 1}
                                    </span>
                                    <span>
                                        {previousIndex + 1}
                                    </span>
                                </div>
                            </Animatable>
                        </button>
                    </Halo>
                </Fragment>;
            })}
        </div>}

        <Halo disabled={forwardDisabled}>
            <button
                disabled={forwardDisabled}
                aria-label={state + 2 + ''}
                className={style.button}
                onClick={() => update(state + 1)}>
                <Icon type="right" />
            </button>
        </Halo>

        {skipable && <Halo disabled={forwardDisabled}>
            <button
                disabled={forwardDisabled}
                aria-label={pages + ''}
                className={style.button}
                onClick={() => update(pages - 1)}>
                <Icon type="last" />
            </button>
        </Halo>}
    </div>;
}