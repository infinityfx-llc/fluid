import { useState, forwardRef } from 'react';
import Field, { FieldProps } from "./field";
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { FluidInputvalue } from '@/src/types';
import Toggle from './toggle';

const PasswordField = forwardRef(({ children, styles = {}, ...props }: FieldProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const [value, setValue] = props.value !== undefined ? [props.value] : useState<FluidInputvalue>(children || '');
    const [visible, setVisible] = useState(false);

    return <Field ref={ref} {...props} type={visible ? 'text' : 'password'} value={value} onChange={e => {
        setValue?.(e.target.value);
        props.onChange?.(e);
    }}
        right={<Toggle round={props.round} variant="minimal" disabled={props.disabled} alternate={<MdVisibilityOff />} checked={visible} onChange={e => setVisible(e.target.checked)} styles={{
            '.toggle': {
                marginRight: '.3em'
            }
        }}>
            <MdVisibility />
        </Toggle>} />;
});

PasswordField.displayName = 'PasswordField';

export default PasswordField;