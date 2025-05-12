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
              <a>기도부탁 목록</a>
            </li>
            <li>
              <a>전도현황</a>
            </li>
          </ul>
        </div>
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
              <li>
                <a onClick={move(`/`)}>
                  <MdSpaceDashboard className="mr-2" />
                  마이페이지
                </a>
              </li>
              <li>
                <a onClick={logout}>
                  <FaArrowRightFromBracket className="mr-2" />
                  로그아웃
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <></>
          // <button className="btn btn-ghost" onClick={loginWithGoogle}>
          //   <FaGoogle className="mr-2" />
          //   로그인
          // </button>
        )}
      </div>
    </div>
  )
}
export default memo(HeaderNavbar)
