import React from 'react'
import Modal, {
  FormWrapper,
  Input,
  InputContainer,
  ModalHeader,
  StyledError,
  StyledForm,
  StyledInform,
} from './modal/Modal'
import { ErrorMessage, useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'

import { RESET_PASSWORD } from '../apollo/mutation'
import Loader from 'react-loader-spinner'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { authActionState } from '../recoil/authProvider'
import { Button } from './Button'

interface Props {
  token: string
}

const ResetPassword: React.FC<Props> = ({ token }) => {
  const [, setAuthAction] = useRecoilState(authActionState)

  const { register, handleSubmit, errors } = useForm<{ password: string }>()
  const router = useRouter()

  const [resetPassword, { loading, error, data }] = useMutation<
    { resetPassword: { message: string } },
    { password: string; token: string }
  >(RESET_PASSWORD)

  const submitResetPassword = handleSubmit(async ({ password }) => {
    const response = await resetPassword({ variables: { password, token } })

    if (response?.data?.resetPassword?.message) {
      router.replace('') // do not push
    }
  })

  return (
    <Modal>
      <FormWrapper>
        <ModalHeader>
          <h4>Enter your new password below.</h4>
        </ModalHeader>
        <StyledForm onSubmit={submitResetPassword}>
          <InputContainer>
            <label>Password</label>

            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Your password"
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
            {loading ? (
              <Loader
                type="Oval"
                color="white"
                height={30}
                width={30}
                timeout={3000}
              />
            ) : (
              'Submit'
            )}
          </Button>
          {error && (
            <StyledError>
              {error.graphQLErrors[0]?.message ||
                'Sorry, Something went wrong.'}
            </StyledError>
          )}
        </StyledForm>
        {data && (
          <StyledInform>
            <p>
              {data.resetPassword?.message}{' '}
              <span
                onClick={() => {
                  setAuthAction('signin')
                }}
                style={{ cursor: 'pointer', color: 'red' }}
              >
                ログイン
              </span>
            </p>
          </StyledInform>
        )}
      </FormWrapper>
    </Modal>
  )
}

export default ResetPassword
