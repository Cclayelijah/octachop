import { Box, Divider, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  title: string;
  addButtonLink?: string;
};

export default function PageHeading({ title, addButtonLink }: Props) {
  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4">{title}</Typography>
        <Box display="flex" alignItems="center">
          {/* <Image
            src="/images/search-button.png"
            alt="Search"
            width={35}
            height={35}
          /> */}
          {addButtonLink && (
            <Link href={addButtonLink}>
              <Image
                src="/images/add-button.png"
                alt="Add"
                width={36}
                height={36}
              />
            </Link>
          )}
        </Box>
      </Box>
      <Divider
        style={{
          backgroundColor: "black",
          height: 2,
          marginTop: 8,
          marginBottom: 8,
        }}
      />
    </>
  );
}
