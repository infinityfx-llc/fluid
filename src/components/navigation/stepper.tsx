'use client';

import { classes, combineClasses } from "../../../src/core/utils";
import { Selectors } from "../../../src/types";
import { Animatable } from "@infinityfx/lively";
import { useId } from "react";
import Halo from "../feedback/halo";
import ProgressBar from "../feedback/progress-bar";
import { createStyles } from "../../core/style";
import { Icon } from "../../core/icons";

const styles = createStyles('stepper', {
    '.stepper': {
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: '1fr',
        gap: '6px'
    },

    '.stepper.vertical': {
        gridAutoFlow: 'row'
    },

    '.step': {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--f-spacing-sml)'
    },

    '.stepper.vertical .step': {
        flexDirection: 'row'
    },

    '.header': {
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },

    '.stepper.vertical .header': {
        flexDirection: 'column'
    },

    '.bullet': {
        position: 'relative',
        width: '2.5em',
        height: '2.5em',
        backgroundColor: 'var(--f-clr-fg-100)',
        border: 'solid 1px var(--f-clr-fg-200)',
        borderRadius: '999px',
        color: 'var(--f-clr-grey-300)',
        outline: 'solid 2px transparent',
        outlineOffset: '-1px',
        transition: 'background-color .25s, color .25s, outline-color .25s'
    },

    '.bullet:enabled': {
        cursor: 'pointer'
    },

    '.step[data-current="true"] .bullet': {
        outlineColor: 'var(--f-clr-primary-200)',
        color: 'var(--f-clr-primary-200)'
    },

    '.step[data-completed="true"] .bullet': {
        backgroundColor: 'var(--f-clr-primary-100)',
        color: 'var(--f-clr-text-200)'
    },

    '.step[data-error="true"][data-completed="false"] .bullet': {
        outlineColor: 'var(--f-clr-error-200)',
        color: 'var(--f-clr-error-200)'
    },

    '.step[data-error="true"][data-completed="true"] .bullet': {
        backgroundColor: 'var(--f-clr-error-100)'
    },

    '.icon': {
        width: '100%',
        aspectRatio: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden'
    },

    '.icons': {
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
    },

    '.progress': {
        flexGrow: 1,
        backgroundColor: 'var(--f-clr-fg-200)',
        borderRadius: 'var(--f-radius-xsm)',
        transition: 'background-color .25s'
    },

    '.stepper:not(.vertical) .progress': {
        minWidth: '1em',
        height: '3px'
    },

    '.stepper.vertical .progress': {
        minHeight: '1em',
        width: '3px'
    },

    '.step[data-completed="true"] .progress': {
        backgroundColor: 'var(--f-clr-primary-100)'
    },

    '.stepper:not(.vertical) .step:not(:last-child) .content': {
        paddingRight: 'var(--f-spacing-sml)'
    },

    '.name': {
        fontSize: 'var(--f-font-size-sml)',
        color: 'var(--f-clr-text-100)',
        fontWeight: 600
    },

    '.label': {
        fontSize: 'var(--f-font-size-xsm)',
        color: 'var(--f-clr-grey-600)'
    },

    '.halo': {
        inset: '-.5em !important'
    },

    '.track': {
        marginTop: 'calc(var(--f-spacing-sml) - 6px)'
    }
});

export type StepperSelectors = Selectors<'stepper' | 'step' | 'header' | 'bullet' | 'icon' | 'icons' | 'progress' | 'content' | 'name' | 'label'>;

export default function Stepper({ cc = {}, steps, completed, setCompleted, navigation = 'backwards', variant = 'default', ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: StepperSelectors;
        navigation?: 'none' | 'forwards' | 'backwards' | 'both';
        variant?: 'default' | 'compact' | 'vertical';
        steps: {
            name: string;
            icon: React.ReactNode;
            label?: string;
            error?: boolean;
        }[];
        completed: number;
        setCompleted?: (value: number) => void;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    const id = useId();
    const stepsArray = variant === 'compact' ?
        steps.slice(Math.min(completed, steps.length - 1), completed + 1) :
        steps;

    return <div
        {...props}
        className={classes(
            style.stepper,
            variant !== 'default' && style.vertical,
            props.className
        )}>

        {stepsArray.map(({ name, label, icon, error }, i) => {
            const navigatable = (navigation === 'forwards' ? i >= completed :
                navigation === 'backwards' ? i < completed :
                    navigation === 'both' ? true : false) && variant !== 'compact';
            const isCompleted = variant === 'compact' ? completed === steps.length : i < completed;

            if (!label) label = (i + 1 + '').padStart(2, '0');

            return <div
                key={i}
                className={style.step}
                data-completed={isCompleted}
                data-current={variant === 'compact' ? !isCompleted : i === completed}
                data-error={error}>

                <div className={style.header}>
                    <Halo disabled={!navigatable} cc={{ halo: style.halo }}>
                        <button
                            type="button"
                            className={style.bullet}
                            disabled={!navigatable}
                            onClick={() => setCompleted?.(i)}
                            aria-labelledby={`${id}-${i}`}>
                            <div className={style.icon}>
                                <Animatable
                                    initial={{
                                        translate: isCompleted ? '0% -25%' : '0% 25%'
                                    }}
                                    animate={{
                                        translate: ['0% 25%', '0% -25%'],
                                        duration: .35
                                    }}
                                    triggers={[
                                        { on: isCompleted },
                                        { on: !isCompleted, reverse: true }
                                    ]}>
                                    <div className={style.icons}>
                                        <div className={style.icon}>
                                            {icon}
                                        </div>
                                        <div className={style.icon}>
                                            <Icon type="check" />
                                        </div>
                                    </div>
                                </Animatable>
                            </div>
                        </button>
                    </Halo>

                    {i < steps.length - 1 && variant !== 'compact' && <div className={style.progress} />}
                </div>

                <div className={style.content}>
                    <div className={style.label} id={`${id}-${i}`}>{label}</div>
                    <div className={style.name}>{name}</div>
                </div>
            </div>;
        })}

        {variant === 'compact' &&
            <ProgressBar size="sml" value={completed / steps.length} cc={{ track: style.track }} />}
    </div>;
}