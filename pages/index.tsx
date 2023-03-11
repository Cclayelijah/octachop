import Head from "next/head";
import dynamic from "next/dynamic";
import Landing from "game/landing";

const Sketch = dynamic(
  import("react-p5").then((mod) => {
    // importing sound lib ONLY AFTER REACT-P5 is loaded
    require("p5/lib/addons/p5.sound");
    // returning react-p5 default export
    return mod.default;
  }),
  { ssr: false }
);

export const Home = (): JSX.Element => (
  <>
    <div>
      <Head>
        <title>Octa Chop</title>
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>

      <section>
        <Landing />
      </section>
    </div>
  </>
);

export default Home;
