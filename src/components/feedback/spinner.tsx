import { Animatable } from "@infinityfx/lively";

export default function Spinner({ color, ...props }: Omit<React.HTMLAttributes<SVGSVGElement>, 'children'> & {
    ref?: React.Ref<SVGSVGElement>;
}) {

    return <svg {...props} style={{ stroke: color || 'currentcolor', ...props.style }} viewBox="0 0 100 100" width="1em" height="1em">
        <Animatable animate={{ rotate: ['0deg', '720deg'], strokeLength: [0.75, 0.25, 0.75], repeat: Infinity, easing: 'linear', duration: 2 }} triggers={[{ on: 'mount' }]}>
            <circle r={43} cx={50} cy={50} fill="none" strokeWidth={14} style={{ transformOrigin: '50% 50%', strokeLinecap: 'round' }} />
        </Animatable>
    </svg>;
}