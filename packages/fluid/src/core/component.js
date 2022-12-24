import useStyles from '@hooks/styles';
import { forwardRef } from 'react';
import { mergeFallback } from './utils';

export default function FluidComponent(component, defaultStyles = {}) {
    return forwardRef((props, ref) => {
        props = Object.assign({}, props);

        const styles = useStyles(mergeFallback.bind({}, props.styles || {}, defaultStyles));
        const domProps = Object.assign({}, props);
        ['className', 'size', 'variant'].forEach(prop => delete domProps[prop]);

        return component(Object.assign(props, {
            size: props.size || 'med',
            styles,
            domProps
        }), ref);
    });
};

// implements variants
// be able to add variants as sort of plugins (from modules)