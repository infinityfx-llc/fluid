'use client';

import { classes } from "../../../src/core/utils";
import useStyles from "../../../src/hooks/use-styles";
import { FluidStyles } from "../../../src/types";
import { Animatable } from "@infinityfx/lively";
import { forwardRef, useId } from "react";
import { MdCheck } from "react-icons/md";
import Halo from "../feedback/halo";
import ProgressBar from "../feedback/progress-bar";

const Stepper = forwardRef(({ styles = {}, steps, completed, setCompleted, navigation = 'backwards', variant = 'default', ...props }:
    {
        styles?: FluidStyles;
        steps: {
            title: string;
            label?: string;
            icon?: React.ReactNode;
            error?: boolean;
        }[];
        completed: number;
        setCompleted?: (value: number) => void;
        navigation?: 'none' | 'forwards' | 'backwards' | 'both';
        variant?: 'default' | 'compact' | 'vertical';
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.wrapper': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-sml)'
        },

        '.stepper': {
            display: 'flex',
            fontSize: 'var(--f-font-size-sml)'
        },

        '.wrapper[data-variant="vertical"] .stepper': {
            flexDirection: 'column'
        },

        '.step': {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--f-spacing-sml)'
        },

        '.step:not(:last-child)': {
            flexBasis: 0,
            flexGrow: 1
        },

        '.wrapper[data-variant="compact"] .step': {
            alignItems: 'center',
            flexDirection: 'row'
        },

        '.wrapper[data-variant="vertical"] .step': {
            flexDirection: 'row'
        },

        '.wrapper[data-variant="default"] .step:not(:last-child)': {
            paddingRight: 'var(--f-spacing-sml)'
        },

        '.wrapper[data-variant="vertical"] .step:not(:last-child)': {
            paddingBottom: 'var(--f-spacing-sml)'
        },

        '.header': {
            display: 'flex',
            gap: 'var(--f-spacing-sml)',
            alignItems: 'center'
        },

        '.wrapper[data-variant="vertical"] .header': {
            flexDirection: 'column'
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
            outlineColor: 'var(--f-clr-primary-400)',
            color: 'var(--f-clr-pirmary-400)'
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
            transition: 'background-color .25s',
            borderRadius: 'var(--f-radius-xsm)'
        },

        '.wrapper[data-variant="vertical"] .progress': {
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
            color: 'var(--f-clr-primary-400)'
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
        }
    });

    const id = useId();
    const stepsArray = variant === 'compact' ? steps.slice(Math.min(completed, steps.length - 1), completed + 1) : steps;
    const vertical = variant === 'compact' || variant === 'vertical';

    return <div ref={ref} {...props} className={classes(style.wrapper, props.className)} data-variant={variant}>
        <div className={style.stepper}>
            {stepsArray.map(({ title, label, icon, error }, i) => {
                const navigatable = (navigation === 'forwards' ? i >= completed :
                    navigation === 'backwards' ? i < completed :
                        navigation === 'both' ? true : false) && variant !== 'compact';
                const stepId = `${id}__${i}`;
                const isCompleted = variant === 'compact' ? completed === steps.length : i < completed;

                return <div key={i} className={style.step} data-completed={isCompleted} data-current={variant === 'compact' ? !isCompleted : i === completed} data-error={error}>
                    <div className={style.header}>
                        <Halo disabled={!navigatable} styles={{ '.halo': { inset: '-.5em' } }}>
                            <button type="button" className={style.button} disabled={!navigatable} onClick={() => setCompleted?.(i)} aria-labelledby={label ? stepId : undefined}>
                                <div className={style.bullet}>
                                    <div className={style.icon}>
                                        <Animatable animate={{ translate: ['0% 0%', '0% -50%'], duration: .35 }} initial={{ translate: isCompleted ? '0% -50%' : '0% 0%' }} triggers={[{ on: isCompleted }, { on: !isCompleted, reverse: true }]}>
                                            <div className={style.icons}>
                                                <div className={style.icon}>{icon}</div>
                                                <MdCheck />
                                            </div>
                                        </Animatable>
                                    </div>
                                </div>
                            </button>
                        </Halo>

                        {label && !vertical && <span className={style.label} id={stepId}>{label}</span>}

                        {i < steps.length - 1 && variant !== 'compact' && <div className={style.progress} />}
                    </div>

                    <div className={style.title}>
                        {label && vertical && <span className={style.label} id={stepId}>{label}</span>}

                        {title}
                    </div>
                </div>;
            })}
        </div>

        {variant === 'compact' && <ProgressBar value={completed / steps.length} styles={{
            '.track': { width: '100%' }
        }} />}
    </div>;
});

Stepper.displayName = 'Stepper';

export default Stepper;