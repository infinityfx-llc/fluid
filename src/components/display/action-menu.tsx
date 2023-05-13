import { combineRefs } from '@/src/core/utils';
import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { Animate } from '@infinityfx/lively';
import { Move, Pop } from '@infinityfx/lively/animations';
import { LayoutGroup } from '@infinityfx/lively/layout';
import { forwardRef, cloneElement, useState, useRef, useEffect } from 'react';
import { Halo } from '../feedback';
import useClickOutside from '@/src/hooks/use-click-outside';

const ActionMenu = forwardRef(({ children, styles = {}, options }: {
    children: React.ReactElement;
    styles?: FluidStyles;
    options: ({
        label: React.ReactNode;
        onClick?: () => void;
        disabled?: boolean;
        shouldClose?: boolean;
    } | string)[];
}, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.menu': {
            position: 'fixed',
            padding: '.3em',
            background: 'var(--f-clr-bg-100)',
            border: 'solid 1px var(--f-clr-grey-100)',
            borderRadius: 'var(--f-radius-sml)',
            boxShadow: '0 0 8px rgb(0, 0, 0, 0.06)',
            fontSize: 'var(--f-font-size-sml)',
            width: 'clamp(0px, 10em, 100vw)',
            zIndex: 999
        },

        '.option': {
            position: 'relative',
            padding: '.5rem .8rem',
            border: 'none',
            background: 'none',
            outline: 'none',
            width: '100%',
            borderRadius: 'var(--f-radius-sml)',
            userSelect: 'none',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-xsm)',
            color: 'var(--f-clr-text-100)'
        },

        '.option:enabled': {
            cursor: 'pointer'
        },

        '.option:disabled': {
            color: 'var(--f-clr-grey-500)'
        },

        '.title': {
            padding: '.5rem .8rem',
            fontWeight: 700,
            fontSize: '.8em',
            color: 'var(--f-clr-grey-600)'
        },

        '.title:not(:first-child)': {
            borderTop: 'solid 1px var(--f-clr-grey-100)',
            marginTop: '.5em'
        }
    });

    const element = useRef<HTMLElement | null>(null);
    const [state, setState] = useState<{ left: string; top?: string; bottom?: string; } | null>(null);

    function toggle(value: boolean) {
        if (value && element.current) {
            const { x, y, width, height } = element.current.getBoundingClientRect();
            const bottom = window.innerHeight - height - y;

            if (y > bottom) {
                return setState({
                    left: x + 'px',
                    bottom: `calc(${bottom + height}px + var(--f-spacing-xsm))`
                });
            } else {
                return setState({
                    left: x + 'px',
                    top: `calc(${y + height}px + var(--f-spacing-xsm))`
                });
            }
        } else setState(null);
    }

    useEffect(() => {
        const resize = () => toggle(!!state);
        window.addEventListener('resize', resize);

        return () => window.removeEventListener('resize', resize);
    }, [state]);

    const menu = useClickOutside(() => {
        if (state) setState(null);
    }, [state]);

    return <>
        {cloneElement(children, {
            ref: combineRefs(element, (children as any).ref),
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                children.props.onClick?.(e);
                toggle(!state);
            }
        })}

        <LayoutGroup>
            {state && <Animate animations={[Move.unique({ duration: .2 }), Pop.unique({ duration: .2 })]} unmount triggers={[{ on: 'mount' }]} levels={2} stagger={.06}>
                <div ref={combineRefs(menu, ref)} role="menu" className={style.menu} style={state}>
                    {options.map((option, i) => {
                        if (typeof option === 'string') return <div key={i} className={style.title}>{option}</div>;

                        const { label, onClick, disabled = false, shouldClose = true } = option;
                        return <div key={i}>
                            <Halo disabled={disabled}>
                                <button role="menuitem" className={style.option} disabled={disabled} onClick={() => {
                                    if (shouldClose) setState(null);
                                    onClick?.();
                                }}>
                                    {label}
                                </button>
                            </Halo>
                        </div>;
                    })}
                </div>
            </Animate>}
        </LayoutGroup>
    </>;
});

ActionMenu.displayName = 'ActionMenu';

export default ActionMenu;