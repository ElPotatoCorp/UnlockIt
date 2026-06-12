import styles from "./gameScroller.module.css";

interface Props<T> {
    items: T[];
    speed?: number;
    renderItem: (item: T, index: number) => React.ReactNode;
    className?: string;
}

export function GameScroller<T>({ items, speed = 25, renderItem, className }: Props<T>) {
    return (
        <div className={`${styles.scroller} ${className || ""}`}>
            <div
                className={styles.inner}
                style={{ animationDuration: `${speed}s` }}
            >
                {items.map(renderItem)}
                {items.map((item, i) => renderItem(item, i + items.length))}
            </div>
        </div>
    );
}
