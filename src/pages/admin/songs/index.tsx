import Head from "next/head";
import AdminSongs from "src/game/admin/songs/Songs";

const Songs = (): JSX.Element => (
  <>
    <div>
      <Head>
        <title>Octa Chop</title>
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>

      <section>
        <AdminSongs />
      </section>
    </div>
  </>
);

export default Songs;
