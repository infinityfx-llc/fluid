'use client';

import { forwardRef } from "react";
import { useHeader } from "./root";
import { createPortal } from "react-dom";

const Side = forwardRef(({ children, side, ...props }: { side: 'left' | 'right' } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const sideRef = useHeader()[side];

    return sideRef.current && createPortal(<div ref={ref} {...props}>
        {children}
    </div>, sideRef.current);
});

Side.displayName = 'Header.Side';

export default Side;

