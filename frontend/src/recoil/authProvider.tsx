import { atom, useRecoilState } from 'recoil'
import { User } from '../types'
import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { QUERY_USER } from '../apollo/query'

// handle modal here
type Actions = 'signup' | 'signin' | 'request' | 'reset' | 'close'

export const loggedInUserState = atom<User | null>({
  key: 'loggedInUser',
  default: null,
})

export const authActionState = atom<Actions>({
  key: 'authAction',
  default: 'close',
})

const AuthProvider: React.FC = () => {
  const [, setLoggedInUser] = useRecoilState(loggedInUserState)

  const { data } = useQuery<{ user: User }>(QUERY_USER)

  const router = useRouter()

  useEffect(() => {
    if (data?.user) setLoggedInUser(data.user)
  }, [data])

  useEffect(() => {
    const syncSignOut = (e: StorageEvent) => {
      if (e.key === 'signout') {
        setLoggedInUser(null)
        window.localStorage.removeItem('signout')
        router.push('/')
      }
    }
    window.addEventListener('storage', syncSignOut)

    return () => window.removeEventListener('storage', syncSignOut)
  }, [])
  return <></>
}

export default AuthProvider
