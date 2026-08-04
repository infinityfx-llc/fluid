import { Annotation, Field } from '@/fluid';
import { LuUser } from 'react-icons/lu';

export default function () {

    return <>
        <Annotation label="Username">
            <Field
                icon={<LuUser />}
                placeholder="Username" />
        </Annotation>
    </>;
}
