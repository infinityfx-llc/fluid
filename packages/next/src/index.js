import { FluidProvider } from "@infinityfx/fluid";
import Head from 'next/head';

export function NextFluidProvider({ children }) {

    return <FluidProvider>
        <Head>
            <style></style>
        </Head>
        {children}
    </FluidProvider>
}