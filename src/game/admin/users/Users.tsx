import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import Panel from "../Panel";
import PageHeading from "../PageHeading";
import { BodyContainer } from "../styles";

type Props = {};

export default function AdminUsers({}: Props) {
  return (
    <Box display="flex" bgcolor="#ffffff" color="#000000">
      <Panel />
      <BodyContainer>
        <PageHeading title="Users" />
      </BodyContainer>
    </Box>
  );
}
