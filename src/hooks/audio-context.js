import { useEffect, useState } from 'react';

export default function useAudioContext() {
    const [context, setContext] = useState();

    useEffect(() => {
        if (typeof AudioContext == 'undefined') return;

        setContext(new AudioContext());

        return () => context?.close();
    }, []);

    return context;
}