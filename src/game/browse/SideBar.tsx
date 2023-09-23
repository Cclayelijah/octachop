import { Box, Divider, Stack, Typography } from "@mui/material";
import React from "react";

type Props = {
  tracks: any;
  selectedTrack: number;
  setSelectedTrack: any;
};

export default function SideBar({
  tracks,
  selectedTrack,
  setSelectedTrack,
}: Props) {
  return (
    <Box id="score-board" width={300} sx={{ height: "100vh", padding: 2 }}>
      <Box height={32}></Box>
      <Typography variant="h6">Difficulty</Typography>
      <Divider
        color="#ffffff"
        sx={{
          marginTop: 1,
          display: "block",
          height: 2,
          boxShadow: "0px 0px 0px #ffffff 12px",
        }}
      />
      <Stack></Stack>
    </Box>
  );
}
