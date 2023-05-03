import React from 'react';
import { combine } from '@core/utils/css';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { is, mergeFallback } from '@core/utils/helper';
import { Focus } from '@components/feedback';

export default function IconButton({ children, styles, size, round, disabled, onClick, className, ...props }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));

    return <Focus element="button" size="fil"
        {...props}
        className={combine(
            style.button,
            style[size],
            className
        )}
        data-disabled={disabled}
        data-round={round}
        onClick={e => {
            if (!disabled && is.function(onClick)) onClick(e);
        }}>
        {children}
    </Focus>;
}

IconButton.defaultProps = {
    styles: {},
    size: 'med',
    round: false,
    disabled: false
};