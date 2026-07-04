'use client';

import { Fragment, useEffect, useId, useRef } from "react";
import Collapsible from "../collapsible";
import { Animate } from "@infinityfx/lively";
import { Selectors } from "../../../../src/types";
import { useAccordion } from "./root";
import { classes } from "../../../../src/utils";
import { createStyles } from "../../../core/style";
import { combineClasses } from "../../../core/utils";
import { Icon } from "../../../core/icons";
import Interactable from "../../feedback/interactable";

const styles = createStyles('accordion.item', {
    '.item': {
        display: 'flex',
        flexDirection: 'column'
    },

    '.button': {
        position: 'relative',
        borderRadius: 'var(--f-radius-sml)',
        padding: '.6em',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-xsm)',
        color: 'var(--f-clr-text-100)'
    },

    '.v__neutral .button': {
        backgroundColor: 'var(--f-clr-fg-100)'
    },

    '.button:enabled': {
        cursor: 'pointer'
    },

    '.button:disabled': {
        color: 'var(--f-clr-grey-500)'
    },

    '.v__minimal': {
        borderRadius: 'var(--f-radius-sml)',
        transition: 'background-color .5s'
    },

    '.v__minimal:has([aria-expanded="true"])': {
        backgroundColor: 'var(--f-clr-fg-100)'
    },

    '.v__minimal:has([aria-expanded="true"]:disabled)': {
        backgroundColor: 'var(--f-clr-fg-200)'
    },

    '.content': {
        padding: '.6em',
        color: 'var(--f-clr-text-100)'
    },

    '.icon': {
        height: '1em',
        overflow: 'hidden',
        flexShrink: 0,
        marginLeft: 'auto'
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
    const { variant, open, toggle } = useAccordion();
    const mounted = useRef(false);
    const isOpen = mounted.current ? open.indexOf(id) >= 0 : defaultOpen;

    useEffect(() => {
        if (defaultOpen) toggle(id, true);
        mounted.current = true;
    }, []);

    const itemContent = <>
        <Interactable
            disabled={disabled}
            highlightColor="var(--f-clr-primary-400)"
            aria-expanded={isOpen}
            aria-controls={id}
            className={style.button}
            onClick={() => toggle(id, !isOpen)}>
            {label}

            <div className={style.icon}>
                <Animate
                    correction="none"
                    animate={{
                        translate: isOpen ? '0% -50%' : '0% 0%',
                        duration: .35
                    }}>
                    <div className={style.arrows}>
                        <Icon type="expandDown" />
                        <Icon type="collapseUp" />
                    </div>
                </Animate>
            </div>
        </Interactable>

        <Collapsible shown={isOpen} id={id}>
            <div {...props} className={classes(style.content, props.className)}>
                {children}
            </div>
        </Collapsible>
    </>;

    if (variant === 'default') return itemContent;

    return <div
        className={classes(
            style.item,
            style[`v__${variant}`]
        )}>
        {itemContent}
    </div>;
}

Item.displayName = 'Accordion.Item';