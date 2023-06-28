'use client';

import { forwardRef } from "react";
import Popover from "../../layout/popover";
import type { PopoverRootReference } from "../../layout/popover/root";

const Root = forwardRef(({ children, position = 'auto', stretch, onClose }: { children: React.ReactNode; position?: 'auto' | 'center'; stretch?: boolean; onClose?: () => void; }, ref: React.ForwardedRef<PopoverRootReference>) => {
    
    return <Popover.Root>
        {children}
    </Popover.Root>
});

Root.displayName = 'Combobox.Root';

export default Root;