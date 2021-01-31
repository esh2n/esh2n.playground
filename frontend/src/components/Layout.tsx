import Head from 'next/head'
import { useRouter } from 'next/router'
import { GlobalStyles } from 'twin.macro'
import { Header } from './Header'

interface Props {
  title?: string
}

const Layout: React.FC<Props> = ({ children }) => {
  const { pathname, query } = useRouter()
  return (
    <>
      <GlobalStyles />
      <Head>
        <title>
          {pathname === '/' ? 'HOME' : pathname.split('/')[1].toUpperCase()}
        </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans&family=Roboto&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Header />

      <>{children}</>
    </>
  )
}
export default Layout
