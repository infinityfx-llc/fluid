'use client';

import { forwardRef } from "react";
import Popover from "../../layout/popover";
import type { PopoverRoot, PopoverRootReference } from "../../layout/popover/root";

const Root = forwardRef((props: PopoverRoot, ref: React.ForwardedRef<PopoverRootReference>) => {
    
    return <Popover.Root ref={ref} {...props}>
        {props.children}
    </Popover.Root>
});

Root.displayName = 'ActionMenu.Root';

export default Root;