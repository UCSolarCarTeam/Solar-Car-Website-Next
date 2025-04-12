import { memo } from "react";
import { BarLoader } from "react-spinners";

export interface LoaderProps {
  isLoading: boolean;
  lightmode?: boolean;
}

const Loader = ({ isLoading, lightmode = false }: LoaderProps) => {
  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: lightmode ? "#e6e6e6" : "#121212",
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
        color={lightmode ? "#121212" : "#e6e6e6"}
        height="6px"
        loading={isLoading}
        width="148px"
      />
    </div>
  );
};

export default memo(Loader);
