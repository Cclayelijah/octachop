import { Box, Button, TextField } from "@mui/material";
import React from "react";

type Props = {
  title: string,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  titleUnicode: string,
  setTitleUnicode: React.Dispatch<React.SetStateAction<string>>,
  artist: string,
  setArtist: React.Dispatch<React.SetStateAction<string>>,
  artistUnicode: string,
  setArtistUnicode: React.Dispatch<React.SetStateAction<string>>
};

export default function SongInfo({ 
  title, 
  setTitle, 
  titleUnicode, 
  setTitleUnicode,
  artist, 
  setArtist,
  artistUnicode,
  setArtistUnicode
 }: Props) {
  
  return (
    <>
      <Box className="mobileStack" style={{ display: "flex", gap: "16px" }}>
        <TextField label="Title" style={{ flex: 1 }} value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }} required />
        <TextField label="TitleUnicode" style={{ flex: 1 }} value={titleUnicode} 
          onChange={(e) => {
            setTitleUnicode(e.target.value);
          }} required />
      </Box>
      <Box className="mobileStack" style={{ display: "flex", gap: "16px" }}>
        <TextField label="Artist" style={{ flex: 1 }} value={artist}
          onChange={(e) => {
            setArtist(e.target.value);
          }} required />
        <TextField label="ArtistUnicode" style={{ flex: 1 }} value={artistUnicode} 
          onChange={(e) => {
            setArtistUnicode(e.target.value);
          }} required />
      </Box>
    </>
  );
}
