'use client';

import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { forwardRef, useState } from "react";
import Button from "../input/button";
import { MdArrowBack, MdArrowForward, MdFirstPage, MdLastPage } from "react-icons/md";
import { classes } from "@/src/core/utils";

const Pagination = forwardRef(({ styles = {}, pages, compact, skipable, round, variant, ...props }:
    {
        styles?: FluidStyles;
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

    const [state, setState] = useState(1);

    return <div ref={ref} {...props} className={classes(style.pagination, props.className)}>
        {compact && skipable && <Button round={round} variant={variant === 'neutral' ? variant : 'minimal'} disabled={state < 2} onClick={() => setState(1)}>
            <MdFirstPage />
        </Button>}

        <Button round={round} variant={variant} disabled={state < 2} onClick={() => setState(state - 1)}>
            <MdArrowBack />
        </Button>

        {!compact && <>
            {state !== 1 && <Button round={round} variant="minimal" onClick={() => setState(1)}>1</Button>}
            {state === pages && <Button round={round} variant="minimal" onClick={() => setState(pages - 1)}>{pages - 1}</Button>}
            <Button round={round} variant={variant} aria-current="page">{state}</Button>
            {state === 1 && <Button round={round} variant="minimal" onClick={() => setState(2)}>2</Button>}
            {state !== pages && <Button round={round} variant="minimal" onClick={() => setState(pages)}>{pages}</Button>}
        </>}

        <Button round={round} variant={variant} disabled={state > pages - 1} onClick={() => setState(state + 1)}>
            <MdArrowForward />
        </Button>

        {compact && skipable && <Button round={round} variant={variant === 'neutral' ? variant : 'minimal'} disabled={state > pages - 1} onClick={() => setState(pages)}>
            <MdLastPage />
        </Button>}
    </div>;
});

Pagination.displayName = 'Pagination';

export default Pagination;