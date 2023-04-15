import "src/styles/globals.css";
import Layout from "src/components/Layout";
import { GoogleAnalytics } from "nextjs-google-analytics";
// add `withTRPC()`-HOC here
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { purple } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: "#BEB7DF",
    },
    secondary: {
      main: "#171717",
    },
  },
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <GoogleAnalytics trackPageViews />
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
};

export default trpc.withTRPC(MyApp);
