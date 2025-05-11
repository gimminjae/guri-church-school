import Document, { Html, Head, Main, NextScript } from "next/document"
import React from "react"

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <title>The Note</title>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="google-site-verification"
            content="rW_xYjiXnO63MZm2FNGM2Pg3uRalwX9j_r4rhGjUbN4"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
