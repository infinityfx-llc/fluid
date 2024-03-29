'use client';

import { forwardRef } from 'react';
import { useStyles } from '@/src/hooks';
import Halo from '../../feedback/halo';
import { FluidInputvalue } from '@/src/types';

const Option = forwardRef(<T extends FluidInputvalue>({ children, value, onSelect, ...props }:
    {
        value: T;
        onSelect?: (value: T) => void;
    } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'>, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const style = useStyles({
        '.option': {
            position: 'relative',
            padding: '.5em',
            borderRadius: 'var(--f-radius-sml)',
            border: 'none',
            outline: 'none',
            background: 'none',
            width: '100%',
            color: 'var(--f-clr-text-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },

        '.option:enabled': {
            cursor: 'pointer'
        },

        '.option:disabled': {
            color: 'var(--f-clr-grey-500)'
        }
    });

    return <Halo disabled={props.disabled}>
        <button ref={ref} {...props} type="button" role="option" className={style.option} onClick={e => {
            props.onClick?.(e);

            onSelect?.(value);
        }}>
            {children}
        </button>
    </Halo>;
});

Option.displayName = 'Combobox.Option';

export default Option;