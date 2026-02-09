import Footer from "../_components/Footer";
import Navbar from "../_components/Navbar";
import styles from "./index.module.scss";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.maincontainer}>
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
