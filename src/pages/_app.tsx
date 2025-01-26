import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/dashboard.css";
import "../styles/styles.css";
import { AuthProvider } from "../utils/providers/AuthContext";
import { DeviceProvider } from "../utils/providers/DeviceContext";
function KocsMate({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>KocsMate</title>
        <meta name="description" content="Your page description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <DeviceProvider>
        <SessionProvider session={pageProps.session}>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </SessionProvider>
      </DeviceProvider>
    </>
  );
}

export default KocsMate;
