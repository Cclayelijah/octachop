import Head from "next/head";
import dynamic from "next/dynamic";
import Landing from "src/game/landing";

export const Home = (): JSX.Element => {
  return (
    <>
      <div>
        <Head>
          <title>Octa Chop</title>
          <link rel="icon" href="/favicon/favicon.ico" />
        </Head>

        <section>
          <Landing />
        </section>
      </div>
    </>
  );
};

export default Home;
