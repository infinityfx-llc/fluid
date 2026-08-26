import { Select } from '@/fluid';
import { Animate } from '@infinityfx/lively';
import { LuPalette } from 'react-icons/lu';

export default function () {

    return <Animate animate={{
        opacity: [0, 1],
        translate: ['0px 8px', '0px 0px'],
        delay: .25
    }}>
        <Select
            icon={<LuPalette />}
            placeholder="Color scheme"
            options={[
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
                { label: 'System', value: 'system' }
            ]} />
    </Animate>;
}