import { classes, combineClasses } from '../../../src/core/utils';
import { Selectors } from '../../../src/types';
import { forwardRef, Children, isValidElement, cloneElement } from 'react';
import { createStyles } from '../../core/style';

const Combine = forwardRef(({ children, cc = {}, direction = 'horizontal', ...props }: {
    cc?: Selectors;
    direction?: 'horizontal' | 'vertical';
} & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('combine', {
        '.combine': {
            display: 'flex'
        },

        '.combine__dir__vertical': {
            flexDirection: 'column'
        },

        '.combine__dir__horizontal .direct:not(:last-child), .combine__dir__horizontal > *:not(:last-child) .nested': {
            borderTopRightRadius: '0 !important',
            borderBottomRightRadius: '0 !important'
        },

        '.combine__dir__horizontal .direct:not(:first-child), .combine__dir__horizontal > *:not(:first-child) .nested': {
            borderTopLeftRadius: '0 !important',
            borderBottomLeftRadius: '0 !important'
        },

        '.combine__dir__vertical .direct:not(:last-child), .combine__dir__vertical > *:not(:last-child) .nested': {
            borderBottomLeftRadius: '0 !important',
            borderBottomRightRadius: '0 !important'
        },

        '.combine__dir__vertical .direct:not(:first-child), .combine__dir__vertical > *:not(:first-child) .nested': {
            borderTopLeftRadius: '0 !important',
            borderTopRightRadius: '0 !important'
        },

        '.combine__dir__horizontal .direct__border + .direct__border, .combine__dir__horizontal > *:has(.nested) + .direct__border': {
            borderLeft: 'none !important'
        },

        '.combine__dir__vertical .direct__border + .direct__border, .combine__dir__vertical > *:has(.nested) + .direct__border': {
            borderTop: 'none !important'
        },

        '.combine__dir__horizontal .direct__border + * .nested, .combine__dir__horizontal > *:has(.nested) + * .nested': {
            marginLeft: '-1px'
        },

        '.combine__dir__vertical .direct__border + * .nested, .combine__dir__vertical > *:has(.nested) + * .nested': {
            marginTop: '-1px'
        },

        '.nested:has(:focus)': {
            zIndex: 1
        }
    });
    const style = combineClasses(styles, cc);

    return <div ref={ref} {...props}
        className={classes(
            style.combine,
            style[`combine__dir__${direction}`],
            props.className
        )}>
        {Children.map(children, child => {
            if (!isValidElement(child)) return child;

            return cloneElement(child, {
                cc: {
                    button: style.direct,
                    button__var__neutral: style.direct__border,
                    toggle: style.direct,
                    toggle__var__neutral: style.direct__border,
                    field: style.nested
                }
            } as any);
        })}
    </div>;
});

Combine.displayName = 'Combine';

export default Combine;