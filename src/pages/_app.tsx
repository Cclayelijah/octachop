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
import { useState } from "react";
import type { AppRouter } from "../server/routers/_app";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const trpc = createTRPCReact<AppRouter>();

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
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/trpc",
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
      ],
    })
  );
  return (
    <ThemeProvider theme={theme}>
      <GoogleAnalytics trackPageViews />
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </trpc.Provider>
    </ThemeProvider>
  );
};

export default MyApp;
