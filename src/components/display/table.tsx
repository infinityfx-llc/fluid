'use client';

import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { forwardRef, useState } from "react";
import Halo from "../feedback/halo";
import Scrollarea from "../layout/scrollarea";
import Button from "../input/button";
import Checkbox from "../input/checkbox";
import { MdArrowDownward, MdArrowUpward, MdMoreVert, MdSort } from "react-icons/md";
import ActionMenu, { ActionMenuOption } from "./action-menu";

export type TableStyles = FluidStyles;

const Table = forwardRef(<T extends { [key: string]: string | number | Date; }>({ styles = {}, data, columns, selectable, sortable, selected, onSelect, columnFormatters = {}, rowActions, ...props }:
    {
        styles?: TableStyles;
        data: T[];
        columns: (keyof T)[];
        selectable?: boolean;
        sortable?: boolean | (keyof T)[];
        selected?: number[];
        onSelect?: (selected: number[]) => void;
        columnFormatters?: {
            [column in keyof T]?: (value: T[column]) => React.ReactNode;
        };
        rowActions?: (row: T) => ActionMenuOption[];
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {

    const style = useStyles(styles, {
        '.table': {
            backgroundColor: 'var(--f-clr-fg-100)',
            borderRadius: 'var(--f-radius-sml)',
            overflow: 'hidden',
            border: 'solid 1px var(--f-clr-fg-200)'
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
            borderBottom: 'solid 1px var(--f-clr-fg-200)'
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
    const [selectedIndices, setSelectedIndices] = selected !== undefined ? [selected] : useState<number[]>([]);

    function updateSelected(value: number[]) {
        setSelectedIndices?.(value);
        onSelect?.(value);
    }

    const rows = sorting !== 'nil' ?
        data.slice().sort((a, b) => {
            if (b[column] < a[column]) return sorting === 'asc' ? 1 : -1;
            if (b[column] > a[column]) return sorting === 'asc' ? -1 : 1;

            return 0;
        }) : data;

    const gridTemplateColumns = `${selectable ? 'auto' : ''} repeat(${columns.length}, 1fr) ${rowActions ? 'auto' : ''}`;

    const CheckboxStyles = { // merge with styles prop (also do for other components)
        '.checkbox': {
            border: 'solid 1px var(--f-clr-grey-300)'
        },

        '.checkmark': {
            stroke: 'var(--f-clr-text-200)'
        }
    };

    return <Scrollarea {...props} ref={ref} horizontal role="grid" className={classes(style.table, props.className)}>
        <div role="rowgroup" className={style.rows}>
            <div role="rowheader" className={classes(style.row, style.header)} style={{ gridTemplateColumns }}>
                {selectable && <div className={style.collapsed}>
                    <Checkbox size="xsm" color="var(--f-clr-text-100)" styles={CheckboxStyles} checked={selectedIndices.length === rows.length} onChange={e => {
                        if (!e.target.checked) return updateSelected([]);

                        updateSelected(new Array(rows.length).fill(0).map((_, i) => i));
                    }} />
                </div>}

                {columns.map((col, i) => {
                    const sort = Array.isArray(sortable) ? sortable.includes(col) : sortable;

                    return <div key={i} role="columnheader">
                        <Halo disabled={!sort}>
                            <button disabled={!sort} className={style.label} onClick={() => {
                                setColumn(col as string);

                                if (column !== col || sorting === 'nil') {
                                    setSorting('asc');
                                } else
                                    if (sorting === 'asc') {
                                        setSorting('dsc');
                                    } else {
                                        setSorting('nil');
                                    }
                            }}>
                                {col as string}

                                {(column !== col || sorting === 'nil') && sort && <MdSort />}
                                {column === col && sorting === 'asc' && <MdArrowUpward />}
                                {column === col && sorting === 'dsc' && <MdArrowDownward />}
                            </button>
                        </Halo>
                    </div>;
                })}

                {rowActions ? <div className={style.collapsed} /> : null}
            </div>

            {rows.map((row, i) => {

                return <Halo key={i} disabled={!selectable}>
                    <div role="row" className={style.row} style={{ gridTemplateColumns }}>
                        {selectable && <div className={style.collapsed}>
                            <Checkbox size="xsm" color="var(--f-clr-text-100)" styles={CheckboxStyles} checked={selectedIndices.includes(i)} onChange={e => {
                                const updated = selectedIndices.slice();
                                e.target.checked ? updated.push(i) : updated.splice(updated.indexOf(i), 1);

                                updateSelected(updated);
                            }} />
                        </div>}

                        {columns.map((col, i) => {
                            const formatter = columnFormatters[col] || (val => val.toString());

                            return <div key={i} role="gridcell">
                                {formatter(row[col])}
                            </div>;
                        })}

                        {rowActions ? <div className={style.collapsed}>
                            <ActionMenu options={rowActions(rows[i])}>
                                <Button variant="minimal" style={{ marginLeft: 'auto' }}>
                                    <MdMoreVert />
                                </Button>
                            </ActionMenu>
                        </div> : null}
                    </div>
                </Halo>;
            })}
        </div>
    </Scrollarea>;
});

Table.displayName = 'Table';

export default Table;