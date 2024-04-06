import styled from "@emotion/styled";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Input,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import PageHeading from "../../PageHeading";
import Panel from "../../Panel";
import { BodyContainer } from "../../styles";
import TrackInfo from "./TrackInfo";
import { createClient } from "@supabase/supabase-js";
import { any } from "zod";
import extractData from "src/game/extractData";

const supabaseurl = process.env.SUPABASE_URL ?? ""
const supabasekey = process.env.SUPABASE_KEY ?? ""
const supabase = createClient('https://mzvkxfaggqbdhudnwxqc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16dmt4ZmFnZ3FiZGh1ZG53eHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU2MzU5NDgsImV4cCI6MTk5MTIxMTk0OH0.KKyF_AG_673jbl4paQhJMjujo47_dltC_U6iRhEHWyk');

type Props = {};
type MyImage = {
  url: string;
  name: string;
  file: File;
};
type SongData = {
  title: string,
  titleUnicode: string,
  artist: string,
  artistUnicode: string,
  beatmapSetId: number
}
type LevelData = {
  beatmapId: number,
  difficulty: number,
  image: string,
  approachRate: number,
  noteData: any[],
  breakData: any[]
}
type Song = {
  songId: number,
  beatmapSetId: number,
  songUrl: string,
  defaultImg: string,
  title: string,
  titleUnicode: string,
  artist: string,
  artistUnicode: string,
  active: boolean
}
type Level = {
  levelId?: number,
  songId?: number,
  beatmapId: number,
  difficulty: number,
  image: string,
  approachRate: number,
  noteData: any[],
  breakData: any[],
  beatmapUrl: string,
  active?: boolean
}

