import Head from "next/head";
import AdminUsers from "src/game/admin/users/Users";

const Users = (): JSX.Element => (
  <>
    <div>
      <Head>
        <title>Octa Chop</title>
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>

      <section>
        <AdminUsers />
      </section>
    </div>
  </>
);

export default Users;
