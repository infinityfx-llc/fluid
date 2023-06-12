import { Children, cloneElement, isValidElement, useState } from "react";
import Section from "./section";
import { FluidSize } from "@/src/types";
import Header from "./header";
import Sidebar from "./sidebar";

export default function Layout({ children }: { children: React.ReactNode; }) {
    const [collapsed, setCollapsed] = useState(false);
    let header: boolean | FluidSize = false;
    let sidebar = false;

    Children.forEach(children, child => {
        if (!isValidElement(child)) return;

        if (child.type === Header) header = child.props.variant === 'transparent' ? false : child.props.size;
        if (child.type === Sidebar) sidebar = true;
    });

    return <>
        {Children.map(children, child => {
            if (!isValidElement(child)) return null;

            if (child.type === Section) return cloneElement(child as React.ReactElement, { header, sidebar, collapsed });
            if (child.type === Header) return cloneElement(child as React.ReactElement, { sidebar, collapsed });
            if (child.type === Sidebar) return cloneElement(child as React.ReactElement, { header, collapsed, onCollapse: setCollapsed });

            return child;
        })}
    </>;
}