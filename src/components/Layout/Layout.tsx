import React, { useMemo } from "react"
import Header from "./Header"
import useCRouter from "@/hooks/useCRouter"

function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      <Header />
      <div className="pt-20 pb-30">
        {children}
      </div>
    </>
  )
}

export default Layout
