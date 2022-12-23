import useStyles from '@hooks/styles';
import { forwardRef } from 'react';
import { mergeFallback } from './utils';

export default function FluidComponent(component, defaultStyles = {}, defaultProps = {}) {
    const result = forwardRef((props, ref) => {
        const domProps = Object.assign({}, props);
        ['styles', 'className', 'size', 'variant'].forEach(prop => delete domProps[prop]);
        const style = useStyles(mergeFallback.bind({}, props.styles, defaultStyles));

        return component(props, { style, domProps, ref });
    });

    result.defaultProps = defaultProps;

    return result;
};

// implements variants
// be able to add variants as sort of plugins (from modules)