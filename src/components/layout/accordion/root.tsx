'use client';

import { useStyles } from "@/src/hooks";
import { FluidStyles } from "@/src/types";
import { classes } from "@/src/utils";
import { createContext, forwardRef, useContext, useState, Children, Fragment } from "react";

export const AccordionContext = createContext<{
    open: string[];
    setOpen: (value: string[]) => void;
    multiple: boolean;
} | null>(null);

export function useAccordion() {
    const context = useContext(AccordionContext);

    if (!context) throw new Error('Unable to access AccordionRoot context');

    return context;
}

const Root = forwardRef(({ children, styles = {}, multiple = false, variant = 'default', ...props }:
    {
        styles?: FluidStyles;
        multiple?: boolean;
        variant?: 'default' | 'minimal';
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.accordion': {
            display: 'flex',
            flexDirection: 'column'
        },

        '.accordion[data-variant="default"]': {
            backgroundColor: 'var(--f-clr-fg-100)',
            borderRadius: 'var(--f-radius-sml)',
            padding: '.4em'
        },

        '.divider': {
            height: '1px',
            backgroundColor: 'var(--f-clr-fg-200)'
        }
    });

    const [open, setOpen] = useState<string[]>([]);
    const arr = Children.toArray(children);

    return <div ref={ref} {...props} className={classes(style.accordion, props.className)} data-variant={variant}>
        <AccordionContext.Provider value={{ open, setOpen, multiple }}>
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