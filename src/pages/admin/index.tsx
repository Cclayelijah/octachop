import Head from "next/head";
import Admin from "src/game/admin";

export const AdminHome = (): JSX.Element => (
  <>
    <div>
      <Head>
        <title>Octa Chop</title>
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>

      <section>
        <Admin />
      </section>
    </div>
  </>
);

export default AdminHome;
