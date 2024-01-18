import { classes, combineClasses } from "../../../src/core/utils";
import { FluidSize, FluidStyles, Selectors } from "../../../src/types";
import { forwardRef } from "react";
import { createStyles } from "../../core/style";

export type DividerStyles = FluidStyles<'.divider' | '.line'>;

const Divider = forwardRef(({ cc = {}, vertical = false, label, labelPosition = 'center', size = 'med', ...props }:
    {
        cc?: Selectors<'divider' | 'line'>;
        vertical?: boolean;
        label?: string;
        labelPosition?: 'start' | 'center' | 'end';
        size?: FluidSize;
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('divider', {
        '.divider': {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-xsm)',
            fontSize: 'var(--f-font-size-xsm)',
            fontWeight: 600,
            color: 'var(--f-clr-grey-300)'
        },

        '.divider[data-vertical="true"]': {
            writingMode: 'vertical-lr'
        },

        '.line': {
            backgroundColor: 'var(--f-clr-grey-300)',
            flexGrow: 1
        },

        '.divider[data-vertical="false"] .line': {
            height: '1px'
        },

        '.divider[data-vertical="true"] .line': {
            width: '1px'
        },
    });
    const style = combineClasses(styles, cc);

    return <div ref={ref} {...props} role="separator" aria-orientation={vertical ? 'vertical' : 'horizontal'}
        className={classes(style.divider, props.className)}
        style={{
            paddingBlock: `var(--f-spacing-${size})`,
            ...props.style
        }}
        data-vertical={vertical}>
        {label && labelPosition !== 'start' && <div className={style.line} />}

        {label}

        {!(label && labelPosition === 'end') && <div className={style.line} />}
    </div>;
});

Divider.displayName = 'Divider';

export default Divider;