import Loading from "../../components/ui/loading/Loading";
import styles from "./loader.module.css";

export function Loader() {
    return (
        <div className={styles.container}>
            <Loading />
        </div>
    );
}