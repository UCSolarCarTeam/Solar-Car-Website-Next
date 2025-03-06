import { memo } from "react";
import { BarLoader } from "react-spinners";

export interface LoaderProps {
  isImageLoading: boolean;
}

const Loader = ({ isImageLoading }: LoaderProps) => {
  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: "#121212",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        left: 0,
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <BarLoader
        color="#e6e6e6"
        height="6px"
        loading={isImageLoading}
        width="148px"
      />
    </div>
  );
};

export default memo(Loader);
