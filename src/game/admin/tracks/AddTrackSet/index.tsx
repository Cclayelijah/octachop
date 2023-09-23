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
import React, { useEffect, useState } from "react";
import PageHeading from "../../PageHeading";
import Panel from "../../Panel";
import { BodyContainer } from "../../styles";
import { trpc } from "src/pages/_app";
import TrackInfo from "./TrackInfo";

type Props = {};
type MyImage = {
  url: string;
  name: string;
  file: File;
};

export default function AddTrackSet({}: Props) {
  const [images, setImages] = useState<MyImage[]>([]);
  const [trackFiles, setTrackFiles] = useState<File[]>([]);
  const [songFile, setSongFile] = useState<File>();
  const [defaultImage, setDefaultImage] = useState<string>();
  const [formPage, setFormPage] = useState(0);

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

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

  const updateTracks = (e: any) => {
    e.preventDefault();
    const files = [...e.target.files];
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
        <PageHeading title="Add Track Set" />
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
            {trackFiles && trackFiles.length > 0 && (
              <TrackInfo file={trackFiles[0]} />
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
