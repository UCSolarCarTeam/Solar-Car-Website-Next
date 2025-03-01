import { type PropsWithChildren, memo } from "react";

import styles from "@/components/Buttons/index.module.scss";

const BasicButton = (
  props: PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>,
) => {
  return (
    <button
      className={styles.basicButton}
      onClick={props.onClick}
      style={props.style}
    >
      {props.children}
    </button>
  );
};

export default memo(BasicButton);
