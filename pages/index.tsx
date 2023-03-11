import Head from "next/head";
import dynamic from "next/dynamic";
import Image from "next/dist/client/image";
import MenuIcon from "@mui/icons-material/Menu";
import { draw, preload, setup, windowResized } from "p5/placeholder/home.p5";
import Landing from "p5/landing";

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

      <section className="flex items-center justify-center">
        <Landing />
      </section>
    </div>
  </>
);

export default Home;
