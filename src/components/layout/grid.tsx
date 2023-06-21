// 'use client';

import useStyles from "@/src/hooks/use-styles";
import { FluidSize } from "@/src/types";
import { Children, cloneElement, forwardRef } from "react";

type GridItemProps = { row?: number; col?: number; } & React.HTMLAttributes<HTMLDivElement>;
type GridItem = React.ReactElement<GridItemProps>;

const Item = forwardRef(({ children, row = 1, col = 1, ...props }: GridItemProps, ref: React.ForwardedRef<HTMLDivElement>) => {

    return <div ref={ref} {...props} style={{ gridColumn: `span ${col}`, gridRow: `span ${row}`, ...props.style }}>
        {children}
    </div>;
});

Item.displayName = 'Grid.Item';

type GridProps = {
    children: GridItem | GridItem[];
    columns: number;
    spacing?: 'none' | FluidSize;
    masonry?: boolean;
    fill?: boolean;
} & Omit<React.HtmlHTMLAttributes<HTMLDivElement>, 'children'>;

const Grid: React.ForwardRefExoticComponent<GridProps> & { Item: typeof Item } = forwardRef(({ children, columns, spacing = 'sml', masonry, fill, ...props }: GridProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles({
        '.grid': {
            display: 'grid',
            gap: spacing === 'none' ? undefined : `var(--f-spacing-${spacing})`
        },

        '.column': {
            display: 'flex',
            flexDirection: 'column',
            gap: spacing === 'none' ? undefined : `var(--f-spacing-${spacing})`
        }
    });

    let cols = 0;
    const arr = Children.toArray(children) as GridItem[];
    const columnArrays: GridItem[][] = new Array(columns).fill(0).map(() => []);

    arr.forEach((child, i) => {
        const childCols = cols + (child.props.col || 1);
        cols = childCols <= columns ? childCols : (child.props.col || 1);
        if (masonry) columnArrays[i % columns].push(child);
    });

    return <div ref={ref} {...props} className={style.grid} style={{ ...props.style, gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {masonry ?
            columnArrays.map((arr, i) => {
                return <div key={i} className={style.column}>
                    {arr.map((child, i) => {
                        if (fill && i === arr.length - 1) return cloneElement(child, {
                            style: {
                                ...child.props.style,
                                flexGrow: 1
                            }
                        });

                        return child;
                    })}
                </div>;
            }) :
            arr.map((child, i) => {
                if (fill && i === arr.length - 1) return cloneElement(child, {
                    style: {
                        ...child.props.style,
                        gridColumn: `${cols} / -1`
                    }
                });

                return child;
            })
        }
    </div>;
}) as any;

Grid.Item = Item;
Grid.displayName = 'Grid';

export default Grid;

// auto columns size