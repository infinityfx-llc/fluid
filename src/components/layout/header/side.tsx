'use client';

import { forwardRef } from "react";
import { useHeader } from "./root";
import { createPortal } from "react-dom";

const Side = forwardRef(({ children, position, ...props }: { position: 'left' | 'right' } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const sideRef = useHeader()[position];

    return sideRef.current && createPortal(<div ref={ref} {...props}>
        {children}
    </div>, sideRef.current);
});

Side.displayName = 'Header.Side';

export default Side;

