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

    '.d__horizontal .item:not(:last-child)': {
        borderTopRightRadius: '0 !important',
        borderBottomRightRadius: '0 !important'
    },

    '.d__horizontal .item:not(:first-child)': {
        borderTopLeftRadius: '0 !important',
        borderBottomLeftRadius: '0 !important'
    },

    '.d__vertical .item:not(:last-child)': {
        borderBottomLeftRadius: '0 !important',
        borderBottomRightRadius: '0 !important'
    },

    '.d__vertical .item:not(:first-child)': {
        borderTopLeftRadius: '0 !important',
        borderTopRightRadius: '0 !important'
    },

    '.d__horizontal .border + .border': {
        marginLeft: '-1px'
    },

    '.d__vertical .border + .border': {
        marginTop: '-1px'
    },

    '.border:has(:focus)': {
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
                    button: style.item,
                    toggle: style.item,
                    button__var__neutral: style.border,
                    toggle__var__neutral: style.border,
                    field: classes(style.item, style.border)
                }
            } as any);
        })}
    </div>;
}