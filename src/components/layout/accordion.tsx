import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { Fragment, forwardRef, useState, useId } from "react";
import { Halo } from "../feedback";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import Collapsible from "./collapsible";
import { Animatable } from "@infinityfx/lively";

const Accordion = forwardRef(({ styles = {}, items, multiple }: { styles?: FluidStyles; items: { label: React.ReactNode; content: React.ReactNode; disabled?: boolean; }[]; multiple?: boolean; }, ref: any) => {
    const style = useStyles(styles, {
        '.accordion': {
            display: 'flex',
            flexDirection: 'column'
        },

        '.button': {
            position: 'relative',
            borderRadius: 'var(--f-radius-sml)',
            padding: '.6em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--f-spacing-sml)',
            outline: 'none',
            border: 'none',
            background: 'none',
            color: 'var(--f-clr-text-100)'
        },

        '.button:enabled': {
            cursor: 'pointer'
        },

        '.button:disabled': {
            color: 'var(--f-clr-grey-500)'
        },

        '.content': {
            padding: '.6em',
            color: 'var(--f-clr-text-100)'
        },

        '.divider': {
            height: '1px',
            backgroundColor: 'var(--f-clr-grey-100)'
        },

        '.icon': {
            height: '1em',
            overflow: 'hidden'
        },

        '.arrows': {
            display: 'flex',
            flexDirection: 'column'
        }
    });

    const [open, setOpen] = useState<number[]>([]);
    const id = useId();

    return <div className={style.accordion}>
        {items.map(({ label, content, disabled }, i) => {
            return <Fragment key={i}>
                <Halo disabled={disabled}>
                    <button disabled={disabled} className={style.button} type="button" aria-expanded={open[multiple ? i : 0] === i} aria-controls={id} onClick={() => {
                        const arr = open.slice();
                        arr[multiple ? i : 0] = arr[multiple ? i : 0] === i ? -1 : i;

                        setOpen(arr);
                    }}>
                        {label}

                        <div className={style.icon}>
                            <Animatable animate={{ translate: ['0% 0%', '0% -50%'] }}>
                                <div className={style.arrows}>
                                    <MdArrowDownward />
                                    <MdArrowUpward />
                                </div>
                            </Animatable>
                        </div>
                    </button>
                </Halo>

                <Collapsible shown={open[multiple ? i : 0] === i} id={id} className={style.content}>
                    {content}
                </Collapsible>

                {i < items.length - 1 && <div className={style.divider} />}
            </Fragment>;
        })}
    </div>;
});

Accordion.displayName = 'Accordion';

export default Accordion;