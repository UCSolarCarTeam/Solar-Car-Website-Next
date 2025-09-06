import { memo } from "react";

import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return <SignIn />;
};

export default memo(SignInPage);
