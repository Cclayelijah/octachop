import Head from "next/head";
import AddSong from "src/game/admin/songs/AddSong";
import AdminRoute from "src/components/AdminRoute";

const AddSongPage = (): JSX.Element => (
  <>
    <div>
      <Head>
        <title>Add Song - Admin Panel - Octa Chop</title>
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>

      <section>
        <AdminRoute>
          <AddSong />
        </AdminRoute>
      </section>
    </div>
  </>
);

export default AddSongPage;
