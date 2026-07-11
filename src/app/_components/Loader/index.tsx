import { BarLoader } from "react-spinners";
import { cn } from "@/lib/utils";

export interface LoaderProps {
  isLoading: boolean;
  lightmode?: boolean;
}

const Loader = ({ isLoading, lightmode = false }: LoaderProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[1000] flex h-full w-full items-center justify-center",
        lightmode ? "bg-[#e6e6e6]" : "bg-[#121212]",
      )}
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

export default Loader;
