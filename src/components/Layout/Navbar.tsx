import { useAuth } from "@/hooks/useAuth"
import useCRouter from "@/hooks/useCRouter"
import Link from "next/link"
import { memo, useCallback } from "react"
import { FaArrowRightFromBracket, FaGoogle } from "react-icons/fa6"
import { IoMdSettings } from "react-icons/io"
import { MdSpaceDashboard } from "react-icons/md"
import { RxAvatar } from "react-icons/rx"
import { FaList } from "react-icons/fa6"

function HeaderNavbar() {
  const { user, logout, loginWithGoogle } = useAuth()
  const { push } = useCRouter()

  const move = useCallback((path: string) => () => push({ path }), [])

  const handleLogout = useCallback(async () => {
    await logout()
    push({ path: '/' })
  }, [logout, push])

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          {/* <div className="dropdown">
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
                <button tabIndex={0} onClick={move(`/todoprays`)} role="button">기도부탁 목록</button>
              </li>
              <li>
                <a tabIndex={0} onClick={move(`/status`)} role="button">전도현황</a>
              </li>
            </ul>
          </div> */}
        </div>
        <div className="navbar-center">
          <a className="btn btn-ghost text-xl">구리교회 중고등부</a>
        </div>
        <div className="navbar-end">
          {user ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={1} role="button" className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <RxAvatar className="text-3xl" />
                </div>
              </div>
              <ul
                tabIndex={1}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                {/* <li>
                  <a onClick={move(`/`)}>
                    <MdSpaceDashboard className="mr-2" />
                    마이페이지
                  </a>
                </li> */}
                <li>
                  <a onClick={handleLogout}>
                    <FaArrowRightFromBracket className="mr-2" />
                    로그아웃
                  </a>
                </li>
                {user.email === '김민재@guri-church.com' && <li>
                  <Link href="/onlyadmin">
                    admin
                  </Link>
                </li>}
              </ul>
            </div>
          ) : (
            <Link href="/" className="btn btn-ghost">
              로그인
            </Link>
          )}
        </div>
      </div>

      {user && <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <ul className="menu menu-horizontal bg-base-200 rounded-box">
          <li>
            <Link href={`/`} className="tooltip" data-tip="Home">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
          </li>
          <li>
            <Link href={`/todoprays`} className="tooltip" data-tip="Details">
              <FaList className="text-2xl" />
            </Link>
          </li>
          <li>
            <Link href={`/status`} className="tooltip" data-tip="Stats">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </Link>
          </li>
        </ul>
      </div>}
    </>
  )
}
export default memo(HeaderNavbar)
