import Footer from "src/components/Footer";
import Nav from "src/components/Nav";

import type { FC } from "react";
interface Props {
  children: React.ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-grow flex-row">
      {/* <Nav /> */}
      <main className="" style={{ flex: "1" }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
