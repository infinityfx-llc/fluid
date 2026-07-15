import { classes, combineClasses } from "../../../src/core/utils";
import { Selectors } from "../../../src/types";
import { createStyles } from "../../core/style";

const styles = createStyles('key', {
    '.key': {
        display: 'inline',
        position: 'relative',
        fontWeight: 600,
        fontSize: 'var(--f-font-size-xsm)',
        color: 'var(--f-clr-grey-700)',
        backgroundColor: 'var(--f-clr-surface-200)',
        border: 'solid 1px var(--f-clr-surface-300)',
        borderRadius: 'var(--f-radius-sml)',
        padding: '.3em .5em'
    }
});

export type KeySelectors = Selectors<'key'>;

/**
 * Displays a keyboard input.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/key}
 */
export default function Key({ children, cc = {}, ...props }: {
    children: string;
    ref?: React.Ref<HTMLDivElement>;
    cc?: KeySelectors;
} & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    return <div {...props} className={classes(style.key, props.className)}>
        {children}
    </div>;
}