import { FluidSize, Selectors } from "../../../../src/types";
import { classes } from "../../../../src/utils";
import { createStyles } from "../../../core/style";
import { combineClasses } from "../../../core/utils";

const styles = createStyles('card-content', {
    '.center': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    '.horizontal': {
        display: 'flex',
        alignItems: 'center'
    },

    '.vertical': {
        display: 'flex',
        flexDirection: 'column'
    },

    '.stretch > *': {
        flexBasis: 0,
        flexGrow: 1
    }
});

export type CardContentSelectors = Selectors<'center' | 'horizontal' | 'vertical'>;

export default function Content({ children, cc = {}, stretch, align = 'vertical', pad = 'none', gap = 'sml', ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: CardContentSelectors;
        /**
         * Let every child element fill all available space.
         * 
         * @default false
         */
        stretch?: boolean;
        /**
         * @default 'vertical'
         */
        align?: 'horizontal' | 'vertical' | 'center';
        /**
         * @default 'none'
         */
        pad?: 'none' | 'xxs' | FluidSize | 'xlg';
        /**
         * @default 'sml'
         */
        gap?: 'none' | FluidSize;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    return <div
        {...props}
        className={classes(
            style[align],
            stretch && style.stretch,
            pad !== 'none' && `pd-${pad}`,
            gap !== 'none' && `gp-${gap}`,
            props.className
        )}>
        {children}
    </div>;
}

Content.displayName = 'CardContent';