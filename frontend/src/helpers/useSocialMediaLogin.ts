import { ApolloError, useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { SOCIAL_MEDIA_LOGIN } from '../apollo/mutation'
import { Provider, SocialMediaLoginArgs, User } from '../types'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { authActionState, loggedInUserState } from '../recoil/authProvider'

interface UseSocialMediaLoginArgs {
  facebookLogin: (response: {
    name: string
    id: string
    email: string
    expiresIn: number
  }) => Promise<void>
  googleLogin: (response: {
    profileObj: {
      googleId: string
      name: string
      email: string
    }
    tokenObj: {
      expires_in: number
    }
  }) => Promise<void>
  loadingResult: boolean
  errorResult: ApolloError
}

export const useSocialMediaLogin = (): UseSocialMediaLoginArgs => {
  const [, setLoggedInUser] = useRecoilState(loggedInUserState)
  const [, setAuthAction] = useRecoilState(authActionState)

  const [loadingResult, setLoadingResult] = useState(false)
  const [errorResult, setErrorResult] = useState<ApolloError | undefined>()

  const router = useRouter()

  const [socialMediaLogin, { loading, error }] = useMutation<
    { socialMediaLogin: User },
    SocialMediaLoginArgs
  >(SOCIAL_MEDIA_LOGIN)

  useEffect(() => {
    setLoadingResult(loading)
  }, [loading])

  useEffect(() => {
    setErrorResult(error)
  }, [error])

  const facebookLogin = async (response: {
    name: string
    id: string
    email: string
    expiresIn: number
  }) => {
    try {
      const { id, name, email, expiresIn } = response
      const expiration = Date.now() + expiresIn * 1000
      const res = await socialMediaLogin({
        variables: {
          username: name,
          email,
          id: id,
          expiration: expiration.toString(),
          provider: Provider.facebook,
        },
      })

      if (res?.data) {
        const { socialMediaLogin } = res.data
        setLoggedInUser(socialMediaLogin)
        setAuthAction('close')

        router.push('/dashboard')
      }
    } catch (error) {
      setLoggedInUser(null)
    }
  }

  const googleLogin = async (response: {
    profileObj: { googleId: string; name: string; email: string }
    tokenObj: { expires_in: number }
  }) => {
    try {
      const {
        profileObj: { googleId, name, email },
        tokenObj: { expires_in },
      } = response
      const expiration = Date.now() + expires_in * 1000
      const res = await socialMediaLogin({
        variables: {
          username: name,
          email,
          id: googleId,
          expiration: expiration.toString(),
          provider: Provider.google,
        },
      })

      if (res?.data) {
        const { socialMediaLogin } = res.data
        setLoggedInUser(socialMediaLogin)
        setAuthAction('close')

        router.push('/dashboard')
      }
    } catch (error) {
      setLoggedInUser(null)
    }
  }

  return {
    facebookLogin,
    googleLogin,
    loadingResult,
    errorResult,
  }
}
