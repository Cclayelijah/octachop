import Browse from "game/browse";
import Head from "next/head";

export const BrowsePage = (): JSX.Element => (
  <>
    <div>
      <Head>
        <title>Octa Chop</title>
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>

      <section>
        <Browse />
      </section>
    </div>
  </>
);

export default BrowsePage;
