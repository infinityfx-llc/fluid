import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { Animatable } from "@infinityfx/lively";
import { forwardRef } from "react";
import { MdCheck } from "react-icons/md";
import { Halo } from "../feedback";

const Stepper = forwardRef(({ styles = {}, steps, completed, setCompleted, navigation = 'backwards', vertical = false, ...props }:
    {
        styles?: FluidStyles;
        steps: {
            title: string;
            label?: string;
            icon?: React.ReactNode;
            error?: boolean;
        }[];
        completed: number;
        setCompleted: (value: number) => void;
        navigation?: 'none' | 'forwards' | 'backwards' | 'both';
        vertical?: boolean;
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.stepper': {
            display: 'flex',
            fontSize: 'var(--f-font-size-sml)'
        },

        '.stepper[data-vertical="true"]': {
            flexDirection: 'column'
        },

        '.step': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-sml)',
            flexBasis: 0,
            flexGrow: 1
        },

        '.stepper[data-vertical="true"] .step': {
            flexDirection: 'row'
        },

        '.stepper[data-vertical="false"] .step:not(:last-child)': {
            paddingRight: 'var(--f-spacing-sml)'
        },

        '.stepper[data-vertical="true"] .step:not(:last-child)': {
            paddingBottom: 'var(--f-spacing-sml)'
        },

        '.header': {
            display: 'flex',
            gap: 'var(--f-spacing-sml)',
            alignItems: 'center'
        },

        '.stepper[data-vertical="true"] .header': {
            flexDirection: 'column'
        },

        '.halo': {
            inset: '-.5em'
        },

        '.button': {
            position: 'relative',
            borderRadius: '999px',
            outline: 'none',
            border: 'none',
            background: 'none'
        },

        '.button:enabled': {
            cursor: 'pointer'
        },

        '.bullet': {
            width: '2em',
            height: '2em',
            borderRadius: '999px',
            backgroundColor: 'var(--f-clr-grey-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2em',
            color: 'var(--f-clr-grey-300)',
            outline: 'solid 2px transparent',
            transition: 'background-color .25s, color .25s, outline-color .25s'
        },

        '.step[data-completed="true"] .bullet': {
            backgroundColor: 'var(--f-clr-primary-100)',
            color: 'var(--f-clr-text-200)'
        },

        '.step[data-current="true"] .bullet': {
            outlineColor: 'var(--f-clr-accent-100)',
            color: 'var(--f-clr-accent-100)'
        },

        '.step[data-error="true"][data-completed="false"] .bullet': {
            outlineColor: 'var(--f-clr-error-100)',
            color: 'var(--f-clr-error-200)'
        },

        '.step[data-error="true"][data-completed="true"] .bullet': {
            backgroundColor: 'var(--f-clr-error-100)'
        },

        '.icon': {
            width: '1em',
            height: '1em',
            overflow: 'hidden'
        },

        '.icons': {
            display: 'flex',
            flexDirection: 'column'
        },

        '.progress': {
            height: '3px',
            flexGrow: 1,
            backgroundColor: 'var(--f-clr-grey-100)',
            transition: 'background-color .25s'
        },

        '.stepper[data-vertical="true"] .progress': {
            width: '3px',
            minHeight: '1em'
        },

        '.step[data-completed="true"] .progress': {
            backgroundColor: 'var(--f-clr-primary-100)'
        },

        '.label': {
            fontSize: '.85em',
            fontWeight: 700,
            color: 'var(--f-clr-grey-300)',
            transition: 'color .25s'
        },

        '.step[data-completed="true"] .label': {
            color: 'var(--f-clr-primary-100)'
        },

        '.step[data-current="true"] .label': {
            color: 'var(--f-clr-accent-100)'
        },

        '.step[data-error="true"] .label': {
            color: 'var(--f-clr-error-100)'
        },

        '.title': {
            fontWeight: 600,
            color: 'var(--f-clr-text-100)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-xxs)'
        },

        '.stepper[data-vertical="false"] .title .label': {
            display: 'none'
        },

        '.stepper[data-vertical="true"] .header .label': {
            display: 'none'
        }
    });

    return <div ref={ref} {...props} className={classes(style.stepper, props.className)} data-vertical={vertical}>
        {steps.map(({ title, label, icon, error }, i) => {
            const navigatable = navigation === 'forwards' ? i >= completed :
                navigation === 'backwards' ? i < completed :
                    navigation === 'both' ? true : false;

            return <div key={i} className={style.step} data-completed={i < completed} data-current={i === completed} data-error={error}>
                <div className={style.header}>
                    <Halo className={style.halo} disabled={!navigatable}>
                        <button type="button" className={style.button} disabled={!navigatable} onClick={() => setCompleted(i)}>
                            <div className={style.bullet}>
                                <div className={style.icon}>
                                    <Animatable animate={{ translate: ['0% 0%', '0% -50%'], duration: .35 }} triggers={[{ on: i < completed }, { on: !(i < completed), reverse: true }]}>
                                        <div className={style.icons}>
                                            <div className={style.icon}>{icon}</div>
                                            <MdCheck />
                                        </div>
                                    </Animatable>
                                </div>
                            </div>
                        </button>
                    </Halo>

                    {label && <span className={style.label}>{label}</span>}

                    {i < steps.length - 1 && <div className={style.progress} />}
                </div>

                <div className={style.title}>
                    {label && <span className={style.label}>{label}</span>}

                    {title}
                </div>
            </div>;
        })}
    </div>;
});

Stepper.displayName = 'Stepper';

export default Stepper;