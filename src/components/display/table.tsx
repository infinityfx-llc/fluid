'use client';

import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { forwardRef, useState } from "react";
import { Halo } from "../feedback";
import { Scrollarea } from "../layout";
import { Button, Checkbox } from "../input";
import { MdArrowDownward, MdArrowUpward, MdMoreVert, MdRemove, MdSort, MdSwapVert } from "react-icons/md";
import ActionMenu, { ActionMenuOption } from "./action-menu";

const Table = forwardRef(({ styles = {}, data, columns, selectable, sortable, rowActions, ...props }:
    {
        styles?: FluidStyles;
        data: { [key: string]: string | number; }[];
        columns: string[];
        selectable?: boolean;
        sortable?: boolean | string[];
        rowActions?: ActionMenuOption[];
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {

    const style = useStyles(styles, {
        '.table': {
            backgroundColor: 'var(--f-clr-fg-100)',
            borderRadius: 'var(--f-radius-sml)',
            overflow: 'hidden',
            border: 'solid 1px var(--f-clr-grey-100)'
        },

        '.rows': {
            minWidth: 'max-content',
            display: 'flex',
            flexDirection: 'column'
        },

        '.row': {
            position: 'relative',
            display: 'grid',
            gridAutoFlow: 'column',
            alignItems: 'center',
            padding: '.6em',
            gap: 'var(--f-spacing-sml)',
            color: 'var(--f-clr-text-100)'
        },

        '.row:not(:last-child)': {
            borderBottom: 'solid 1px var(--f-clr-grey-100)'
        },

        '.row > *:not(.collapsed)': {
            whiteSpace: 'nowrap'
        },

        '.collapsed': {
            minWidth: '2rem',
            display: 'flex'
        },

        '.header': {
            fontSize: '.9em',
            fontWeight: 600
        },

        '.label': {
            position: 'relative',
            borderRadius: 'var(--f-radius-sml)',
            color: 'var(--f-clr-grey-600)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-xxs)',
            width: 'max-content',
            padding: '.2em .4em',
            border: 'none',
            background: 'none',
            outline: 'none'
        },

        '.label:enabled': {
            cursor: 'pointer'
        }
    });

    const [column, setColumn] = useState<string>('');
    const [sorting, setSorting] = useState<'nil' | 'asc' | 'dsc'>('nil');
    const [selected, setSelected] = useState<{ [key: number | string]: number | boolean; }>({ length: 0 });

    const rows = sorting !== 'nil' ?
        data.slice().sort((a, b) => {
            if (b[column] < a[column]) return sorting === 'asc' ? 1 : -1;
            if (b[column] > a[column]) return sorting === 'asc' ? -1 : 1;

            return 0;
        }) : data;

    const gridTemplateColumns = `${selectable ? 'auto' : ''} repeat(${columns.length}, 1fr) ${rowActions?.length ? 'auto' : ''}`;

    const CheckboxStyles = {
        '.checkbox': {
            borderColor: 'var(--f-clr-grey-300) !important',
            borderWidth: '1px !important'
        },

        '.input:checked:enabled + .checkbox': {
            backgroundColor: 'var(--f-clr-text-100)',
            borderColor: 'var(--f-clr-text-100) !important'
        },

        '.checkmark': {
            stroke: 'var(--f-clr-text-200)'
        }
    };

    return <Scrollarea {...props} ref={ref} horizontal role="grid" className={classes(style.table, props.className)}>
        <div role="rowgroup" className={style.rows}>
            <div role="rowheader" className={classes(style.row, style.header)} style={{ gridTemplateColumns }}>
                {selectable && <div className={style.collapsed}>
                    <Checkbox size="xsm" styles={CheckboxStyles} checked={selected.length === rows.length} onChange={e => {
                        if (!e.target.checked) return setSelected({ length: 0 });

                        for (let i = 0; i < rows.length; i++) selected[i] = true;
                        selected.length = rows.length;

                        setSelected(Object.assign({}, selected));
                    }} />
                </div>}

                {columns.map((col, i) => {
                    const sort = Array.isArray(sortable) ? sortable.includes(col) : sortable;

                    return <div key={i} role="columnheader">
                        <Halo disabled={!sort}>
                            <button disabled={!sort} className={style.label} onClick={() => {
                                setColumn(col);

                                if (column !== col || sorting === 'nil') {
                                    setSorting('asc');
                                } else
                                    if (sorting === 'asc') {
                                        setSorting('dsc');
                                    } else {
                                        setSorting('nil');
                                    }
                            }}>
                                {col}

                                {(column !== col || sorting === 'nil') && sort && <MdSort />}
                                {column === col && sorting === 'asc' && <MdArrowUpward />}
                                {column === col && sorting === 'dsc' && <MdArrowDownward />}
                            </button>
                        </Halo>
                    </div>;
                })}

                {rowActions?.length ? <div className={style.collapsed} /> : null}
            </div>

            {rows.map((row, i) => {

                return <Halo key={i} disabled={!selectable}>
                    <label role="row" className={style.row} style={{ gridTemplateColumns }}>
                        {selectable && <div className={style.collapsed}>
                            <Checkbox size="xsm" styles={CheckboxStyles} checked={!!selected[i]} onChange={e => {
                                selected[i] = e.target.checked;
                                (selected.length as number) += e.target.checked ? 1 : -1;

                                setSelected(Object.assign({}, selected));
                            }} />
                        </div>}

                        {columns.map((col, i) => {

                            return <div key={i} role="gridcell">{row[col]}</div>;
                        })}

                        {rowActions?.length ? <div className={style.collapsed}>
                            <ActionMenu options={rowActions}>
                                <Button variant="minimal" style={{ marginLeft: 'auto' }}>
                                    <MdMoreVert />
                                </Button>
                            </ActionMenu>
                        </div> : null}
                    </label>
                </Halo>;
            })}
        </div>
    </Scrollarea>;
});

Table.displayName = 'Table';

export default Table;

// fix row actions with index
// support react components as data