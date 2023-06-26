import { useContext } from 'react';
import { LayoutContext } from '../context/layout';

export default function useLayout() {
    const layout = useContext(LayoutContext);

    if (!layout) throw new Error('Unable to access LayoutProvider context');

    return layout;
}