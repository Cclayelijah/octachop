import Head from "next/head";
import AddSong from "src/game/admin/songs/AddSong";

const AddSongPage = (): JSX.Element => (
  <>
    <div>
      <Head>
        <title>Octa Chop</title>
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>

      <section>
        <AddSong />
      </section>
    </div>
  </>
);

export default AddSongPage;
