import styled from "@emotion/styled";
import { Box, Divider, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AdminRoute } from "./utils";
import { WithUser } from "@clerk/nextjs";
import { grey } from "@mui/material/colors";
import { useRouter } from "next/router";

type Props = {};

export default function Panel({}: Props) {
  const router = useRouter();
  const path = router.asPath;
  return (
    <WithUser>
      {(user) => (
        <Container>
          <Logo>
            <Image
              src="/images/console.png"
              alt="Console Logo"
              width={46}
              height={46}
            />
            <Typography variant="h5" p={0} lineHeight={1}>
              Admin Console
            </Typography>
          </Logo>
          <Nav>
            <Stack flex={1} gap={1}>
              {AdminRoute &&
                AdminRoute.map((item: any, index: number) => {
                  const url = "/admin" + item.path;
                  const currentPage = RegExp(url).test(path);
                  return (
                    <Link key={index} href={url}>
                      <Page
                        style={{
                          backgroundColor: currentPage ? "#333333" : "#eeeeee",
                          color: currentPage ? "#ffffff" : "#000000",
                        }}
                      >
                        <Typography variant="h6">{item.name}</Typography>
                      </Page>
                    </Link>
                  );
                })}
            </Stack>
            <Divider
              style={{ backgroundColor: grey[400], height: 1, marginBottom: 8 }}
            />
            <Box display="flex">
              <Box flex={1} alignItems="center" display="flex">
                <Image
                  src="/images/arrow-left.png"
                  alt="Sign Out"
                  width={20}
                  height={30}
                />
              </Box>
              <Stack textAlign="right">
                <Typography variant="subtitle2" marginBottom={0} color={"#999"}>
                  Signed in as
                </Typography>
                <Typography>{`${user.firstName} ${
                  user.lastName ? user.lastName : ""
                }`}</Typography>
              </Stack>
            </Box>
          </Nav>
        </Container>
      )}
    </WithUser>
  );
}

const Container = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  height: 100vh;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  background-color: #000000;
  border-radius: 8px;
  color: #ffffff;
  padding: 8px;
  width: 100%;
  margin-bottom: 16px;
  h5 {
    line-height: 1;
    height: fit-content;
    margin-left: 4px;
  }
`;

const Nav = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border-radius: 8px;
  border: 2px solid #000000;
  padding: 8px;
  width: 100%;
`;

const Page = styled.div`
  display: flex;
  padding: 8px;
  background-color: #eee;
  border-radius: 8px;
`;
