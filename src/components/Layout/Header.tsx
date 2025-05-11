import { memo } from "react"
import HeaderNavbar from "./Navbar"

const Header = () => {
  return (
    <header className="sticky top-0 z-30">
      <HeaderNavbar />
    </header>
  )
}

export default memo(Header)
