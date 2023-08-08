'use client';

import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { forwardRef, useState } from "react";
import Button from "../input/button";
import { MdArrowBack, MdArrowForward, MdFirstPage, MdLastPage } from "react-icons/md";
import { classes } from "@/src/core/utils";

export type PaginationStyles = FluidStyles<'.pagination' | '.button'>;

const Pagination = forwardRef(({ styles = {}, page, setPage, pages, compact, skipable, round, variant, ...props }:
    {
        styles?: PaginationStyles;
        page?: number;
        setPage?: (page: number) => void;
        pages: number;
        compact?: boolean;
        skipable?: boolean;
        round?: boolean;
        variant?: 'default' | 'neutral' | 'light';
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.pagination': {
            display: 'flex',
            gap: 'var(--f-spacing-sml)'
        },

        '.pagination > *': {
            minWidth: '2.4em',
            minHeight: '2.4em'
        }
    });

    const buttonStyles = { '.button': styles[".button"] };
    const [state, setState] = page !== undefined ? [page] : useState(0);

    function update(page: number) {
        setState?.(page);
        setPage?.(page);
    }

    return <div ref={ref} {...props} className={classes(style.pagination, props.className)}>
        {compact && skipable && <Button styles={buttonStyles} round={round} variant={variant === 'neutral' ? variant : 'minimal'} disabled={state < 1} onClick={() => update(0)}>
            <MdFirstPage />
        </Button>}

        <Button styles={buttonStyles} round={round} variant={variant} disabled={state < 1} onClick={() => update(state - 1)}>
            <MdArrowBack />
        </Button>

        {!compact && <>
            {[0, state, pages - 1].map((idx, i) => {
                if (i === 1 && pages >= 3 && [0, pages - 1].includes(state)) idx += state === 0 ? 1 : -1;
                if (i !== 1 && state === idx && pages < 3) return null;
                if (idx < 0 || idx >= pages) return null;

                return <Button key={i} styles={buttonStyles} round={round} variant={idx === state ? variant : 'minimal'} onClick={() => update(idx)} aria-current={idx === state ? 'page' : undefined}>{idx + 1}</Button>;
            })}
        </>}

        <Button styles={buttonStyles} round={round} variant={variant} disabled={state >= pages - 1} onClick={() => update(state + 1)}>
            <MdArrowForward />
        </Button>

        {compact && skipable && <Button styles={buttonStyles} round={round} variant={variant === 'neutral' ? variant : 'minimal'} disabled={state >= pages - 1} onClick={() => update(pages - 1)}>
            <MdLastPage />
        </Button>}
    </div>;
});

Pagination.displayName = 'Pagination';

export default Pagination;