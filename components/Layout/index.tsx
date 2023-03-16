import Footer from "components/Footer";
import Nav from "components/Nav";

import type { FC } from "react";
interface Props {
  children: React.ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-grow flex-row">
      {/* <Nav /> */}
      <main className="" style={{ flex: "1" }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;

// import Head from "next/head";
// import Image from "next/image";
// import { Inter } from "next/font/google";
// import styles from "@/styles/Home.module.css";
// import Landing from "p5/landing";

// const inter = Inter({ subsets: ["latin"] });

// export default function Home() {
//   return (
//     <>
//       <Head>
//         <title>Create Next App</title>
//         <meta name="description" content="A rhythm game" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon/favicon.ico" />
//       </Head>
//       <main className={styles.main}>
//         <Nav />
//         {/* <Landing /> */}
//       </main>
//     </>
//   );
// }
