'use client';

import { Animate } from '@infinityfx/lively';
import { Pop } from '@infinityfx/lively/animations';
import { forwardRef, useState, useRef } from 'react';
import { MdChevronRight } from 'react-icons/md';
import { combineClasses } from '../../../../src/core/utils';
import { Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import Item from './item';

const styles = createStyles('action-menu.group', {
    '.wrapper': {
        position: 'relative'
    },

    '.menu': {
        position: 'absolute',
        padding: '.25em',
        background: 'var(--f-clr-fg-100)',
        border: 'solid 1px var(--f-clr-fg-200)',
        borderRadius: 'calc(.25em + var(--f-radius-sml))',
        boxShadow: 'var(--f-shadow-med)',
        fontSize: 'var(--f-font-size-sml)',
        minWidth: 'min(100vw, 10em)',
        width: '100%',
        top: 'calc(-1px - .25em)'
    },

    '.icon': {
        marginLeft: 'auto'
    }
});

export type ActionMenuGroupSelectors = Selectors<'wrapper' | 'menu' | 'icon'>;

const Group = forwardRef(({ children, cc = {}, label, className, ...props }:
    {
        cc?: ActionMenuGroupSelectors;
        label: React.ReactNode;
    } & React.ButtonHTMLAttributes<HTMLButtonElement>, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const style = combineClasses(styles, cc);

    const element = useRef<HTMLDivElement>(null);
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
        onMouseEnter={openMenu}
        onMouseLeave={() => setState({ ...state, open: false })}>
        <Item
            ref={ref}
            {...props}
            keepOpen
            onTouchEnd={e => {
                props.onTouchEnd?.(e);

                state.open ?
                    setState({ ...state, open: false }) :
                    openMenu();
            }}>
            {label}

            <MdChevronRight className={style.icon} />
        </Item>

        <Animate
            animations={[
                {
                    visibility: ['hidden', 'visible'],
                    opacity: [0, 1],
                    translate: ['0px 20px', '0px 0px'],
                    duration: .2
                },
                Pop.unique({ duration: .2 })
            ]}
            triggers={[
                { on: state.open, immediate: true },
                { on: !state.open, reverse: true, immediate: true }
            ]}
            levels={2}
            stagger={.06}>
            <div
                role="group"
                className={style.menu}
                style={{ [state.side]: '100%' }}>
                {children}
            </div>
        </Animate>
    </div>;
});

Group.displayName = 'ActionMenu.Group';

export default Group;