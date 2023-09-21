'use client';

import { FluidStyles, Selectors } from "../../../src/types";
import { Fragment, forwardRef, useId, useState } from "react";
import Scrollarea from "../layout/scrollarea";
import Toggle from "../input/toggle";
import { MdCheck, MdCopyAll } from "react-icons/md";
import { createStyles } from "../../core/style";
import { combineClasses } from "../../core/utils";

export type CodeStyles = FluidStyles<'.wrapper' | '.header' | '.code' | '.numbers' | '.tab' | '.content' | '.toggle'>;

const Code = forwardRef(({ children, cc = {}, title, ...props }: { children: string; cc?: Selectors<'wrapper' | 'header' | 'code' | 'numbers' | 'tab' | 'content' | 'toggle'>; } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: any) => {
    const styles = createStyles('code', {
        '.wrapper': {
            fontSize: 'var(--f-font-size-sml)',
            borderRadius: 'var(--f-radius-sml)',
            overflow: 'hidden',
            position: 'relative',
            color: 'var(--f-clr-text-100)'
        },

        '.header': {
            backgroundColor: 'var(--f-clr-primary-500)',
            padding: '.8em 1em',
            fontWeight: 500
        },

        '.code': {
            display: 'flex',
            padding: '1em',
            backgroundColor: 'var(--f-clr-fg-100)'
        },

        '.numbers': {
            userSelect: 'none',
            textAlign: 'right',
            marginRight: 'var(--f-spacing-sml)',
            color: 'var(--f-clr-grey-500)'
        },

        '.tab': {
            display: 'inline-block',
            minWidth: '2em'
        },

        '.content': {
            width: 'max-content'
        },

        '.button__align': {
            position: 'absolute',
            zIndex: '99',
            right: '1em',
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            maxHeight: '100%'
        },

        '.toggle': {
            marginBlock: '1em !important'
        },

        '.toggle[data-checked="false"]': {
            backgroundColor: 'var(--f-clr-bg-100) !important'
        }
    });
    const style = combineClasses(styles, cc);

    const id = useId();
    const [copied, setCopied] = useState(false);

    const lines = children.split(/\n/).map((line, i) => {
        const tabs = line.match(/^(?:\t|\s)+/)?.[0].split(/(?:\t|\s{4})/g).slice(1) || [];

        return <Fragment key={i}>
            {tabs.map((_, i) => <span className={style.tab} key={i} />)}
            {line} <br />
        </Fragment>;
    });

    return <div ref={ref} {...props} className={style.wrapper}>
        {title && <div className={style.header}>
            {title}
        </div>}
        <code className={style.code}>
            <div className={style.numbers}>
                {lines.map((_, i) => <Fragment key={i}>
                    {i + 1} <br />
                </Fragment>)}
            </div>
            <Scrollarea horizontal>
                <div id={id} className={style.content}>
                    {lines}
                </div>
            </Scrollarea>
        </code>

        <div className={style.button__align}>
            <Toggle checkedContent={<MdCheck />} checked={copied}
                cc={{
                    toggle: style.toggle
                }}
                onClick={() => {
                    const range = document.createRange(), el = document.getElementById(id) as HTMLDivElement;
                    range.selectNodeContents(el);
                    document.getSelection()?.addRange(range);

                    try {
                        navigator.clipboard.writeText(el.innerText);
                    } catch (ex) {
                        document.execCommand('copy');
                    }

                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }}>
                <MdCopyAll />
            </Toggle>
        </div>
    </div>;
});

Code.displayName = 'Code';

export default Code;