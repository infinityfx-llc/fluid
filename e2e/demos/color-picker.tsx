import { ColorPicker } from '@/fluid';
import { Animate } from '@infinityfx/lively';

export default function () {

    return <Animate animate={{ opacity: [0, 1], delay: .25 }}>
        <ColorPicker
            style={{
                width: '18rem'
            }}
            cc={{
                selection: 'color-selector'
            }} />
    </Animate>;
}