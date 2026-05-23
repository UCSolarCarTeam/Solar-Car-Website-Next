import { type PropsWithChildren, memo, useState } from "react";

import styles from "@/app/_components/Buttons/index.module.scss";
import ConfirmModal from "@/app/_components/Modals/ConfirmModal";

export enum ButtonVariant {
  Default = "default",
  Delete = "delete",
}

const BasicButton = (
  props: PropsWithChildren<
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      variant?: ButtonVariant;
      onConfirmDelete?: () => void;
    }
  >,
) => {
  const {
    children,
    onClick,
    onConfirmDelete,
    variant = ButtonVariant.Default,
    ...rest
  } = props;

  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === ButtonVariant.Delete) {
      setShowConfirm(true);
    } else {
      onClick?.(e);
    }
  };

  return (
    <>
      <button
        className={`${styles.basicButton} ${variant === ButtonVariant.Delete ? styles.basicButtonRed : styles.basicButton}`}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </button>

      {variant === ButtonVariant.Delete && (
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
