import Play from "src/game/play";
import Head from "next/head";

export const PlayPage = (): JSX.Element => (
  <>
    <div>
      <Head>
        <title>Octa Chop</title>
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>

      <section>
        <Play />
      </section>
    </div>
  </>
);

export default PlayPage;
