import { classes, combineClasses } from '../../../src/core/utils';
import { Selectors } from '../../../src/types';
import { Children, isValidElement, cloneElement } from 'react';
import { createStyles } from '../../core/style';

const styles = createStyles('group', {
    '.group': {
        display: 'flex',
        ['--radius' as any]: 0
    },

    '.split': {
        gap: 'var(--f-spacing-xxs)',
        ['--radius' as any]: 'var(--f-radius-sml)'
    },

    '.d__vertical': {
        flexDirection: 'column'
    },

    '.group .round': {
        borderRadius: '1.5em'
    },

    '.d__horizontal .item:not(:last-child)': {
        borderTopRightRadius: 'var(--radius) !important',
        borderBottomRightRadius: 'var(--radius) !important'
    },

    '.d__horizontal .item:not(:first-child)': {
        borderTopLeftRadius: 'var(--radius) !important',
        borderBottomLeftRadius: 'var(--radius) !important'
    },

    '.d__vertical .item:not(:last-child)': {
        borderBottomLeftRadius: 'var(--radius) !important',
        borderBottomRightRadius: 'var(--radius) !important'
    },

    '.d__vertical .item:not(:first-child)': {
        borderTopLeftRadius: 'var(--radius) !important',
        borderTopRightRadius: 'var(--radius) !important'
    },

    '.d__horizontal:not(.split) .border + .border': {
        marginLeft: '-1px'
    },

    '.d__vertical:not(.split) .border + .border': {
        marginTop: '-1px'
    },

    '.border:has(:focus)': {
        zIndex: 1
    }
});

export type GroupSelectors = Selectors<'group' | 'split' | 'd__horizontal' | 'd__vertical'>;

/**
 * Merges multiple toggle, button or field inputs.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/group}
 */
export default function Group({ children, cc = {}, split = false, direction = 'horizontal', ...props }: {
    ref?: React.Ref<HTMLDivElement>;
    cc?: GroupSelectors;
    split?: boolean;
    direction?: 'horizontal' | 'vertical';
} & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    return <div {...props}
        className={classes(
            style.group,
            split && style.split,
            style[`d__${direction}`],
            props.className
        )}>
        {Children.map(children, child => {
            if (!isValidElement(child)) return child;

            const cc = (child as React.ReactElement<any>).props.cc || {};

            return cloneElement(child, {
                cc: {
                    ...cc,
                    round: style.round,
                    button: classes(style.item, cc.button),
                    toggle: classes(style.item, cc.toggle),
                    v__neutral: classes(style.border, cc.v__neutral),
                    field: classes(style.item, style.border, cc.field)
                }
            } as any);
        })}
    </div>;
}