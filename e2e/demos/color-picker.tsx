import { ColorPicker } from '@/fluid';

export default function () {

    return <ColorPicker
        style={{
            width: '18rem'
        }}
        cc={{
            selection: 'color-selector'
        }} />;
}