import Skeleton from "../../../../components/common/skeleton/Skeleton";
import styles from "./searchGameCardSkeleton.module.css";

export const SearchGameCardSkeleton = () => {
    return (
        <div className={styles.skeletonCard}>
            <Skeleton
                width="100%"
                style={{
                    background: "transparent",
                    padding: 0,
                    height: "100%",
                }}
                layout={[
                    { type: "image", width: "100%", height: 150, radius: "10px 10px 0 0" },
                    { type: "title", width: "60%", height: 20 },
                    { type: "title", width: "40%", height: 18 },
                    {
                        type: "row",
                        gap: 8,
                        children: [
                            { type: "column", flex: 1, children: [{ type: "button", width: "100%", height: 36 }] },
                            { type: "column", flex: 2, children: [{ type: "button", width: "100%", height: 36 }] },
                            { type: "column", flex: 1, children: [{ type: "button", width: "100%", height: 36 }] },
                        ],
                    },
                ]}
            />
        </div>
    );
};
