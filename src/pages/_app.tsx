import "src/styles/globals.css";
import { GoogleAnalytics } from "nextjs-google-analytics";
import type { AppType } from "next/app";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { useRouter } from "next/router";
import ErrorBoundary from "src/components/ErrorBoundary";
import Head from "next/head";
import { useEffect } from "react";
import { resetP5Sound } from "src/game/lib/p5SoundLoader";

const theme = createTheme({
  palette: {
    primary: {
      main: "#BEB7DF",
    },
    secondary: {
      main: "#171717",
    },
  },
  typography: {
    fontFamily: "roboto",
  },
});

const MyApp: AppType = ({ Component, pageProps }) => {
  const publicPages: Array<string> = ["/", "/sign-in", "/sign-up"];
  const { pathname } = useRouter();
  const isPublicPage = publicPages.includes(pathname);

  // Reset p5.sound state on hot reload in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      resetP5Sound();
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
      </Head>
      <GoogleAnalytics trackPageViews />
      <ErrorBoundary>
        <ClerkProvider>
          {isPublicPage ? (
            <Component {...pageProps} />
          ) : (
            <>
              <SignedIn>
                <Component {...pageProps} />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          )}
      </ClerkProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default MyApp;
