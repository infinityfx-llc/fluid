'use client';

import FluidStyleStore from "../core/stylestore";

export default function ClientFluidStyles() {

    // @ts-expect-error
    return <style precedence="fluid__client" href="fluid__styles" dangerouslySetInnerHTML={{ __html: FluidStyleStore.serialize() }} />;
}