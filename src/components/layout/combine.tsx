import { classes, combineClasses } from '../../../src/core/utils';
import { Selectors } from '../../../src/types';
import { Children, isValidElement, cloneElement } from 'react';
import { createStyles } from '../../core/style';

const styles = createStyles('combine', {
    '.combine': {
        display: 'flex'
    },

    '.d__vertical': {
        flexDirection: 'column'
    },

    '.d__horizontal .direct:not(:last-child), .d__horizontal > *:not(:last-child) .nested': {
        borderTopRightRadius: '0 !important',
        borderBottomRightRadius: '0 !important'
    },

    '.d__horizontal .direct:not(:first-child), .d__horizontal > *:not(:first-child) .nested': {
        borderTopLeftRadius: '0 !important',
        borderBottomLeftRadius: '0 !important'
    },

    '.d__vertical .direct:not(:last-child), .d__vertical > *:not(:last-child) .nested': {
        borderBottomLeftRadius: '0 !important',
        borderBottomRightRadius: '0 !important'
    },

    '.d__vertical .direct:not(:first-child), .d__vertical > *:not(:first-child) .nested': {
        borderTopLeftRadius: '0 !important',
        borderTopRightRadius: '0 !important'
    },

    '.d__horizontal .direct__border + .direct__border, .d__horizontal > *:has(.nested) + .direct__border': {
        borderLeft: 'none !important'
    },

    '.d__vertical .direct__border + .direct__border, .d__vertical > *:has(.nested) + .direct__border': {
        borderTop: 'none !important'
    },

    '.d__horizontal .direct__border + * .nested, .d__horizontal > *:has(.nested) + * .nested': {
        marginLeft: '-1px'
    },

    '.d__vertical .direct__border + * .nested, .d__vertical > *:has(.nested) + * .nested': {
        marginTop: '-1px'
    },

    '.nested:has(:focus)': {
        zIndex: 1
    }
});

export type CombineSelectors = Selectors<'combine' | 'd__horizontal' | 'd__vertical'>;

export default function Combine({ children, cc = {}, direction = 'horizontal', ...props }: {
    ref?: React.Ref<HTMLDivElement>;
    cc?: CombineSelectors;
    direction?: 'horizontal' | 'vertical';
} & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    return <div {...props}
        className={classes(
            style.combine,
            style[`d__${direction}`],
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
}