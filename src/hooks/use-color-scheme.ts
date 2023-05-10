import { useInsertionEffect, useState } from "react";

export default function useColorScheme(initial: string = 'light'): [string, (scheme: string) => void] {
    const [colorScheme, setColorScheme] = useState(initial);

    function updateColorScheme(scheme: string) {
        // cookies

        setColorScheme(scheme);
    }

    useInsertionEffect(() => {
        // cookies
    }, []);

    return [colorScheme, updateColorScheme];
}