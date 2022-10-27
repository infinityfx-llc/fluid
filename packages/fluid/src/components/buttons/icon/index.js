import React from 'react';
import { combine } from '@core/utils/css';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { is, mergeFallback } from '@core/utils/helper';
import { Focus } from '@components/feedback';

export default function IconButton({ children, styles, size, round, disabled, onClick, className, ...props }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));

    return <button
        {...props}
        className={combine(
            style.button,
            style[size],
            disabled ? style.disabled : null,
            round ? style.round : null,
            className
        )}
        onClick={e => {
            if (!disabled && is.function(onClick)) onClick(e);
        }}>
        <Focus size="fil" className={style.icon}>
            {children}
        </Focus>
    </button>;
}

IconButton.defaultProps = {
    styles: {},
    size: 'med',
    round: false,
    disabled: false
};