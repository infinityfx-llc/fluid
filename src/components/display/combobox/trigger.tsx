'use client';

import Popover from "../../layout/popover";

export default function Trigger({ children, longpress, disabled }: { children: React.ReactElement; longpress?: boolean; disabled?: boolean; }) {
    
    return <Popover.Trigger>
        {children}
    </Popover.Trigger>;
}

Trigger.displayName = 'Combobox.Trigger';