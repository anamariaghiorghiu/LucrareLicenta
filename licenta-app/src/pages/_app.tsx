import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import {Toaster} from "react-hot-toast";
import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import "../styles/style.css";
import GlobalContextProvider from "../contexts/GlobalContextPro";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Toaster/>
      <GlobalContextProvider>
        <Component {...pageProps} />
      </GlobalContextProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
