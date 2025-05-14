import { memo, useEffect } from "react"
import HeaderNavbar from "./Navbar"
import { useAuth } from "@/hooks/useAuth"
import useCRouter from "@/hooks/useCRouter"

const Header = () => {

  const { user } = useAuth()
  const router = useCRouter()

  useEffect(() => {
    if (!user && router.pathname !== '/') {
      router.push({ path: '/' })
    }
  }, [user])

  return (
    <header className="sticky top-0 z-30">
      <HeaderNavbar />
    </header>
  )
}

export default memo(Header)
