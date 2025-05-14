import { memo, useEffect } from "react"
import HeaderNavbar from "./Navbar"
import { useAuth } from "@/hooks/useAuth"
import useCRouter from "@/hooks/useCRouter"
import { userDataModel } from "@/firebase/userdata"

const Header = () => {

  const { user } = useAuth()
  const router = useCRouter()

  useEffect(() => {
    if (!user && router.pathname !== '/') {
      router.push({ path: '/' })
    }
  }, [user])

  useEffect(() => {
    if (user && !router.pathname.includes('/metadata')) {
      const checkMetadata = async () => {
        const userMetadata = await userDataModel.getUserDataByUserId(user.uid)
        if (!userMetadata || userMetadata.length === 0) {
          router.push({ path: '/metadata' })
        }
      }
      checkMetadata()
    }
  }, [user])

  return (
    <header className="sticky top-0 z-30">
      <HeaderNavbar />
    </header>
  )
}

export default memo(Header)
