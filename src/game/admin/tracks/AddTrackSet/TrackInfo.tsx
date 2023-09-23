import { Box, Button, TextField } from "@mui/material";
import React from "react";
import { trpc } from "src/pages/_app";

type Props = {
  file: File;
};

export default function TrackInfo({ file }: Props) {
  // const track = await trpc.convertTrack.useQuery({ file });
  const hello = trpc.hello.useQuery({ text: "Elijah" });
  console.log(hello.data?.greeting);
  return (
    <>
      <Box className="mobileStack" style={{ display: "flex", gap: "16px" }}>
        <TextField label="Title" style={{ flex: 1 }} required />
        <TextField label="Artist" style={{ flex: 1 }} required />
      </Box>
    </>
  );
}
