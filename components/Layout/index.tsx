import Footer from 'components/Footer'
import Nav from 'components/Nav'
import type { FC } from 'react'

const Layout: FC = ({ children }) => {
  return (
    <div className="flex flex-grow flex-row">
      <Nav />
      <main className="">{children}</main>
    </div>
  )
}

export default Layout
