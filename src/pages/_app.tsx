import { type AppType } from "next/app";
import { Saira } from "next/font/google";
import Head from "next/head";

import "@/styles/globals.scss";
import { api } from "@/utils/api";
import { ClerkProvider } from "@clerk/nextjs";

const saira = Saira({
  display: "swap",
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Calgary Solar Car</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <div className={saira.className}>
        <ClerkProvider>
          <Component {...pageProps} />
        </ClerkProvider>
      </div>
    </>
  );
};

export default api.withTRPC(MyApp);
