import type { FC } from "react";
import Image from "next/dist/client/image";
import MenuIcon from "@mui/icons-material/Menu";

const Nav: FC = () => {
  return (
    <nav>
      <Image
        src="/favicon/android-chrome-192x192.png"
        alt="logo"
        width={50}
        height={50}
      />
      <MenuIcon sx={{ color: "#ccc" }} />
    </nav>
  );
};

export default Nav;
