import { memo } from "react";

import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return <SignIn withSignUp />;
};

export default memo(SignInPage);
