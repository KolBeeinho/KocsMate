import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/build.css";
import "../styles/styles.scss";
import { AuthProvider } from "../utils/providers/AuthContext";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>KocsMate</title>
        <meta name="description" content="Your page description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="shortcut icon"
          href="../../public/images/favicon.ico"
          type="image/x-icon"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <SessionProvider session={pageProps.session}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
