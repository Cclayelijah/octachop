// @ts-nocheck
import { FC, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  draw,
  keyPressed,
  mouseClicked,
  preload,
  setup,
  windowResized,
} from "./sketch";
import {
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Icon,
  IconButton,
  Input,
  InputLabel,
  Skeleton,
  Typography,
  colors,
} from "@mui/material";
import { Box } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ArrowDropDownCircle, Password } from "@mui/icons-material";
import { Stack } from "@mui/system";
import Link from "next/link";
import { clickCheck, handleClick } from "./utils";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { loadP5Sound } from "../lib/p5SoundLoader";
import { setActiveSketch } from "../lib/sketchManager";
// Will only import `react-p5` on client-side
const Sketch = dynamic(
  () =>
    import("react-p5").then(async (mod) => {
      // Set this as the active sketch
      setActiveSketch('landing');
      // Load p5.sound safely to prevent AudioWorklet duplicate registration
      await loadP5Sound();
      // returning react-p5 default export
      return mod.default;
    }),
  {
    ssr: false,
  }
);

const Landing: FC = () => {
  // const [loggingIn, setLoggingIn] = useState(false);
  // const [authenticating, setAuthenticating] = useState(false);
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");

  // Set as active when component mounts, cleanup when unmounts
  useEffect(() => {
    setActiveSketch('landing');
    return () => {
      setActiveSketch(null);
    };
  }, []);

  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   console.log("username:" + username);
  //   console.log("password:" + password);
  //   setLoggingIn(false);
  //   setAuthenticating(true);
  // };

  return (
    <Box>
      <Box
        position="absolute"
        height="100%"
        width="100%"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        left={0}
        top={0}
        padding={2}
      >
        <Box display="flex" justifyContent="space-between">
          <Image src="/images/logo.png" alt="Logo Button" width={70} height={120} />
          <UserButton />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Image src="/images/settings.png" alt="Settings" width={60} height={60} />
          <Link href="/browse">
            <Image src="/images/arrow1.png" alt="Start Button" width={100} height={60} />
          </Link>
        </Box>
      </Box>
      <Sketch
        preload={preload}
        setup={setup}
        draw={draw}
        windowResized={windowResized}
        mouseClicked={mouseClicked}
        keyPressed={keyPressed}
      />
    </Box>
  );
};

export default Landing;
