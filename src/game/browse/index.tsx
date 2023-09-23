import { Box, Divider, Stack, Typography } from "@mui/material";
import { FC, useState } from "react";
import { WithUser } from "@clerk/nextjs";
import TrackSet from "./TrackSet";
import { Row, Col } from "react-simple-flex-grid";
import "react-simple-flex-grid/lib/main.css";
import Image from "next/image";
import SideBar from "./SideBar";
import Link from "next/link";
import styled from "@emotion/styled";

type Track = {
  difficulty: number;
  bgImage: string;
};

const Browse: FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selected, setSelected] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [songs, setSongs] = useState([
    {
      id: 1,
      title: "Big Black",
      artist: "The Quick Brown Fox",
      audio: "my-song.mp3",
      duration: 63012,
      imageDir: "my/directory/",
      defaultImage: "/res/images/retro-city.jpg",
    },
  ]);

  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <WithUser>
      {(user) => (
        <Box display="flex">
          <Stack flex={1} padding={2}>
            <Box display="flex">
              <Typography variant="h6">
                {user.firstName ? user.firstName : "Guest"}
              </Typography>
            </Box>
            <Divider
              color="#beb7df"
              sx={{
                marginTop: 1,
                display: "block",
                height: 2,
                boxShadow: "0px 0px 0px #ffffff 12px",
              }}
            />
            <Box flex={1}>
              {songs &&
                songs.map((song) => {
                  return (
                    <>
                      <Row gutter={16}>
                        <Col
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          onClick={() => {
                            console.log("clicked");
                            setSelected(song.id);
                          }}
                        >
                          <TrackSet
                            key={song.id}
                            title={song.title}
                            artist={song.artist}
                            audio={song.audio}
                            imageDir={song.imageDir}
                            selected={song.id == selected ? true : false}
                            defaultImage={song.defaultImage}
                            duration={song.duration}
                            tracks={tracks}
                            selectedTrack={selectedTrack}
                          />
                        </Col>
                        <Col
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          onClick={() => {
                            console.log("clicked");
                            setSelected(song.id);
                          }}
                        >
                          <TrackSet
                            key={song.id}
                            title={song.title}
                            artist={song.artist}
                            audio={song.audio}
                            imageDir={song.imageDir}
                            selected={song.id == selected ? true : false}
                            defaultImage={song.defaultImage}
                            duration={song.duration}
                            tracks={tracks}
                            selectedTrack={selectedTrack}
                          />
                        </Col>
                        <Col
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          onClick={() => {
                            console.log("clicked");
                            setSelected(song.id);
                          }}
                        >
                          <TrackSet
                            key={song.id}
                            title={song.title}
                            artist={song.artist}
                            audio={song.audio}
                            imageDir={song.imageDir}
                            selected={song.id == selected ? true : false}
                            defaultImage={song.defaultImage}
                            duration={song.duration}
                            tracks={tracks}
                            selectedTrack={selectedTrack}
                          />
                        </Col>
                        <Col
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          onClick={() => {
                            console.log("clicked");
                            setSelected(song.id);
                          }}
                        >
                          <TrackSet
                            key={song.id}
                            title={song.title}
                            artist={song.artist}
                            audio={song.audio}
                            imageDir={song.imageDir}
                            selected={song.id == selected ? true : false}
                            defaultImage={song.defaultImage}
                            duration={song.duration}
                            tracks={tracks}
                            selectedTrack={selectedTrack}
                          />
                        </Col>
                        <Col
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          onClick={() => {
                            console.log("clicked");
                            setSelected(song.id);
                          }}
                        >
                          <TrackSet
                            key={song.id}
                            title={song.title}
                            artist={song.artist}
                            audio={song.audio}
                            imageDir={song.imageDir}
                            selected={song.id == selected ? true : false}
                            defaultImage={song.defaultImage}
                            duration={song.duration}
                            tracks={tracks}
                            selectedTrack={selectedTrack}
                          />
                        </Col>
                        <Col
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          onClick={() => {
                            console.log("clicked");
                            setSelected(song.id);
                          }}
                        >
                          <TrackSet
                            key={song.id}
                            title={song.title}
                            artist={song.artist}
                            audio={song.audio}
                            imageDir={song.imageDir}
                            selected={song.id == selected ? true : false}
                            defaultImage={song.defaultImage}
                            duration={song.duration}
                            tracks={tracks}
                            selectedTrack={selectedTrack}
                          />
                        </Col>
                        <Col
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          onClick={() => {
                            console.log("clicked");
                            setSelected(song.id);
                          }}
                        >
                          <TrackSet
                            key={song.id}
                            title={song.title}
                            artist={song.artist}
                            audio={song.audio}
                            imageDir={song.imageDir}
                            selected={song.id == selected ? true : false}
                            defaultImage={song.defaultImage}
                            duration={song.duration}
                            tracks={tracks}
                            selectedTrack={selectedTrack}
                          />
                        </Col>
                      </Row>
                    </>
                  );
                })}
            </Box>
            <div>
              <Link href={"/"}>
                <Image
                  className="cornerButton"
                  src={"/images/arrow-back.png"}
                  width={80}
                  height={40}
                  alt="Back"
                  style={{ position: "absolute", bottom: 0, left: 0 }}
                />
              </Link>
            </div>
          </Stack>
          <SideBar
            tracks={tracks}
            selectedTrack={selectedTrack}
            setSelectedTrack={setSelectedTrack}
          />
        </Box>
      )}
    </WithUser>
  );
};

export default Browse;
