import '../styles/globals.css'
import 'sanitize.css'
import '../stories/header.css'

import React from 'react'
import { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import Layout from '../components/Layout'

function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <RecoilRoot>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
  )
}

export default App
