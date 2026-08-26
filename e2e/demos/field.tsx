import { Annotation, Field } from '@/fluid';
import { Animate } from '@infinityfx/lively';
import { LuUser } from 'react-icons/lu';

export default function () {

    return <Animate animate={{ opacity: [0, 1], delay: .25 }}>
        <Annotation label="Username">
            <Field
                icon={<LuUser />}
                placeholder="Username" />
        </Annotation>
    </Animate>;
}
