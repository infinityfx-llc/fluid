import { classes, combineClasses } from '../../../src/core/utils';
import { Selectors } from '../../../src/types';
import { createStyles } from '../../core/style';

const styles = createStyles('group', {
    '.group': {
        display: 'flex',
        ['--radius' as any]: 0
    },

    '.split': {
        gap: 'var(--f-spacing-xxs)',
        ['--radius' as any]: 'var(--f-radius-xsm)'
    },

    '.d__vertical': {
        flexDirection: 'column'
    },

    '.d__horizontal > :not(:last-child), .d__horizontal > :not(:last-child) [data-fc]': {
        borderTopRightRadius: 'var(--radius) !important',
        borderBottomRightRadius: 'var(--radius) !important'
    },

    '.d__horizontal > :not(:first-child), .d__horizontal > :not(:first-child) [data-fc]': {
        borderTopLeftRadius: 'var(--radius) !important',
        borderBottomLeftRadius: 'var(--radius) !important'
    },

    '.d__vertical > :not(:last-child), .d__vertical > :not(:last-child) [data-fc]': {
        borderBottomLeftRadius: 'var(--radius) !important',
        borderBottomRightRadius: 'var(--radius) !important'
    },

    '.d__vertical > :not(:first-child), .d__vertical > :not(:first-child) [data-fc]': {
        borderTopLeftRadius: 'var(--radius) !important',
        borderTopRightRadius: 'var(--radius) !important'
    },

    '.d__horizontal:not(.split) > :where([data-fb], :has([data-fb])) + :where([data-fb], :has([data-fb]))': {
        marginLeft: '-1px'
    },

    '.d__vertical:not(.split) > :where([data-fb], :has([data-fb])) + :where([data-fb], :has([data-fb]))': {
        marginTop: '-1px'
    },

    '.group > :has(:focus)': {
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
    /**
     * Leave spacing between grouped elements.
     * 
     * @default false
     */
    split?: boolean;
    /**
     * @default "horizontal"
     */
    direction?: 'horizontal' | 'vertical';
} & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    return <div
        {...props}
        className={classes(
            style.group,
            split && style.split,
            style[`d__${direction}`],
            props.className
        )}>
        {children}
    </div>;
}