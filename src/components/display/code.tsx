'use client';

import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { Fragment, forwardRef, useId, useState } from "react";
import Scrollarea from "../layout/scrollarea";
import Toggle from "../input/toggle";
import { MdCheck, MdCopyAll } from "react-icons/md";

const Code = forwardRef(({ children, styles = {}, title, ...props }: { children: string; styles?: FluidStyles; } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ref: any) => {
    const style = useStyles(styles, {
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

        '.button_wrapper': {
            position: 'absolute',
            zIndex: '99',
            right: '1em',
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            maxHeight: '100%'
        },

        '.button': {
            marginBlock: '1em'
        }
    });

    const id = useId();
    const [copied, setCopied] = useState(false);

    const lines = children.split(/\n/).map(line => {
        const tabs = line.match(/^(?:\t|\s)+/)?.[0].split(/(?:\t|\s{4})/g).slice(1) || [];

        return tabs.fill(`<span class="${style.tab}"></span>`).join('') + line + '<br>';
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
                <div id={id} className={style.content} dangerouslySetInnerHTML={{ __html: lines.join('') }} />
            </Scrollarea>
        </code>

        <div className={style.button_wrapper}>
            <Toggle className={style.button} checkedContent={<MdCheck />} checked={copied}
                styles={{
                    '.toggle': {
                        backgroundColor: 'var(--f-clr-bg-100)'
                    }
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