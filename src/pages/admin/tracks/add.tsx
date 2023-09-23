import Head from "next/head";
import AddTrackSet from "src/game/admin/tracks/AddTrackSet";

const AddTrackSetPage = (): JSX.Element => (
  <>
    <div>
      <Head>
        <title>Octa Chop</title>
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>

      <section>
        <AddTrackSet />
      </section>
    </div>
  </>
);

export default AddTrackSetPage;
