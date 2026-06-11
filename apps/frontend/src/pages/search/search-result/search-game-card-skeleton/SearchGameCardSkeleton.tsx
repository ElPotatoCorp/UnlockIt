import { type FC } from "react";
import Skeleton from "../../../../components/common/skeleton/Skeleton";
import styles from "./searchGameCardSkeleton.module.css";

export const SearchGameCardSkeleton: FC = () => {
    return (
        <div className={styles.skeletonCard}>
            <Skeleton
                layout={[
                    { type: "image", height: 140, radius: 8 },

                    { type: "divider", spacing: 10 },

                    { type: "title", width: "60%", height: 18 },

                    { type: "divider", spacing: 8 },

                    { type: "text", lines: ["100%", "90%", "70%"], lineHeight: 10, gap: 6 },

                    { type: "divider", spacing: 12 },

                    { type: "title", width: "40%", height: 16 },

                    { type: "divider", spacing: 12 },

                    {
                        type: "row",
                        gap: 8,
                        children: [
                            { type: "button", width: 60, height: 28 },
                            { type: "button", width: 60, height: 28 },
                            { type: "button", width: 60, height: 28 },
                        ],
                    },
                ]}
            />
        </div>
    );
};