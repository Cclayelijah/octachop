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
import { UserButton } from "@clerk/nextjs";
import { loadP5Sound } from "../lib/p5SoundLoader";
import { setActiveSketch } from "../lib/sketchManager";
import SettingsDrawer from "./components/SettingsDrawer";
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
        sx={{ 
          zIndex: 1000, 
          pointerEvents: 'none' // Make container transparent to clicks
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <Box 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            sx={{ 
              pointerEvents: 'auto',
              transition: 'all 0.3s ease',
              transform: isSettingsOpen ? 'translateX(400px)' : 'translateX(0)',
              '@media (max-width: 900px)': {
                transform: isSettingsOpen ? 'translateX(300px)' : 'translateX(0)',
              },
              '@media (max-width: 600px)': {
                transform: isSettingsOpen ? 'translateX(200px)' : 'translateX(0)',
              },
              '&:hover': {
                transform: isSettingsOpen ? 'translateX(400px) scale(1.02)' : 'scale(1.02)',
                '@media (max-width: 900px)': {
                  transform: isSettingsOpen ? 'translateX(300px) scale(1.02)' : 'scale(1.02)',
                },
                '@media (max-width: 600px)': {
                  transform: isSettingsOpen ? 'translateX(200px) scale(1.02)' : 'scale(1.02)',
                },
                filter: 'drop-shadow(0 0 10px rgba(190, 183, 223, 0.3))',
              }
            }}
          >
            <Image src="/images/logo.png" alt="Logo Button" width={70} height={120} />
          </Box>
          <Box
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            sx={{ 
              pointerEvents: 'auto',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                filter: 'drop-shadow(0 0 10px rgba(190, 183, 223, 0.4))',
              }
            }}
          >
            <UserButton />
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Box 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsSettingsOpen(!isSettingsOpen);
            }} 
            sx={{ 
              cursor: 'pointer', 
              pointerEvents: 'auto',
              transition: 'all 0.3s ease',
              transform: isSettingsOpen ? 'translateX(400px)' : 'translateX(0)',
              animation: isSettingsOpen ? 'none' : 'settingsPulse 3s ease-in-out infinite',
              '@media (max-width: 900px)': {
                transform: isSettingsOpen ? 'translateX(300px)' : 'translateX(0)',
              },
              '@media (max-width: 600px)': {
                transform: isSettingsOpen ? 'translateX(200px)' : 'translateX(0)',
              },
              '&:hover': {
                transform: isSettingsOpen 
                  ? 'translateX(400px) scale(1.1) rotate(15deg)' 
                  : 'scale(1.1) rotate(15deg)',
                '@media (max-width: 900px)': {
                  transform: isSettingsOpen 
                    ? 'translateX(300px) scale(1.1) rotate(15deg)' 
                    : 'scale(1.1) rotate(15deg)',
                },
                '@media (max-width: 600px)': {
                  transform: isSettingsOpen 
                    ? 'translateX(200px) scale(1.1) rotate(15deg)' 
                    : 'scale(1.1) rotate(15deg)',
                },
                filter: 'drop-shadow(0 0 15px rgba(190, 183, 223, 0.8))',
                animation: 'none', // Stop pulsing on hover
              },
              '&:active': {
                transform: isSettingsOpen 
                  ? 'translateX(400px) scale(0.95)' 
                  : 'scale(0.95)',
                '@media (max-width: 900px)': {
                  transform: isSettingsOpen 
                    ? 'translateX(300px) scale(0.95)' 
                    : 'scale(0.95)',
                },
                '@media (max-width: 600px)': {
                  transform: isSettingsOpen 
                    ? 'translateX(200px) scale(0.95)' 
                    : 'scale(0.95)',
                },
              },
              '@keyframes settingsPulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.03)' },
                '100%': { transform: 'scale(1)' },
              }
            }}
          >
            <Image src="/images/settings.png" alt="Settings" width={60} height={60} />
          </Box>
          <Box
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            sx={{ 
              pointerEvents: 'auto',
              transition: 'all 0.3s ease',
              animation: 'arrowBounce 4s ease-in-out infinite',
              '&:hover': {
                transform: 'scale(1.05) translateX(-5px)',
                filter: 'drop-shadow(0 0 20px rgba(190, 183, 223, 0.6))',
                animation: 'none', // Stop bouncing on hover
              },
              '&:active': {
                transform: 'scale(0.98)',
              },
              '@keyframes arrowBounce': {
                '0%': { transform: 'translateX(0)' },
                '25%': { transform: 'translateX(-3px)' },
                '50%': { transform: 'translateX(0)' },
                '75%': { transform: 'translateX(-1px)' },
                '100%': { transform: 'translateX(0)' },
              }
            }}
          >
            <Link href="/select">
              <Image src="/images/arrow1.png" alt="Start Button" width={100} height={60} />
            </Link>
          </Box>
        </Box>
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
