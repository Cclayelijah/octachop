import React from "react";
import dynamic from "next/dynamic";
import { draw, preload, setup, windowResized } from "./sketch";
// Will only import `react-p5` on client-side
const Sketch = dynamic(
  () =>
    import("react-p5").then((mod) => {
      // importing sound lib ONLY AFTER REACT-P5 is loaded
      require("p5/lib/addons/p5.sound");
      // returning react-p5 default export
      return mod.default;
    }),
  {
    ssr: false,
  }
);

interface ComponentProps {
  //Your component props
}

const Landing: React.FC<ComponentProps> = (props: ComponentProps) => {
  //See annotations in JS for more information
  return (
    <Sketch
      preload={preload}
      setup={setup}
      draw={draw}
      windowResized={windowResized}
    />
  );
};

export default Landing;
