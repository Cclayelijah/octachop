import styled from "@emotion/styled";
import { Box, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
var duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

type Props = {
  key: number;
  title: string;
  artist: string;
  audio: string;
  duration: number;
  imageDir: string;
  defaultImage: string;
  selected: boolean;
  tracks: any;
  selectedTrack: number;
};

const TrackSet = ({
  key,
  title,
  artist,
  audio,
  duration,
  imageDir,
  defaultImage,
  selected,
  tracks,
  selectedTrack,
}: Props) => {
  const [background, setBackground] = useState(defaultImage);

  const updateBg = () => {
    if (tracks[selectedTrack]?.bgImage)
      setBackground(imageDir + tracks[selectedTrack].bgImage);
  };

  useEffect(() => {
    if (selected) {
      updateBg();
    }
  }, [selected]);
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        margin: "16px 0px 0px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          position: "absolute",
          left: 0,
          top: 0,
          opacity: 0.5,
        }}
      ></div>
      <Stack
        p={1.5}
        borderRadius={1}
        border={`solid 2px #${selected ? "FFFFFF" : "BEB7DF"}`}
        height={150}
        justifyContent="space-between"
        position="relative"
      >
        <Box display="flex" justifyContent="space-between">
          <Box>{/* heart icon */}</Box>
          <Duration>
            <Typography>{dayjs.duration(duration).format("mm:ss")}</Typography>
          </Duration>
        </Box>
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography>{artist}</Typography>
        </Box>
      </Stack>
    </div>
  );
};

const Duration = styled.div`
  background-color: #beb7df;
  border-radius: 4px;
  padding: 0px 4px;
  color: black;
`;

export default TrackSet;
