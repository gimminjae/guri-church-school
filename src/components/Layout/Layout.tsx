import React, { useMemo } from "react"
import Header from "./Header"
import useCRouter from "@/hooks/useCRouter"

function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
    </div>
  )
}

export default Layout
