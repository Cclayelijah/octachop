
import { UserProfile } from "@clerk/nextjs";
import Head from "next/head";
import PageHeading from "src/game/admin/PageHeading";
import { BodyContainer } from "src/game/admin/styles";

export const UserHome = (): JSX.Element => (
  <>
    <div>
      <Head>
        <title>Octa Chop</title>
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>

      <BodyContainer>
        <PageHeading title="My Profile" />
        <UserProfile />
      </BodyContainer>
    </div>
  </>
);

export default UserHome;
