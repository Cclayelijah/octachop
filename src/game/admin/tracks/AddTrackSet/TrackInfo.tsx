import { Box, Button, TextField } from "@mui/material";
import React from "react";

type Props = {
  file: File;
};

export default function TrackInfo({ file }: Props) {
  
  return (
    <>
      <Box className="mobileStack" style={{ display: "flex", gap: "16px" }}>
        <TextField label="Title" style={{ flex: 1 }} required />
        <TextField label="Artist" style={{ flex: 1 }} required />
      </Box>
    </>
  );
}
