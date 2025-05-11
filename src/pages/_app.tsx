import "../app/globals.css"
import { AppProps } from "next/app"
import { AuthProvider } from "@/hooks/useAuth"
import Layout from "@/components/Layout/Layout"
import React, { useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { Provider as MyProvider } from "react-redux"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* <MyProvider store={store}> */}
        {/* <Loading loading={loading} color="info" size="lg" type="spinner" /> */}
        <ToastContainer />
        <Layout>
          <Component {...pageProps} />
        </Layout>
        {/* </MyProvider> */}
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default MyApp
