'use client';

import { Animate } from '@infinityfx/lively';
import { useState, useRef, useId } from 'react';
import { classes, combineClasses, getFocusable } from '../../../../src/core/utils';
import { Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import Item from './item';
import { Icon } from '../../../core/icons';
import { useMenuManager } from '../../../context/menu-manager';

const styles = createStyles('action-menu-group', {
    '.wrapper': {
        position: 'relative'
    },

    '.menu': {
        position: 'absolute',
        padding: '.25em',
        borderRadius: 'calc(.25em + var(--f-radius-sml))',
        fontSize: 'var(--f-font-size-sml)',
        minWidth: 'min(100vw, 10em)',
        top: 'calc(-1px - .25em)'
    },

    '.v__inverted': {
        background: 'var(--f-clr-grey-900)',
        border: 'solid 1px var(--f-clr-grey-800)'
    },

    '.icon': {
        display: 'flex',
        marginLeft: 'auto'
    }
});

export type ActionMenuGroupSelectors = Selectors<'wrapper' | 'menu' | 'v__default' | 'v__inverted' | 'icon'>;

export default function Group({ children, cc = {}, label, className, ...props }:
    {
        ref?: React.Ref<HTMLButtonElement>;
        cc?: ActionMenuGroupSelectors;
        label: React.ReactNode;
    } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const style = combineClasses(styles, cc);

    const id = useId();
    const { variant } = useMenuManager();
    const element = useRef<HTMLDivElement>(null);
    const content = useRef<HTMLDivElement>(null);
    const [state, setState] = useState({ open: false, side: 'left' });

    function openMenu() {
        if (props.disabled || !element.current) return;

        let { left, right } = element.current.getBoundingClientRect();
        right = window.innerWidth - right;

        setState({
            open: true,
            side: left > right ? 'right' : 'left'
        });
    }

    return <div
        ref={element}
        className={style.wrapper}
        onFocus={openMenu}
        onMouseEnter={openMenu}
        onMouseLeave={() => setState({ ...state, open: false })}
        onBlur={() => {
            if (!element.current?.matches(':focus-within')) setState({ ...state, open: false });
        }}>
        <Item
            {...props}
            aria-haspopup="menu"
            aria-expanded={state.open}
            aria-controls={id}
            keepOpen
            onTouchEnd={e => {
                props.onTouchEnd?.(e);

                state.open ?
                    setState({ ...state, open: false }) :
                    openMenu();
            }}
            onKeyDown={e => {
                props.onKeyDown?.(e);

                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    const child = getFocusable(content.current, false);

                    if (child) {
                        e.preventDefault();
                        child.focus();
                    }
                }
            }}>
            {label}

            <div className={style.icon}>
                <Icon type="right" />
            </div>
        </Item>

        <Animate
            correction="none"
            initial={{
                opacity: 0
            }}
            animate={{
                visibility: ['hidden', 'visible'],
                opacity: [0, .2, 1],
                scale: [0.9, 1],
                duration: .175
            }}
            triggers={{
                animate: [{ on: state.open, override: true }, { on: !state.open, cascade: 'reverse', reverse: true, override: true }]
            }}>
            <div
                ref={content}
                id={id}
                role="menu"
                className={classes(
                    variant === 'default' && 'card',
                    variant === 'default' && 'front',
                    'sd-med',
                    style.menu,
                    style[`v__${variant}`]
                )}
                style={{ [state.side]: '100%' }}>
                <Animate
                    inherit
                    animate={{
                        opacity: [0, 1],
                        scale: [0.95, 1],
                        duration: .175
                    }}
                    stagger={.035}>
                    {children}
                </Animate>
            </div>
        </Animate>
    </div>;
}

Group.displayName = 'ActionMenuGroup';