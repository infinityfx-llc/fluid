import { Select } from '@/fluid';
import { LuPalette } from 'react-icons/lu';

export default function () {

    return <Select
        icon={<LuPalette />}
        placeholder="Color scheme"
        options={[
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'System', value: 'system' }
        ]} />;
}