import { forwardRef } from 'react';

export default function FluidComponent(component) {

    return forwardRef((props, ref) => {
        const { styles, className, size, variant, ...rest } = props;

        return component(props, rest, ref);
    });
};