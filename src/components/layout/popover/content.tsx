'use client';

import { combineRefs } from '../../../../src/core/utils';
import { LayoutGroup } from '@infinityfx/lively/layout';
import { forwardRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { usePopover } from './root';
import Modal from '../modal';

const Content = forwardRef(({ children, ...props }: React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { id, mounted, isModal, trigger, content, opened, toggle } = usePopover();

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

    if (isModal) return <Modal ref={ref} {...props} id={id} show={opened} onClose={() => toggle(false)}>
        {children}
    </Modal>;

    return createPortal(<LayoutGroup>
        <div ref={combineRefs(content, ref)} {...props} id={id} style={{ ...props.style, position: 'fixed', zIndex }}>
            {opened && children}
        </div>
    </LayoutGroup>, document.getElementById('__fluid') as HTMLElement);
});

Content.displayName = 'Popover.Content';

export default Content;