import React, { useMemo } from "react"
import Header from "./Header"
import useCRouter from "@/hooks/useCRouter"

function Layout({ children }: React.PropsWithChildren<{}>) {
  const router = useCRouter()

  const isPostWritePage = useMemo(
    () => router.pathname.includes("write") || router.pathname.includes("edit"),
    [router.pathname]
  )

  return (
    <>
      <Header />
      <div
        className={`animate-fade-up ${
          isPostWritePage &&
          "md:container md:mx-auto xl:container xl:mx-auto sm:container sm:mx-auto"
        }`}
      >
        {children}
      </div>
    </>
  )
}

export default Layout
