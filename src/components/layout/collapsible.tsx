import { classes, combineClasses } from "../../../src/core/utils";
import { Selectors } from "../../../src/types";
import { Animate, LayoutGroup } from "@infinityfx/lively";
import { createStyles } from "../../core/style";

const styles = createStyles('collapsible', {
    '.content': {
        overflow: 'hidden'
    }
});

export type CollapsibleSelectors = Selectors<'content'>;

/**
 * An animated container which can hide its contents.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/collapsible}
 */
export default function Collapsible({ children, cc = {}, shown, ...props }: {
    ref?: React.Ref<HTMLDivElement>;
    cc?: CollapsibleSelectors;
    shown: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    return <LayoutGroup>
        <Animate
            key="collapsible"
            transition={{
                cache: ['height', 'opacity', 'visibility']
            }}>
            <div {...props}
                aria-hidden={!shown}
                className={classes(style.content, props.className)}
                style={{
                    ...props.style,
                    height: shown ? undefined : '0px',
                    opacity: shown ? 1 : 0,
                    visibility: shown ? 'visible' : 'hidden'
                }}>
                {children}
            </div>
        </Animate>
    </LayoutGroup>;
}