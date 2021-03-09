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

import { REQUEST_TO_RESET_PASSWORD } from '../apollo/mutation'
import { ErrorMessage, useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import Loader from 'react-loader-spinner'
import { Button } from './Button'

interface Props {}

const RequestResetPassword: React.FC<Props> = () => {
  const { register, handleSubmit, errors } = useForm<{ email: string }>()

  const [requestToResetPassword, { loading, error, data }] = useMutation<
    { requestToResetPassword: { message: string } }, // return
    { email: string } // args
  >(REQUEST_TO_RESET_PASSWORD)

  const submitRequestResetPassword = handleSubmit(async ({ email }) => {
    await requestToResetPassword({ variables: { email } })
  })
  return (
    <Modal>
      <FormWrapper>
        <ModalHeader>
          <h2>パスワードリセット</h2>
        </ModalHeader>
        <StyledForm onSubmit={submitRequestResetPassword}>
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
              'メールを送信する'
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
            <p>{data.requestToResetPassword?.message}</p>
          </StyledInform>
        )}
      </FormWrapper>
    </Modal>
  )
}

export default RequestResetPassword
