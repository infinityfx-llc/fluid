'use client';

import { combineRefs } from '../../../../src/core/utils';
import { LayoutGroup } from '@infinityfx/lively/layout';
import { forwardRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { usePopover } from './root';

const Content = forwardRef((props: React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { id, mounted, trigger, content, opened } = usePopover();

    const zIndex = useMemo(() => {
        if (!mounted || !trigger.current) return 1;

        let index = 1, parent: HTMLElement | null = trigger.current;
        while (parent) {
            const i = parseInt(getComputedStyle(parent).zIndex);
            if (!isNaN(i)) index += i;

            parent = parent.parentElement;
        }

        return index;
    }, [mounted]);

    if (!mounted) return null;

    return createPortal(<LayoutGroup>
        <div ref={combineRefs(content, ref)} {...props} id={id} style={{ ...props.style, position: 'fixed', zIndex }}>
            {opened && props.children}
        </div>
    </LayoutGroup>, document.getElementById('__fluid') as HTMLElement);
});

Content.displayName = 'Popover.Content';

export default Content;