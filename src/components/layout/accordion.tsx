'use client';

import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { Fragment, forwardRef, useState, useId } from "react";
import { Halo } from "../feedback";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import Collapsible from "./collapsible";
import { Animatable } from "@infinityfx/lively";
import { classes } from "@/src/core/utils";

const Accordion = forwardRef(({ styles = {}, items, multiple, variant = 'default', ...props }:
    {
        styles?: FluidStyles;
        items: {
            label: React.ReactNode;
            content: React.ReactNode;
            disabled?: boolean;
        }[];
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

        '.button': {
            position: 'relative',
            borderRadius: 'var(--f-radius-sml)',
            padding: '.6em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--f-spacing-sml)',
            outline: 'none',
            border: 'none',
            background: 'none',
            color: 'var(--f-clr-text-100)'
        },

        '.button:enabled': {
            cursor: 'pointer'
        },

        '.button:disabled': {
            color: 'var(--f-clr-grey-500)'
        },

        '.content': {
            padding: '.6em',
            color: 'var(--f-clr-text-100)'
        },

        '.divider': {
            height: '1px',
            backgroundColor: 'var(--f-clr-grey-100)'
        },

        '.icon': {
            height: '1em',
            overflow: 'hidden'
        },

        '.arrows': {
            display: 'flex',
            flexDirection: 'column'
        }
    });

    const [open, setOpen] = useState<number[]>([]);
    const id = useId();

    return <div ref={ref} {...props} className={classes(style.accordion, props.className)} data-variant={variant}>
        {items.map(({ label, content, disabled }, i) => {
            const isOpen = open[multiple ? i : 0] === i;

            return <Fragment key={i}>
                <Halo disabled={disabled}>
                    <button disabled={disabled} className={style.button} type="button" aria-expanded={isOpen} aria-controls={id} onClick={() => {
                        const arr = open.slice();
                        arr[multiple ? i : 0] = arr[multiple ? i : 0] === i ? -1 : i;

                        setOpen(arr);
                    }}>
                        {label}

                        <div className={style.icon}>
                            <Animatable animate={{ translate: ['0% 0%', '0% -50%'], duration: .35 }} triggers={[{ on: isOpen }, { on: !isOpen, reverse: true }]}>
                                <div className={style.arrows}>
                                    <MdArrowDownward />
                                    <MdArrowUpward />
                                </div>
                            </Animatable>
                        </div>
                    </button>
                </Halo>

                <Collapsible shown={isOpen} id={id}>
                    <div className={style.content}>
                        {content}
                    </div>
                </Collapsible>

                {i < items.length - 1 && <div className={style.divider} />}
            </Fragment>;
        })}
    </div>;
});

Accordion.displayName = 'Accordion';

export default Accordion;