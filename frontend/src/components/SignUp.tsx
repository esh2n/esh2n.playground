import React from 'react'
import { useForm, ErrorMessage } from 'react-hook-form'

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
import { useMutation } from '@apollo/client'
import { SIGN_UP } from '../apollo/mutation'
import { SignUpArgs, User } from '../types'
import { useRouter } from 'next/router'
import Loader from 'react-loader-spinner'
import FBLoginButton from './FacebookLogin'
import GoogleLoginButton from './GoogleLogin'
import { useSocialMediaLogin } from '../helpers/useSocialMediaLogin'
import { useRecoilState } from 'recoil'
import { loggedInUserState, authActionState } from '../recoil/authProvider'
import { Button } from './Button'

const SignUp: React.FC = () => {
  const [, setLoggedInUser] = useRecoilState(loggedInUserState)
  const [, setAuthAction] = useRecoilState(authActionState)
  const { register, handleSubmit, errors } = useForm<SignUpArgs>()

  const {
    facebookLogin,
    googleLogin,
    loadingResult,
    errorResult,
  } = useSocialMediaLogin()

  const router = useRouter()

  const [signup, { loading, error }] = useMutation<
    { signup: User },
    SignUpArgs
  >(SIGN_UP)

  const submitSignUp = handleSubmit(async ({ email, password, username }) => {
    try {
      const response = await signup({
        variables: { email, password, username },
      })

      if (response?.data) {
        const { signup } = response.data

        if (signup) {
          setAuthAction('close')
          setLoggedInUser(signup)
          router.push('/dashboard')
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
          <h2>アカウント作成</h2>
        </ModalHeader>
        <StyledSocial>
          <FBLoginButton cb={facebookLogin} cssClass="facebook" />
          <GoogleLoginButton cb={googleLogin} cssClass="google" />
        </StyledSocial>
        <Divider />

        <StyledForm onSubmit={submitSignUp}>
          <p className="email_section_label">Eメールで新規登録する</p>
          <InputContainer>
            <label>ユーザー名</label>
            <Input
              type="text"
              name="username"
              id="username"
              placeholder="username"
              autoComplete="new-password"
              ref={register({
                required: 'Username is required.',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
                maxLength: {
                  value: 200,
                  message: 'Username must be not greater than 200 characters',
                },
              })}
            />
            <ErrorMessage errors={errors} name="username">
              {({ message }) => <StyledError>{message}</StyledError>}
            </ErrorMessage>
          </InputContainer>

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
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
                maxLength: {
                  value: 30,
                  message: 'Password must be not greater than 30 characters',
                },
              })}
            />
            <ErrorMessage errors={errors} name="password">
              {({ message }) => <StyledError>{message}</StyledError>}
            </ErrorMessage>
          </InputContainer>
          <Button
            disabled={loading}
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
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
              'アカウント作成'
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
            アカウントお持ちの方は
            <span
              style={{ cursor: 'pointer', color: 'red' }}
              onClick={() => setAuthAction('signin')}
            >
              こちら
            </span>
          </p>
        </StyledSwitchAction>
      </FormWrapper>
    </Modal>
  )
}

export default SignUp
