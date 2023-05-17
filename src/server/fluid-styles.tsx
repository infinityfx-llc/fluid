'use client'; // CHECK WHY THIS IS NECESSARY!!!

import FluidStyleStore from "../core/stylestore"

export default function FluidStyles() {

    // @ts-expect-error
    return <style precedence="default" href={`fluid__styles__${FluidStyleStore.version}`} dangerouslySetInnerHTML={{ __html: FluidStyleStore.serialize() }} />;
}