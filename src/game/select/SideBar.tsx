import { Box, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

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
    <Box id="score-board" width={300} sx={{ height: "100vh", padding: 2, display: "flex", flexDirection: "column" }}>
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
      <Stack sx={{flex:1}}>
        <Typography>5</Typography>
      </Stack>
      <Box>
        <Link href="/play">
          <Box sx={{backgroundColor:'ffffff', textAlign:"right", display:"flex", alignItems:"flex-end", justifyContent:"flex-end"}}>
            <Typography fontSize={80} sx={{lineHeight:0}}><PlayCircleOutlineIcon fontSize="inherit" /></Typography>
          </Box>
        </Link>
      </Box>
    </Box>
  );
}
