// @ts-nocheck
import { FC, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  draw,
  keyPressed,
  mouseClicked,
  mouseWheel,
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
import { loadP5Sound } from "../lib/p5SoundLoader";
import { setActiveSketch } from "../lib/sketchManager";
import SettingsDrawer from "./components/SettingsDrawer";
import ProfileCard from "./components/ProfileCard";
import GoSelect from "./components/GoSelect";
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
  // Settings drawer state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
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
    <Box sx={{ overflow: 'hidden', height: '100vh', width: '100vw' }}>
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
        sx={{ 
          zIndex: 1000, 
          pointerEvents: 'none' // Make container transparent to clicks
        }}
      >
        <ProfileCard isSettingsOpen={isSettingsOpen} />
        <GoSelect 
          isSettingsOpen={isSettingsOpen} 
          onSettingsToggle={() => setIsSettingsOpen(!isSettingsOpen)}
        />
      </Box>
      
      <SettingsDrawer 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      
      <style jsx>{`
        :global(*) {
          cursor: url('/cursor/white-7.png') 7 7, auto !important;
        }
        :global(canvas) {
          cursor: url('/cursor/white-7.png') 7 7, auto !important;
          cursor: -webkit-image-set(url('/cursor/white-7.png') 1x) 7 7, auto !important;
        }
      `}</style>
      <Sketch
        preload={preload}
        setup={setup}
        draw={draw}
        windowResized={windowResized}
        mouseClicked={mouseClicked}
        mouseWheel={(p5, event) => mouseWheel(p5, event, isSettingsOpen)}
        keyPressed={keyPressed}
      />
    </Box>
  );
};

export default Landing;
