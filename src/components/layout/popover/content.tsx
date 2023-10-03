'use client';

import { combineRefs } from '../../../../src/core/utils';
import useClickOutside from '../../../../src/hooks/use-click-outside';
import { LayoutGroup } from '@infinityfx/lively/layout';
import { forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { usePopover } from './root';

const Content = forwardRef((props: React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { id, mounted, trigger, opened, toggle } = usePopover();

    const menu = useClickOutside<HTMLDivElement>(e => {
        if (trigger.current && !trigger.current.contains(e.target as HTMLElement)) toggle(false);
    }, []);

    if (!mounted) return null;

    return createPortal(<LayoutGroup>
        {opened && <div ref={combineRefs(menu, ref)} {...props} id={id} style={{ ...props.style, position: 'fixed', zIndex: 999, ...opened }}>
            {props.children}
        </div>}
    </LayoutGroup>, document.getElementById('__fluid') as HTMLElement);
});

Content.displayName = 'Popover.Content';

export default Content;