import React, { useMemo } from "react"
import Header from "./Header"
import useCRouter from "@/hooks/useCRouter"

function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center animate-fade-up pt-20">
        {children}
      </div>
    </>
  )
}

export default Layout
