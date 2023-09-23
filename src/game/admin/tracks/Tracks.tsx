import styled from "@emotion/styled";
import { Box, Divider, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import PageHeading from "../PageHeading";
import Panel from "../Panel";
import { BodyContainer } from "../styles";

type Props = {};

export default function AdminTracks({}: Props) {
  return (
    <Box display="flex" bgcolor="#ffffff" color="#000000">
      <Panel />
      <BodyContainer>
        <PageHeading title="Track Sets" addButtonLink="/admin/tracks/add" />
      </BodyContainer>
    </Box>
  );
}
