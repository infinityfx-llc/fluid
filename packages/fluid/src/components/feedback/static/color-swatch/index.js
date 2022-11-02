import React, { forwardRef } from 'react';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { mergeFallback } from '@core/utils/helper';
import { combine } from '@core/utils';
import Focus from '@components/feedback/focus';

const ColorSwatch = forwardRef(({ children, styles, color, round, selected, size, className, ...props }, ref) => {
    const style = useStyles(mergeFallback(styles, defaultStyles));

    return <Focus round={round}>
        <div
            {...props}
            ref={ref}
            className={combine(
                style.swatch,
                style[size],
                className
            )}
            style={{ backgroundColor: color }}
            data-round={round}
            data-selected={selected}>
        </div>
    </Focus>;
});

ColorSwatch.defaultProps = {
    styles: {},
    color: 'transparent',
    round: false,
    selected: false,
    size: 'med'
}

export default ColorSwatch;