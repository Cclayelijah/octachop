import Head from "next/head";
import AdminUsers from "src/game/admin/users/Users";
import AdminRoute from "src/components/AdminRoute";

const Users = (): JSX.Element => (
  <>
    <div>
      <Head>
        <title>User Management - Admin Panel - Octa Chop</title>
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>

      <section>
        <AdminRoute>
          <AdminUsers />
        </AdminRoute>
      </section>
    </div>
  </>
);

export default Users;
