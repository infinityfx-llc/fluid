import { classes, combineClasses } from "../../../src/core/utils";
import { Selectors } from "../../../src/types";
import { Animatable } from "@infinityfx/lively";
import { LayoutGroup } from "@infinityfx/lively/layout";
import { forwardRef } from "react";
import { createStyles } from "../../core/style";

const styles = createStyles('collapsible', {
    '.content': {
        overflow: 'hidden'
    }
});

export type CollapsibleSelectors = Selectors<'content'>;

const Collapsible = forwardRef(({ children, cc = {}, shown, ...props }: {
    cc?: CollapsibleSelectors;
    shown: boolean;
} & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = combineClasses(styles, cc);

    return <LayoutGroup>
        <Animatable id="collapsible" cachable={['height', 'opacity', 'visibility']} adaptive>
            <div ref={ref} {...props} aria-hidden={!shown} className={classes(style.content, props.className)} style={{
                ...props.style,
                height: shown ? undefined : '0px',
                opacity: shown ? 1 : 0,
                visibility: shown ? 'visible' : 'hidden'
            }}>
                {children}
            </div>
        </Animatable>
    </LayoutGroup>;
});

Collapsible.displayName = 'Collapsible';

export default Collapsible;