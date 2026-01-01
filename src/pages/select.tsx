import Select from "src/game/select";
import Head from "next/head";


export const SelectPage = (): JSX.Element => (
  <>
    <div>
      <Head>
        <title>Octa Chop</title>
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>

      <section>
        <Select />
      </section>
    </div>
  </>
);

export default SelectPage;