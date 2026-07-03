'use client';

import { combineRefs, getAbsoluteZIndex } from '../../../../src/core/utils';
import { LayoutGroup } from '@infinityfx/lively';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { usePopover } from './root';
import Modal from '../modal';

export default function Content({ children, ref, ...props }: React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
}) {
    // const { id, variant, mounted, isModal, trigger, content, opened, toggle } = usePopover();
    const { id, mounted, isModal, trigger, content, opened, toggle } = usePopover();

    const zIndex = useMemo(() => {
        if (!mounted || !trigger.current) return 1;

        return getAbsoluteZIndex(trigger.current) + 2;
    }, [mounted]);

    if (!mounted) return null;

    if (isModal) return <Modal ref={combineRefs(content, ref)} {...props} id={id} show={opened} onClose={() => toggle(false)}>
        {children}
    </Modal>;

    return createPortal(<LayoutGroup ignoreWarnings>
        <div
            {...props}
            ref={combineRefs(content, ref)}
            id={id}
            // data-popover={variant}
            style={{ ...props.style, position: 'fixed', zIndex }}>
            {opened && children}
        </div>
    </LayoutGroup>, document.getElementById('__fluid') as HTMLElement);
}

Content.displayName = 'Popover.Content';