import React, { useEffect } from 'react';
import { FluidProvider, useStylesheet } from '@infinityfx/fluid';
import Head from 'next/head';

export function NextFluidProvider({ children }) {
    const stylesheet = useStylesheet();

    if (typeof window !== 'undefined') stylesheet.hydrate();
    
    useEffect(() =>  {
        stylesheet.hydrate();
        
        return () => stylesheet.cleanup(true);
    }, []);

    return <FluidProvider>
        <Head>
            <style id={stylesheet.id} dangerouslySetInnerHTML={{ __html: stylesheet.toString() }} />
        </Head>
        {children}
    </FluidProvider>;
}