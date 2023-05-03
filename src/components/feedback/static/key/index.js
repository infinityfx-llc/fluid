import React from 'react';
import { mergeFallback } from '@core/utils';
import useStyles from '@hooks/styles';
import defaultStyles from './style';

export default function Key({ children, styles, size }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));

    return <div className={style.key}>
        {children}
    </div>;
}

Key.defaultProps = {
    styles: {},
    size: 'med'
};