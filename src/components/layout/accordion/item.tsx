'use client';

import { forwardRef, useEffect, useId, useRef } from "react";
import { Halo } from "../../feedback";
import Collapsible from "../collapsible";
import { Animatable } from "@infinityfx/lively";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import { useStyles } from "@/src/hooks";
import { FluidStyles } from "@/src/types";
import { useAccordion } from "./root";
import { classes } from "@/src/utils";

const Item = forwardRef(({ children, styles = {}, label, defaultOpen = false, disabled, ...props }:
    {
        styles?: FluidStyles;
        label: React.ReactNode;
        defaultOpen?: boolean;
        disabled?: boolean;
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
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

        '.icon': {
            height: '1em',
            overflow: 'hidden'
        },

        '.arrows': {
            display: 'flex',
            flexDirection: 'column'
        }
    });

    const mounted = useRef(false);
    const id = useId();
    const { open, setOpen, multiple } = useAccordion();
    const idx = open.indexOf(id);
    const isOpen = mounted.current ? idx >= 0 : defaultOpen;

    useEffect(() => {
        if (defaultOpen) toggle(true); // doesnt work for multiple (cause multiple state updates same tick)
        mounted.current = true;
    }, []);

    function toggle(value: boolean) {
        if (!multiple) return setOpen(value ? [id] : []);

        const arr = open.slice();
        value ? arr.push(id) : (idx >= 0 && arr.splice(idx, 1));

        setOpen(arr);
    }

    return <>
        <Halo disabled={disabled}>
            <button disabled={disabled} className={style.button} type="button" aria-expanded={isOpen} aria-controls={id} onClick={() => toggle(!isOpen)}>
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
            <div ref={ref} {...props} className={classes(style.content, props.className)}>
                {children}
            </div>
        </Collapsible>
    </>
});

Item.displayName = 'Accordion.Item';

export default Item;