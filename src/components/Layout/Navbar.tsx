import { useAuth } from "@/hooks/useAuth"
import useCRouter from "@/hooks/useCRouter"
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
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Homepage</a>
            </li>
            <li>
              <a>Portfolio</a>
            </li>
            <li>
              <a>About</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">구리교회 중고등부</a>
      </div>
      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle" onClick={() => move("/")}>
          <div className="indicator">
            <RxAvatar className="text-3xl" />
          </div>
        </button>
      </div>
    </div>
    // <Navbar fluid rounded>
    //   <Link
    //     href="/"
    //     className="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
    //   >
    //     The Note
    //   </Link>
    //   <div className="flex md:order-2">
    //     {(user && (
    //       <Dropdown
    //         arrowIcon={false}
    //         inline
    //         label={
    //           <h1 className="text-4xl">
    //             <RxAvatar />
    //           </h1>
    //         }
    //       >
    //         <Dropdown.Header>
    //           <span className="block truncate text-sm font-medium">
    //             {user?.email}
    //           </span>
    //         </Dropdown.Header>
    //         <Dropdown.Item onClick={move(`/member/${user?.email}`)}>
    //           <MdSpaceDashboard className="mr-2 h-3 w-3" />
    //           Dashboard
    //         </Dropdown.Item>
    //         <Dropdown.Item onClick={move("/setting")}>
    //           <IoMdSettings className="mr-2 h-3 w-3" />
    //           Settings
    //         </Dropdown.Item>
    //         <Dropdown.Divider />
    //         <Dropdown.Item onClick={logout}>
    //           <FaArrowRightFromBracket className="mr-2 h-3 w-3" />
    //           Log out
    //         </Dropdown.Item>
    //       </Dropdown>
    //     )) || (
    //       <Button onClick={loginWithGoogle}>
    //         <FaGoogle className="mr-2 h-5 w-5" />
    //         Login
    //       </Button>
    //     )}
    //     <Navbar.Toggle />
    //   </div>
    //   <Navbar.Collapse>
    //     <Navbar.Link href="/" active>
    //       Home
    //     </Navbar.Link>
    //     <Navbar.Link href="#">About</Navbar.Link>
    //     {user && <Navbar.Link href="/post/write">Write</Navbar.Link>}
    //   </Navbar.Collapse>
    // </Navbar>
  )
}
export default memo(HeaderNavbar)
