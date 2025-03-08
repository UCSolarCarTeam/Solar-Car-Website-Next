import { memo } from "react";

import Loader from "@/app/_components/Loader";

const Loading = () => {
  return <Loader isLoading />;
};

export default memo(Loading);
