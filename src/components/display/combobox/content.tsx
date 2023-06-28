'use client';

import { combineRefs } from '@/src/core/utils';
import useClickOutside from '@/src/hooks/use-click-outside';
import { LayoutGroup } from '@infinityfx/lively/layout';
import { forwardRef } from 'react';
import { Popover } from '../../layout';

const Content = forwardRef((props: React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    
    return <Popover.Content>
        {props.children}
    </Popover.Content>;
});

Content.displayName = 'Combobox.Content';

export default Content;