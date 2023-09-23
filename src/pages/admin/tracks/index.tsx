import Head from "next/head";
import AdminTracks from "src/game/admin/tracks/Tracks";

const Tracks = (): JSX.Element => (
  <>
    <div>
      <Head>
        <title>Octa Chop</title>
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>

      <section>
        <AdminTracks />
      </section>
    </div>
  </>
);

export default Tracks;