export default function AddTrackSet({}: Props) {
  const [images, setImages] = useState<MyImage[]>([]);
  const [defaultImage, setDefaultImage] = useState<string>();
  const [trackFiles, setTrackFiles] = useState<File[]>([]);
  const [songFile, setSongFile] = useState<File>();
  const [levelData, setLevelData] = useState<LevelData[]>([])
  const [songTitle, setSongTitle] = useState('')
  const [songTitleUnicode, setSongTitleUnicode] = useState('')
  const [songArtist, setSongArtist] = useState('')
  const [songArtistUnicode, setSongArtistUnicode] = useState('')
  const [beatmapSetId, setBeatmapSetId] = useState('')

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // 1. save images in supabase bucket
    if (beatmapSetId === '') {
      console.log('BeatmapSetId Could not be found.')
      return;
    }
    const setDir = beatmapSetId + "/"
    const imagePath = 'https://mzvkxfaggqbdhudnwxqc.supabase.co/storage/v1/object/public/track-image/' + setDir
    images.forEach(async image => {
      console.log('Saving image file: ' + setDir + image.name)
      const { data, error } = await supabase
        .storage
        .from('track-image')
        .upload(setDir + image.name, image.file, {
          cacheControl: '3600',
          upsert: false
        })
      if (error) {
        console.log('Image upload failed: ' + error.message)
      } else {
        console.log('Image saved at path: ' + data?.path)
      }
    })
    // 2. save the audio file to supabase bucket
    console.log('Saving audio file: ' + setDir + songFile?.name)
    const songPath = 'https://mzvkxfaggqbdhudnwxqc.supabase.co/storage/v1/object/public/set-audio/' + setDir + songFile?.name
    if (songFile) {
      const { data, error } = await supabase
        .storage
        .from('set-audio')
        .upload(setDir + songFile?.name, songFile, {
          cacheControl: '3600',
          upsert: false
        })
      if (error) {
        console.log('Audio upload failed: ' + error.message)
      } else {
        console.log('Audio saved at path: ' + data?.path)
      }
    } else {
      console.log('Audio file not found.')
    }
    // 3. configure levels
    const levels: Level[] = []
    for (let i=0; i < trackFiles.length; i++) {
      const track = trackFiles[i]
      const level = levelData[i]
      console.log('Saving track file: ' + setDir + track?.name)
      const trackPath = 'https://mzvkxfaggqbdhudnwxqc.supabase.co/storage/v1/object/public/track-data/' + setDir + track?.name
      const { data, error } = await supabase
        .storage
        .from('set-audio')
        .upload(setDir + songFile?.name, track, {
          cacheControl: '3600',
          upsert: false
        })
      if (error) {
        console.log('Track upload failed: ' + error.message)
      } else {
        console.log('Track saved at path: ' + data?.path)
      }
      // const levelResponse = await fetch('http://localhost:3000/api/level', {
      //   method: "POST",
      //   mode: "cors",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     ...level,
      //     beatmapUrl: trackPath,
      //   })
      // })
      // console.log(levelResponse.body)
      levels.push({
        ...level,
        beatmapUrl: trackPath,
      })
    }
    // 4. add song to db
    const defaultImg = imagePath + defaultImage
    const songData = {
      beatmapSetId: Number(beatmapSetId),
      defaultImg,
      songUrl: songPath,
      title: songTitle,
      titleUnicode: songTitleUnicode,
      artist: songArtist,
      artistUnicode: songArtistUnicode
    }
    const response = await fetch('http://localhost:3000/api/song', {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        songData,
        levels
      })
    })
    const song: any = response.body
    if (!song){
      console.log("Song could not be found.")
      return
    }
    if (response.ok) {
      console.log('Song was saved successfully.')
    } else {
      console.log('Song could not be saved - Error ' + response.status + ". " + response.statusText)
      return;
    }
    
  };

  const extractSongData = async (file:File) => {
    const text = await file.text()
    const {
      title,
      titleUnicode,
      artist,
      artistUnicode,
      beatmapSetId
    } = await extractData(text)
    setSongTitle(title)
    setSongTitleUnicode(titleUnicode)
    setSongArtist(artist)
    setSongArtistUnicode(artistUnicode)
    setBeatmapSetId(beatmapSetId)
  }

  const extractLevelData = async (file:File): Promise<LevelData> => {
    const text = await file.text()
    const {
      beatmapId,
      difficulty,
      image,
      approachRate,
      noteData,
      breakData
    } = await extractData(text)
    return {
      beatmapId: Number(beatmapId),
      difficulty: Number(difficulty),
      image,
      approachRate,
      noteData,
      breakData
    }
  }

  const updateImages = (e: any) => {
    e.preventDefault();
    let imageFiles = [...e.target.files];
    let imageList: MyImage[] = [];
    imageFiles &&
      imageFiles.length > 0 &&
      imageFiles.map((imageFile, index) => {
        if (index == 0) {
          setDefaultImage(imageFile.name);
        }
        imageList.push({
          url: URL.createObjectURL(imageFile),
          name: imageFile.name,
          file: imageFile,
        });
      });
    setImages(imageList);
  };

  const updateTracks = async (e: any) => {
    e.preventDefault();
    const files: File[] = [...e.target.files];
    const levels: LevelData[] = []
    for (let i=0; i<files.length; i++){
      if (i === 0) {
        extractSongData(files[0])
      }
      const levelData: LevelData = await extractLevelData(files[i])
      levels.push(levelData)
    }
    setLevelData(levels)
    setTrackFiles(files);
  };

  const updateSong = (e: any) => {
    e.preventDefault();
    const file: File = e.target.files[0];
    setSongFile(file);
  };

  const updateDefaultImage = (e: any) => {
    e.preventDefault();
    setDefaultImage(e.target.value as string);
  };

  return (
    <Box display="flex" bgcolor="#ffffff" color="#000000">
      <Panel />
      <BodyContainer>
        <PageHeading title="Add Song Tracks" />
        <PageContent>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              width: "100%",
              maxWidth: "1200px",
              margin: "0 auto",
              alignContent: "flex-start",
            }}
            autoComplete="off"
          >
            <Box
              className="mobileStack"
              style={{ display: "flex", gap: "16px" }}
            >
              <Box flex={1}>
                <Typography>Images (.jpeg, .jpg, .png)</Typography>
                <input
                  type="file"
                  accept="image/png,.jpg,.jpeg"
                  onChange={updateImages}
                  multiple
                  required
                />
                <Box
                  style={{
                    height: 200,
                    backgroundColor: "#eee",
                    borderRadius: 8,
                    padding: 8,
                    marginTop: 8,
                    overflowY: "scroll",
                    whiteSpace: "initial",
                    alignItems: "flex-start",
                    display: "flex",
                    flexWrap: "wrap",
                  }}
                >
                  {images &&
                    images.map((image) => {
                      return (
                        <Stack
                          style={{
                            padding: 8,
                          }}
                        >
                          <Image
                            src={image.url}
                            width={160}
                            height={90}
                            alt="Uploaded Image"
                            style={{
                              borderRadius: 4,
                              width: "fit-content",
                              minWidth: 40,
                            }}
                          />
                          <Typography
                            width="fit-content"
                            style={{ overflowWrap: "anywhere" }}
                            fontSize={12}
                          >
                            {image.name}
                          </Typography>
                        </Stack>
                      );
                    })}
                </Box>
              </Box>
              <Box flex={1}>
                <Typography>Tracks (.osu)</Typography>
                <input
                  type="file"
                  accept=".osu"
                  onChange={updateTracks}
                  multiple
                  required
                />
                <Box
                  style={{
                    height: 200,
                    backgroundColor: "#eee",
                    borderRadius: 8,
                    marginTop: 8,
                    overflowY: "scroll",
                    whiteSpace: "initial",
                    alignItems: "center",
                  }}
                >
                  <List itemType="">
                    {trackFiles &&
                      trackFiles.map((file) => {
                        return (
                          <ListItem>
                            <Typography>{file.name}</Typography>
                          </ListItem>
                        );
                      })}
                  </List>
                </Box>
              </Box>
            </Box>
            <Box
              className="mobileStack"
              style={{ display: "flex", gap: "16px" }}
            >
              <Box flex={1}>
                <Typography>Song (.mp3, .wav, .ogg)</Typography>
                <input
                  type="file"
                  accept=".mp3,.wav,.ogg"
                  onChange={updateSong}
                  required
                />
              </Box>
              <Box flex={1}>
                <FormControl fullWidth>
                  <InputLabel>Default Image</InputLabel>
                  <Select
                    value={defaultImage}
                    label="Default Image"
                    onChange={updateDefaultImage}
                    required
                  >
                    {images &&
                      images.length > 0 &&
                      images.map((image) => {
                        return (
                          <MenuItem value={image.name}>{image.name}</MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            {beatmapSetId && <Box>
              <Typography>BeatmapSetId: {beatmapSetId}</Typography>
            </Box>}
            {trackFiles && trackFiles.length > 0 && (
              <TrackInfo 
                title={songTitle}
                setTitle={setSongTitle}
                titleUnicode={songTitleUnicode}
                setTitleUnicode={setSongTitleUnicode}
                artist={songArtist}
                setArtist={setSongArtist}
                artistUnicode={songArtistUnicode}
                setArtistUnicode={setSongArtistUnicode}
              />
            )}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-end"
              flex={1}
            >
              <Button
                href="/admin/tracks"
                variant="contained"
                color="secondary"
                size="large"
              >
                Cancel
              </Button>
              <Button variant="contained" type="submit" size="large">
                Submit
              </Button>
            </Box>
          </form>
        </PageContent>
      </BodyContainer>
    </Box>
  );
}

const PageContent = styled.div`
  height: 100%;
  padding-top: 16px;
  display: flex;
  input {
    width: 100%;
    margin-top: 4px;
  }
`;
