'use client';

import { Selectors } from "../../../../src/types";
import { classes } from "../../../../src/utils";
import { createContext, forwardRef, useContext, useState, useRef, Children, Fragment } from "react";
import { createStyles } from "../../../core/style";
import { combineClasses } from "../../../core/utils";

export const AccordionContext = createContext<{
    open: string[];
    toggle: (id: string, open: boolean) => void;
} | null>(null);

export function useAccordion() {
    const context = useContext(AccordionContext);

    if (!context) throw new Error('Unable to access AccordionRoot context');

    return context;
}

const styles = createStyles('accordion.root', {
    '.accordion': {
        display: 'flex',
        flexDirection: 'column'
    },

    '.v__default': {
        backgroundColor: 'var(--f-clr-fg-100)',
        borderRadius: 'var(--f-radius-sml)',
        padding: '.4em'
    },

    '.divider': {
        height: '1px',
        backgroundColor: 'var(--f-clr-fg-200)'
    }
});

export type AccordionRootSelectors = Selectors<'accordion' | 'v__default' | 'v__minimal' | 'divider'>;

const Root = forwardRef(({ children, cc = {}, multiple = false, variant = 'default', ...props }:
    {
        cc?: AccordionRootSelectors;
        multiple?: boolean;
        variant?: 'default' | 'minimal';
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
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

    return <div ref={ref} {...props}
        className={classes(
            style.accordion,
            style[`v__${variant}`],
            props.className
        )}>
        <AccordionContext.Provider value={{ open, toggle }}>
            {arr.map((child, i) => {

                return <Fragment key={i}>
                    {child}

                    {i < arr.length - 1 && <div className={style.divider} />}
                </Fragment>
            })}
        </AccordionContext.Provider>
    </div>;
});

Root.displayName = 'Accordion.Root';

export default Root;