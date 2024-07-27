'use client';

import { combineRefs } from '../../../../src/core/utils';
import { LayoutGroup } from '@infinityfx/lively/layout';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { usePopover } from './root';
import Modal from '../modal';

export default function Content({ children, ref, ...props }: React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
}) {
    const { id, mounted, isModal, trigger, content, opened, toggle } = usePopover();

    const zIndex = useMemo(() => {
        if (!mounted || !trigger.current) return 1;

        let index = 0, parent: HTMLElement | null = trigger.current;
        while (parent) {
            const i = parseInt(getComputedStyle(parent).zIndex);
            if (!isNaN(i)) index = Math.max(index, i);

            parent = parent.parentElement;
        }

        return index + 2;
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
}

Content.displayName = 'Popover.Content';