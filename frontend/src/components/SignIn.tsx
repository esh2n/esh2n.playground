import React from 'react'
import Modal, {
  Divider,
  FormWrapper,
  Input,
  InputContainer,
  ModalHeader,
  StyledError,
  StyledForm,
  StyledSocial,
  StyledSwitchAction,
} from './modal/Modal'

import { ErrorMessage, useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { SignInArgs, User } from '../types'
import Loader from 'react-loader-spinner'
import { SIGN_IN } from '../apollo/mutation'
import { isAdmin } from '../helpers/authHelpers'
import FBLoginButton from './FacebookLogin'
import GoogleLoginButton from './GoogleLogin'
import { useSocialMediaLogin } from '../helpers/useSocialMediaLogin'
import { useRecoilState } from 'recoil'
import { loggedInUserState, authActionState } from '../recoil/authProvider'
import { Button } from './Button'

interface Props {}

const SignIn: React.FC<Props> = () => {
  const [, setLoggedInUser] = useRecoilState(loggedInUserState)
  const [, setAuthAction] = useRecoilState(authActionState)
  const { register, handleSubmit, errors } = useForm<SignInArgs>()

  const {
    facebookLogin,
    googleLogin,
    loadingResult,
    errorResult,
  } = useSocialMediaLogin()

  const router = useRouter()

  const [signin, { loading, error }] = useMutation<
    { signin: User },
    SignInArgs
  >(SIGN_IN)

  const submitSignIn = handleSubmit(async ({ email, password }) => {
    try {
      const response = await signin({
        variables: { email, password },
      })

      if (response?.data) {
        const { signin } = response.data

        if (signin) {
          setAuthAction('close')
          setLoggedInUser(signin)

          if (isAdmin(signin)) {
            router.push('/admin')
          } else {
            router.push('/dashboard')
          }
        }
      }
    } catch (error) {
      setLoggedInUser(null)
    }
  })

  return (
    <Modal>
      <FormWrapper>
        <ModalHeader>
          <h2>ログイン</h2>
        </ModalHeader>
        <StyledSocial>
          <FBLoginButton cb={facebookLogin} cssClass="facebook" />
          <GoogleLoginButton cb={googleLogin} cssClass="google" />
        </StyledSocial>
        <Divider />

        <StyledForm onSubmit={submitSignIn}>
          <p className="email_section_label">Eメールでログインする</p>
          <InputContainer>
            <label>メールアドレス</label>

            <Input
              type="text"
              name="email"
              id="email"
              placeholder="email@email.com"
              autoComplete="new-password"
              ref={register({
                required: 'Email is required.',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email is in wrong format.',
                },
              })}
            />
            <ErrorMessage errors={errors} name="email">
              {({ message }) => <StyledError>{message}</StyledError>}
            </ErrorMessage>
          </InputContainer>

          <InputContainer>
            <label>パスワード</label>

            <Input
              type="password"
              name="password"
              id="password"
              placeholder="password"
              ref={register({
                required: 'Password is required.',
              })}
            />
            <ErrorMessage errors={errors} name="password">
              {({ message }) => <StyledError>{message}</StyledError>}
            </ErrorMessage>
          </InputContainer>
          <Button
            disabled={loading}
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
            type="submit"
          >
            {loading || loadingResult ? (
              <Loader
                type="Oval"
                color="white"
                height={30}
                width={30}
                timeout={3000}
              />
            ) : (
              'ログイン'
            )}
          </Button>
          {error ? (
            <StyledError>{error.graphQLErrors[0]?.message}</StyledError>
          ) : errorResult ? (
            <StyledError>{errorResult.graphQLErrors[0]?.message}</StyledError>
          ) : null}
        </StyledForm>
        <StyledSwitchAction>
          <p>
            アカウントお持ちでない方は
            <span
              style={{ cursor: 'pointer', color: 'red' }}
              onClick={() => setAuthAction('signup')}
            >
              こちら
            </span>
          </p>
          <p>
            <span
              style={{ cursor: 'pointer', color: 'red' }}
              onClick={() => setAuthAction('request')}
            >
              パスワードをお忘れですか？
            </span>
          </p>
        </StyledSwitchAction>
      </FormWrapper>
    </Modal>
  )
}

export default SignIn
