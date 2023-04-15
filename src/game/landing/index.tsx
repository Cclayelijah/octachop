// @ts-nocheck
import { FC, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  draw,
  keyPressed,
  mouseClicked,
  preload,
  setup,
  windowResized,
} from "./sketch";
import { trpc } from "src/utils/trpc";
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
} from "@mui/material";
import { Box } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ArrowDropDownCircle, Password } from "@mui/icons-material";
import { Stack } from "@mui/system";
import Link from "next/link";
// Will only import `react-p5` on client-side
const Sketch = dynamic(
  () =>
    import("react-p5").then((mod) => {
      // importing sound lib ONLY AFTER REACT-P5 is loaded
      // require("p5/lib/addons/p5.sound");
      require("../lib/p5.sound");
      // returning react-p5 default export
      return mod.default;
    }),
  {
    ssr: false,
  }
);

const Landing: FC = () => {
  const [loggingIn, setLoggingIn] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("username:" + username);
    console.log("password:" + password);
    setLoggingIn(false);
    setAuthenticating(true);
  };

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
          <Box></Box>
          <Box>
            {authenticating ? (
              <Skeleton
                variant="rectangular"
                animation="wave"
                width={210}
                height={60}
              />
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={() => {
                    setLoggingIn(!loggingIn);
                  }}
                  color={loggingIn ? "primary" : "inherit"}
                  style={{
                    color: "black",
                    fontWeight: "700",
                    paddingLeft: "4px",
                    paddingRight: "4px",
                    border: "2px solid black",
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography mx={1}>Login</Typography>
                  <ArrowDropDownCircle />
                </Button>
                {loggingIn && (
                  <Stack
                    width={300}
                    bgcolor="white"
                    color="#171717"
                    padding={2}
                    border="2px solid black"
                    marginTop={1}
                    borderRadius={1}
                  >
                    <Box mb={1}>
                      <InputLabel>username</InputLabel>
                      <Input
                        fullWidth
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                        }}
                        autoFocus
                      ></Input>
                    </Box>
                    <Box mb={1}>
                      <InputLabel>password</InputLabel>
                      <Input
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      ></Input>
                    </Box>
                    <Box mb={1}>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Remember me?"
                      />
                    </Box>
                    <Box mb={1}>
                      <Button variant="contained" onClick={handleLogin}>
                        Login
                      </Button>
                    </Box>
                    <Box mb={1}>
                      <Divider />
                    </Box>
                    <Stack>
                      <Button size="xs" style={{ textAlign: "left" }}>
                        Sign up
                      </Button>
                      <Button size="xs" style={{ textAlign: "left" }}>
                        Forgot your password?
                      </Button>
                    </Stack>
                  </Stack>
                )}
              </>
            )}
          </Box>
        </Box>
        <Typography>world</Typography>
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
