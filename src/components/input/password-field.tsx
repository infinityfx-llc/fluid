'use client';

import { useState, useMemo } from 'react';
import Field, { FieldProps } from "./field";
import { FluidInputvalue } from '../../../src/types';
import Toggle from './toggle';
import ProgressBar from '../feedback/progress-bar';
import useInputProps from '../../../src/hooks/use-input-props';
import { classes, combineClasses } from '../../../src/core/utils';
import { createStyles } from '../../core/style';
import { Icon } from '../../core/icons';

const colors = ['#eb2a1c', '#eb2a1c', '#e8831e', '#f0d030', '#fff952', '#5aff54'];

const styles = createStyles('password-field', {
    '.wrapper': {
        minWidth: 'min(var(--width, 100vw), 12em)'
    },

    '.field': {
        ['--width' as any]: '100%'
    },

    '.wrapper .track': {
        width: '100%',
        marginTop: 'var(--f-spacing-xsm)'
    },

    '.field .toggle': {
        marginRight: '.3em'
    }
});

// optimize prop splitting
export default function PasswordField({ cc = {}, strengthBar = false, size = 'med', round, error, icon, left, right, defaultValue, onEnter, inputRef, ref, ...props }: {
    strengthBar?: boolean;
} & Omit<FieldProps, 'type'>) {
    const style = combineClasses(styles, cc);

    const [value, setValue] = props.value !== undefined ? [props.value] : useState<FluidInputvalue>(defaultValue || '');
    const [visible, setVisible] = useState(false);

    const strength = useMemo(() => {
        let strength = 0;

        for (const regx of [/[a-z]/, /[A-Z]/, /\d/, /\W|_/, new RegExp(`.{${props.minLength || 10},}`)]) {
            if (regx.test(value?.toString() || '')) strength++;
        }

        return strength;
    }, [value, props.minLength]);

    const [split, rest] = useInputProps(props);

    return <div ref={ref} {...rest} className={classes(style.wrapper, props.className)}>
        <Field
            {...split}
            inputRef={inputRef}
            type={visible ? 'text' : 'password'}
            round={round}
            size={size}
            error={error}
            icon={icon}
            left={left}
            value={value}
            onEnter={onEnter}
            cc={{
                field: style.field,
                ...cc
            }}
            onChange={e => {
                setValue?.(e.target.value);
                props.onChange?.(e);
            }}
            right={<Toggle
                compact
                aria-label="Toggle visibility"
                round={round}
                size={size}
                variant="minimal"
                disabled={props.disabled}
                checkedContent={<Icon type="hide" />}
                checked={visible}
                onChange={e => setVisible(e.target.checked)}
                cc={{
                    toggle: style.toggle
                }}>
                <Icon type="show" />
            </Toggle>} />

        {strengthBar && <ProgressBar size="sml" value={strength / 5} color={colors[strength]} cc={{ track: style.track }} aria-label="Password strength" />}
    </div>;
}