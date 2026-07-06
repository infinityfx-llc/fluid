'use client';

import { Selectors } from "../../../../src/types";
import { createStyles } from "../../../core/style";
import { classes, combineClasses } from "../../../core/utils";
import { Icon } from "../../../core/icons";
import Scrollarea from "../scrollarea";
import Button from "../../input/button";
import { useModal } from "./root";

const styles = createStyles('modal-content', {
    '.content': {
        display: 'flex',
        flexDirection: 'column',
        paddingBlock: 'var(--f-spacing-med)'
    },

    '.scrollarea': {
        paddingInline: 'var(--f-spacing-med)'
    },

    '.header': {
        display: 'flex',
        alignItems: 'center',
        fontWeight: 700,
        paddingInline: 'var(--f-spacing-med)',
        paddingBottom: 'var(--f-spacing-med)',
        color: 'var(--f-clr-text-100)'
    },

    '.handle': {
        position: 'relative',
        height: '5px',
        width: '48px',
        backgroundColor: 'var(--f-clr-grey-200)',
        borderRadius: '99px',
        alignSelf: 'center'
    },

    '.title': {
        flexGrow: 1,
        color: 'var(--f-clr-heading-100)',
        paddingRight: 'var(--f-spacing-sml)'
    }
});

export type ModalContentSelectors = Selectors<'content' | 'scrollarea' | 'header' | 'title' | 'handle'>;

export default function Content({ children, cc = {}, title, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: ModalContentSelectors;
        title?: React.ReactNode;
    } & Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>) {
    const style = combineClasses(styles, cc);

    const { id, closeType, content, onClose } = useModal();

    return <div {...props} className={classes(style.content, props.className)}>
        {closeType === 'handle' && <div className={style.handle} />}

        <div className={style.header}>
            <span id={id} className={style.title}>{title}</span>

            {closeType === 'button' && <Button compact variant="minimal" onClick={onClose}>
                <Icon type="close" />
            </Button>}
        </div>

        <Scrollarea className={style.scrollarea} ref={content}>
            {children}
        </Scrollarea>
    </div>;
}

Content.displayName = 'ModalContent';