import Head from "next/head";
import Admin from "src/game/admin";
import AdminRoute from "src/components/AdminRoute";

export const AdminHome = (): JSX.Element => (
  <>
    <div>
      <Head>
        <title>Admin Panel - Octa Chop</title>
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>

      <section>
        <AdminRoute>
          <Admin />
        </AdminRoute>
      </section>
    </div>
  </>
);

export default AdminHome;
