import { type PropsWithChildren, memo, useState } from "react";

import styles from "@/app/_components/Buttons/index.module.scss";
import ConfirmModal from "@/app/_components/Modals/ConfirmModal";

const BasicButton = (
  props: PropsWithChildren<
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      variant?: "default" | "delete";
      onConfirmDelete?: () => void;
    }
  >,
) => {
  const {
    children,
    onClick,
    onConfirmDelete,
    variant = "default",
    ...rest
  } = props;

  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === "delete") {
      setShowConfirm(true);
    } else {
      onClick?.(e);
    }
  };

  return (
    <>
      <button
        className={`${styles.basicButton} ${variant === "delete" ? styles.basicButtonRed : styles.basicButton}`}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </button>

      {variant === "delete" && (
        <ConfirmModal
          cancelText="Cancel"
          confirmText="Yes, delete"
          message="Are you sure you want to delete this item?"
          onClose={() => setShowConfirm(false)}
          onConfirm={() => {
            onConfirmDelete?.();
            setShowConfirm(false);
          }}
          open={showConfirm}
          title="Delete Item"
        />
      )}
    </>
  );
};

export default memo(BasicButton);
