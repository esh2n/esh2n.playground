import '../styles/globals.css'
import 'sanitize.css'

import React from 'react'
import { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import Layout from '../components/Layout'
import AuthProvider from '../recoil/authProvider'
import { ApolloProvider } from '@apollo/client'
import { client } from '../apollo/client'

function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ApolloProvider client={client}>
      <RecoilRoot>
        <AuthProvider />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RecoilRoot>
    </ApolloProvider>
  )
}

export default App
