import React from 'react';
import { Spinner } from '@components/feedback';
import { combine } from '@core/utils/css';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { is, mergeFallback } from '@core/utils/helper';

export default function Button({ children, styles, size, disabled, loading, onClick, className, ...props }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));

    return <button
        {...props}
        className={combine(
            style.button,
            style[size],
            loading ? style.loading : null,
            disabled ? style.disabled : null,
            className
        )}
        onClick={e => {
            if (!loading && !disabled && is.function(onClick)) onClick(e);
        }}>
        {loading && <Spinner className={style.test} />}
        {children}
    </button>;
}

Button.defaultProps = {
    styles: {},
    size: 'med',
    disabled: false,
    loading: false
};

// custom styling prop
// size prop
// color variant
// pass react props (event listeners and stuff)
// focus-visible

// for inputs and stuff:
// disabled
// loading
// icon
// error