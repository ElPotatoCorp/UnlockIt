import Loading from "../../components/common/loading/Loading";
import styles from "./loader.module.css";

export function Loader() {
    return (
        <div className={styles.container}>
            <Loading />
        </div>
    );
}