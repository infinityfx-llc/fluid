import { createContext } from "react";

export const FluidContext = createContext({});

export default function FluidProvider({ children }: { children: React.ReactNode }) {

    return <FluidContext.Provider value={{}}>
        {children}
    </FluidContext.Provider>
}