'use client';

import { Selectors } from "../../../../src/types";
import { classes } from "../../../../src/utils";
import { createContext, use, useState, useRef, Children, Fragment } from "react";
import { createStyles } from "../../../core/style";
import { combineClasses } from "../../../core/utils";

export const AccordionContext = createContext<{
    variant: 'default' | 'isolated' | 'minimal';
    open: string[];
    toggle: (id: string, open: boolean) => void;
} | null>(null);

export function useAccordion() {
    const context = use(AccordionContext);

    if (!context) throw new Error('Unable to access AccordionRoot context');

    return context;
}

const styles = createStyles('accordion.root', {
    '.accordion, .item': {
        display: 'flex',
        flexDirection: 'column'
    },

    '.v__default': {
        backgroundColor: 'var(--f-clr-fg-100)',
        borderRadius: 'var(--f-radius-med)',
        padding: '.4em'
    },

    '.v__default .divider': {
        marginInline: 'var(--f-radius-sml)',
        backgroundColor: 'var(--f-clr-fg-200)',
        height: '1px'
    },

    '.v__isolated .divider': {
        height: 'var(--f-spacing-xsm)'
    },

    '.item': {
        borderRadius: 'calc(var(--f-radius-sml) + .25em)',
        backgroundColor: 'var(--f-clr-fg-100)',
        padding: '.25em'
    }
});

export type AccordionRootSelectors = Selectors<'accordion' | 'v__default' | 'v__isolated' | 'v__minimal' | 'divider'>;

export default function Root({ children, cc = {}, multiple = false, variant = 'default', ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: AccordionRootSelectors;
        /**
         * Allow for multiple entries to open at once.
         * 
         * @default false
         */
        multiple?: boolean;
        variant?: 'default' | 'isolated' | 'minimal';
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    const openRef = useRef<string[]>([]);
    const [open, setOpen] = useState<string[]>([]);
    const arr = Children.toArray(children);

    function toggle(id: string, open: boolean) {
        if (!multiple) {
            openRef.current = open ? [id] : [];
        } else {

            const idx = openRef.current.indexOf(id);
            open ? (idx < 0 && openRef.current.push(id)) : (idx >= 0 && openRef.current.splice(idx, 1));
        }

        setOpen(openRef.current.slice());
    }

    return <div {...props}
        className={classes(
            style.accordion,
            style[`v__${variant}`],
            props.className
        )}>
        <AccordionContext value={{ variant, open, toggle }}>
            {arr.map((child, i) => {

                return <Fragment key={i}>
                    {variant === 'isolated' ?
                        <div className={style.item}>
                            {child}
                        </div> :
                        child}

                    {i < arr.length - 1 &&
                        <div className={style.divider} />}
                </Fragment>
            })}
        </AccordionContext>
    </div>;
}

Root.displayName = 'Accordion.Root';