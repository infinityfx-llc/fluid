'use client';

import { FluidSize, Selectors } from "../../../src/types";
import { useState } from "react";
import Button from "../input/button";
import { classes, combineClasses } from "../../../src/core/utils";
import { createStyles } from "../../core/style";
import { Icon } from "../../core/icons";

const styles = createStyles('pagination', {
    '.pagination': {
        display: 'flex',
        gap: 'var(--f-spacing-sml)'
    },

    '.pagination > *': {
        minWidth: '2.6em', // check if correct
        minHeight: '2.6em'
    }
});

export type PaginationSelectors = Selectors<'pagination'>;

/**
 * A set of inputs used for navigation between pages.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/pagination}
 */
export default function Pagination({ cc = {}, page, setPage, pages, compact, skipable, round, size, variant, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: PaginationSelectors;
        page?: number;
        setPage?: (page: number) => void;
        pages: number;
        compact?: boolean;
        skipable?: boolean;
        round?: boolean;
        size?: FluidSize;
        variant?: 'default' | 'neutral' | 'light';
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
    const style = combineClasses(styles, cc);

    const [state, setState] = page !== undefined ? [page, setPage] : useState(0);

    const update = (page: number) => setState?.(page);
    const buttonProps = { cc, round, size, variant };

    return <div {...props} className={classes(style.pagination, props.className)}>
        {compact && skipable && <Button {...buttonProps} variant={variant === 'neutral' ? variant : 'minimal'} disabled={state < 1} onClick={() => update(0)} aria-label="1">
            <Icon type="first" />
        </Button>}

        <Button {...buttonProps} disabled={state < 1} onClick={() => update(state - 1)} aria-label={state + ''}>
            <Icon type="left" />
        </Button>

        {!compact && <>
            {[0, state, pages - 1].map((idx, i) => {
                if (i === 1 && pages >= 3 && [0, pages - 1].includes(state)) idx += state === 0 ? 1 : -1;
                if (i !== 1 && state === idx && pages < 3) return null;
                if (idx < 0 || idx >= pages) return null;

                return <Button key={i} {...buttonProps} variant={idx === state ? variant : 'minimal'} onClick={() => update(idx)} aria-current={idx === state ? 'page' : undefined}>{idx + 1}</Button>;
            })}
        </>}

        <Button {...buttonProps} disabled={state >= pages - 1} onClick={() => update(state + 1)} aria-label={state + 2 + ''}>
            <Icon type="right" />
        </Button>

        {compact && skipable && <Button {...buttonProps} variant={variant === 'neutral' ? variant : 'minimal'} disabled={state >= pages - 1} onClick={() => update(pages - 1)} aria-label={pages + ''}>
            <Icon type="last" />
        </Button>}
    </div>;
}