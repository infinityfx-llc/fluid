import { createElement } from "react";
import { LuArrowDownWideNarrow, LuArrowUpDown, LuArrowUpNarrowWide, LuCheck, LuChevronDown, LuChevronFirst, LuChevronLast, LuChevronLeft, LuChevronRight, LuChevronUp, LuChevronsUpDown, LuCopy, LuEye, LuEyeOff, LuFileUp, LuMinus, LuMoon, LuMoreVertical, LuPanelLeftClose, LuPanelLeftOpen, LuPlus, LuSearch, LuSun, LuX } from "react-icons/lu";

export const ICONS = {
    add: LuPlus,
    check: LuCheck,
    close: LuX,
    collapseUp: LuChevronUp,
    collapseSidebar: LuPanelLeftClose,
    copy: LuCopy,
    dark: LuMoon,
    down: LuChevronDown,
    expand: LuChevronsUpDown,
    expandDown: LuChevronDown,
    expandSidebar: LuPanelLeftOpen,
    first: LuChevronFirst,
    hide: LuEyeOff,
    last: LuChevronLast,
    left: LuChevronLeft,
    light: LuSun,
    more: LuMoreVertical,
    search: LuSearch,
    show: LuEye,
    sort: LuArrowUpDown,
    sortAscend: LuArrowUpNarrowWide,
    sortDescend: LuArrowDownWideNarrow,
    up: LuChevronUp,
    upload: LuFileUp,
    remove: LuMinus,
    right: LuChevronRight
}

export function Icon({ type }: { type: keyof typeof ICONS }) {
    return createElement(ICONS[type]);
}

export type FluidIcon = keyof typeof ICONS;