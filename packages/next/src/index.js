import React, { useEffect } from 'react';
import { FluidProvider, useStylesheet } from '@infinityfx/fluid';
import Head from 'next/head';
import withFluid from './plugin';

function NextFluidProvider({ children }) {
    const stylesheet = useStylesheet();

    if (typeof window !== 'undefined') stylesheet.hydrate();
    
    useEffect(() =>  {
        stylesheet.hydrate();
        
        return () => stylesheet.cleanup(true);
    }, []);

    return <FluidProvider>
        <Head>
            {stylesheet.preconnects().map(uri => {
                return <link key={uri} rel="preconnect" href={uri} crossorigin />;
            })}
            <style id={stylesheet.id} dangerouslySetInnerHTML={{ __html: stylesheet.toString() }} />
        </Head>
        {children}
    </FluidProvider>;
}

export {
    withFluid,
    NextFluidProvider
}