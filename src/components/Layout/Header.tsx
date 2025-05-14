import { memo, useEffect } from "react"
import HeaderNavbar from "./Navbar"
import { useAuth } from "@/hooks/useAuth"
import useCRouter from "@/hooks/useCRouter"
import { userDataModel } from "@/firebase/userdata"

const Header = () => {

  const { user, metadata } = useAuth()
  const router = useCRouter()

  useEffect(() => {
    if (!user && router.pathname !== '/') {
      router.push({ path: '/' })
    }
  }, [user])

  useEffect(() => {
    if (user && !router.pathname.includes('/metadata')) {
      const checkMetadata = async () => {
        // const userMetadata = await userDataModel.getUserDataByUserId(user.uid)
        // if (!userMetadata || userMetadata.length === 0) {
        if (!metadata) {
          router.push({ path: '/metadata' })
        }
      }
      checkMetadata()
    }
  }, [router.pathname])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-base-100">
      <HeaderNavbar />
    </header>
  )
}

export default memo(Header)
