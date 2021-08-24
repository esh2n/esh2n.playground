import { ThemeProvider } from '@emotion/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { GlobalStyles, styled } from 'twin.macro'
import { authActionState } from '../recoil/authProvider'
import { Header } from './Header'
import Backdrop from './modal/Backdrop'
import RequestResetPassword from './RequestResetPassword'
import ResetPassword from './ResetPassword'
import SignIn from './SignIn'
import SignUp from './SignUp'
import { theme } from '../theme/index'

import '../fontAwesome'
import Prompt from './Prompt'

interface Props {
  title?: string
}

const DisplayedPage = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  justify-content: center;
`

const Layout: React.FC<Props> = ({ children }) => {
  const [authAction, setAuthAction] = useRecoilState(authActionState)

  const { pathname, query } = useRouter()

  useEffect(() => {
    if (query?.resetToken) setAuthAction('reset')
  }, [query])
  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyles />
        <Head>
          <title>
            {pathname === '/' ? 'HOME' : pathname.split('/')[1].toUpperCase()}
          </title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans&family=Roboto&display=swap"
            rel="stylesheet"
          />
        </Head>
        <Header />

        <DisplayedPage>
          <>{children}</>
          <>
            {authAction !== 'close' && (
              <>
                {authAction === 'signup' && (
                  <>
                    <Backdrop />
                    <SignUp />
                  </>
                )}
                {authAction === 'signin' && (
                  <>
                    <Backdrop />
                    <SignIn />
                  </>
                )}
                {authAction === 'request' && (
                  <>
                    <Backdrop />
                    <RequestResetPassword />
                  </>
                )}
                {authAction === 'reset' && (
                  <>
                    <Backdrop />
                    <ResetPassword token={query?.resetToken as string} />
                  </>
                )}
              </>
            )}
          </>
        </DisplayedPage>
        <Prompt />
      </>
    </ThemeProvider>
  )
}
export default Layout
