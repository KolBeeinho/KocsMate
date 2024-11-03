import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/build.css";
import "../styles/dashboard.css";
import "../styles/styles.css";
import { AuthProvider } from "../utils/providers/AuthContext";

function KocsMate({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>KocsMate</title>
        <meta name="description" content="Your page description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SessionProvider session={pageProps.session}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </SessionProvider>
    </>
  );
}

export default KocsMate;
