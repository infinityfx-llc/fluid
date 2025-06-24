import { classes, combineClasses } from "../../../src/core/utils";
import { FluidSize, Selectors } from "../../../src/types";
import { createStyles } from "../../core/style";

const styles = createStyles('divider', {
    '.divider': {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-xsm)',
        fontSize: 'var(--f-font-size-xsm)',
        fontWeight: 600,
        color: 'var(--f-clr-grey-200)'
    },

    '.divider[aria-orientation="vertical"]': {
        writingMode: 'vertical-lr'
    },

    '.line': {
        backgroundColor: 'var(--f-clr-fg-200)',
        flexGrow: 1
    },

    '.divider[aria-orientation="horizontal"] .line': {
        height: '1px'
    },

    '.divider[aria-orientation="vertical"] .line': {
        width: '1px'
    }
});

export type DividerSelectors = Selectors<'divider' | 'line'>;

/**
 * A divider.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/divider}
 */
export default function Divider({ cc = {}, vertical = false, label, labelPosition = 'center', size = 'med', ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: DividerSelectors
        /**
         * @default false
         */
        vertical?: boolean;
        label?: string;
        /**
         * @default "center"
         */
        labelPosition?: 'start' | 'center' | 'end';
        size?: FluidSize | 'inherit';
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    return <div {...props}
        role="separator"
        aria-orientation={vertical ? 'vertical' : 'horizontal'}
        className={classes(style.divider, props.className)}
        style={{
            paddingBlock: size == 'inherit' ? size : `var(--f-spacing-${size})`,
            ...props.style
        }}>
        {label && labelPosition !== 'start' && <div className={style.line} />}

        {label}

        {!(label && labelPosition === 'end') && <div className={style.line} />}
    </div>;
}