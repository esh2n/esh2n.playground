import { Button } from './Button'
import tw, { styled } from 'twin.macro'
import React from 'react'
import { useRecoilState } from 'recoil'
import { authActionState, loggedInUserState } from '../recoil/authProvider'
import { useMutation } from '@apollo/client'
import { SIGN_OUT } from '../apollo/mutation'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { isAdmin } from '../helpers/authHelpers'

// styled tags
const HeaderWrapper = styled.header`
  font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  ${tw`flex justify-center w-full h-32 border-b py-6 px-7 bg-indigo-100`};
`

const Nav = styled.nav`
  ${tw`w-4/5 md:w-10/12 h-full flex items-center justify-between `};
`

const Logo = styled.img`
  ${tw`w-11 sm:w-12 md:w-14 h-16 cursor-pointer`}
  clip-path: circle(50% at 50% 50%);
`

const Ul = styled.ul`
  .active {
    ${tw`text-indigo-500`}
  }
  a {
    ${tw`no-underline list-none text-white text-base md:text-lg lg:text-xl transition-all hover:underline`}
  }
  a + a {
    ${tw`ml-6`}
  }
  ${tw`hidden sm:flex w-2/3 justify-start items-center py-0 px-16`}
`

const Actions = styled.div`
  button + button {
    ${tw`ml-3`}
  }
  ${tw`hidden sm:flex justify-between items-center`}
`

const HamMenu = styled.div`
  ${tw`block sm:hidden`}
`

export const Header: React.FC = () => {
  const router = useRouter()

  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState)
  const [, setAuthAction] = useRecoilState(authActionState)

  const [signout] = useMutation<{
    signout: { message: string }
  }>(SIGN_OUT)

  const handleSignOut = async () => {
    try {
      const response = await signout()
      if (response?.data?.signout?.message) {
        setLoggedInUser(null)

        window.localStorage.setItem('signout', Date.now().toString())

        router.push('/')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <HeaderWrapper>
      <Nav>
        <Link href="/">
          <>
            <Logo src="./assets/svg/icon.svg" alt="" />
          </>
        </Link>
        <Ul>
          <Link href="/">
            <a className={router.pathname === '/' ? 'active' : ''}>Home</a>
          </Link>

          <Link href="/playground">
            <a className={router.pathname === '/playground' ? 'active' : ''}>
              Playground
            </a>
          </Link>

          {loggedInUser && (
            <Link href="/dashboard">
              <a className={router.pathname === '/dashboard' ? 'active' : ''}>
                Dashboard
              </a>
            </Link>
          )}

          {loggedInUser && isAdmin(loggedInUser) && (
            <Link href="/admin">
              <a className={router.pathname === '/admin' ? 'active' : ''}>
                Admin
              </a>
            </Link>
          )}
        </Ul>
        <Actions>
          {loggedInUser ? (
            <Button onClick={() => handleSignOut()}>Sign Out</Button>
          ) : (
            <>
              <Button onClick={() => setAuthAction('signin')}>ログイン</Button>

              <Button isPrimary={false} onClick={() => setAuthAction('signup')}>
                新規登録
              </Button>
            </>
          )}
        </Actions>
        <HamMenu>
          <FontAwesomeIcon icon={['fas', 'bars']} size="2x" />
        </HamMenu>
      </Nav>
    </HeaderWrapper>
  )
}
