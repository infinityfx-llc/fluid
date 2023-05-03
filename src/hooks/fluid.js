import { useContext } from 'react';
import { FluidContext } from '@components/context/fluid';

export default function useFluid() {
    return useContext(FluidContext);
}