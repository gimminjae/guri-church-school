import { useAuth } from "@/hooks/useAuth"
import useCRouter from "@/hooks/useCRouter"
import { Button, Dropdown, Navbar } from "flowbite-react"
import Link from "next/link"
import { memo, useCallback } from "react"
import { FaArrowRightFromBracket, FaGoogle } from "react-icons/fa6"
import { IoMdSettings } from "react-icons/io"
import { MdSpaceDashboard } from "react-icons/md"
import { RxAvatar } from "react-icons/rx"

function HeaderNavbar() {
  const { user, logout, loginWithGoogle } = useAuth()

  const { push } = useCRouter()

  const move = useCallback((path: string) => () => push({ path }), [])

  return (
    <Navbar fluid rounded>
      <Link
        href="/"
        className="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
      >
        The Note
      </Link>
      <div className="flex md:order-2">
        {(user && (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <h1 className="text-4xl">
                <RxAvatar />
              </h1>
            }
          >
            <Dropdown.Header>
              <span className="block truncate text-sm font-medium">
                {user?.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={move(`/member/${user?.email}`)}>
              <MdSpaceDashboard className="mr-2 h-3 w-3" />
              Dashboard
            </Dropdown.Item>
            <Dropdown.Item onClick={move("/setting")}>
              <IoMdSettings className="mr-2 h-3 w-3" />
              Settings
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={logout}>
              <FaArrowRightFromBracket className="mr-2 h-3 w-3" />
              Log out
            </Dropdown.Item>
          </Dropdown>
        )) || (
          <Button onClick={loginWithGoogle}>
            <FaGoogle className="mr-2 h-5 w-5" />
            Login
          </Button>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="#">About</Navbar.Link>
        {user && <Navbar.Link href="/post/write">Write</Navbar.Link>}
      </Navbar.Collapse>
    </Navbar>
  )
}
export default memo(HeaderNavbar)
