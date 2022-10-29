import React, { forwardRef } from 'react';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { mergeFallback } from '@core/utils/helper';
import { combine } from '@core/utils';

const ColorSwatch = forwardRef(({ children, styles, color, round, size, className, ...props }, ref) => {
    const style = useStyles(mergeFallback(styles, defaultStyles));

    return <div
        {...props}
        ref={ref}
        className={combine(
            style.swatch,
            style[size],
            className
        )}
        style={{ backgroundColor: color }}
        data-round={round}>
    </div>;
});

ColorSwatch.defaultProps = {
    styles: {},
    color: 'transparent',
    round: false,
    size: 'med'
}

export default ColorSwatch;