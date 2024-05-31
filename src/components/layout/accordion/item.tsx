'use client';

import { useEffect, useId, useRef } from "react";
import Halo from "../../feedback/halo";
import Collapsible from "../collapsible";
import { Animatable } from "@infinityfx/lively";
import { Selectors } from "../../../../src/types";
import { useAccordion } from "./root";
import { classes } from "../../../../src/utils";
import { createStyles } from "../../../core/style";
import { combineClasses } from "../../../core/utils";
import { Icon } from "../../../core/icons";

const styles = createStyles('accordion.item', {
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
        overflow: 'hidden',
        flexShrink: 0
    },

    '.arrows': {
        display: 'flex',
        flexDirection: 'column'
    }
});

export type AccordionItemSelectors = Selectors<'button' | 'content' | 'icon' | 'arrows'>;

export default function Item({ children, cc = {}, label, defaultOpen = false, disabled, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: AccordionItemSelectors;
        label: React.ReactNode;
        defaultOpen?: boolean;
        disabled?: boolean;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    const id = useId();
    const { open, toggle } = useAccordion();
    const mounted = useRef(false);
    const isOpen = mounted.current ? open.indexOf(id) >= 0 : defaultOpen;

    useEffect(() => {
        if (defaultOpen) toggle(id, true);
        mounted.current = true;
    }, []);

    return <>
        <Halo disabled={disabled} color="var(--f-clr-primary-400)">
            <button disabled={disabled} className={style.button} type="button" aria-expanded={isOpen} aria-controls={id} onClick={() => toggle(id, !isOpen)}>
                {label}

                <div className={style.icon}>
                    <Animatable animate={{ translate: ['0% 0%', '0% -50%'], duration: .35 }} triggers={[{ on: isOpen }, { on: !isOpen, reverse: true }]}>
                        <div className={style.arrows}>
                            <Icon type="expandDown" />
                            <Icon type="collapseUp" />
                        </div>
                    </Animatable>
                </div>
            </button>
        </Halo>

        <Collapsible shown={isOpen} id={id}>
            <div {...props} className={classes(style.content, props.className)}>
                {children}
            </div>
        </Collapsible>
    </>
}

Item.displayName = 'Accordion.Item';