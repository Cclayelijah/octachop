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

  return (
    <ThemeProvider theme={theme}>
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
