import React from 'react';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { combine } from '@core/utils';

export default function Badge({ children, size, className }) {
    const style = useStyles(defaultStyles);

    return <div className={combine(style.badge, className)} data-size={size}>
        {children}
    </div>;
}

Badge.defaultProps = {
    size: 'med'
}