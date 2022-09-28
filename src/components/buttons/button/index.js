import Spinner from '@components/info/progress/spinner/index';
import { combine } from '@core/utils/css';
import useStyles from '@hooks/styles';
import React from 'react';
import defaultStyles from './style';

export default function Button({ children, disabled, loading, onClick, ...props }) {
    const style = useStyles(defaultStyles);

    return <button {...props} className={combine(style.button, loading ? style.loading : null)} onClick={e => {
        if (!loading && !disabled) onClick(e);
    }}>
        {loading && <Spinner className={style.test} />}
        {children}
    </button>;
}

// custom styling prop
// size prop
// color variant
// pass react props (event listeners and stuff)

// for inputs and stuff:
// disabled
// loading
// icon
// error