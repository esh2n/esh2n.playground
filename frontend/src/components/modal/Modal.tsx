import React from 'react'
import { useRecoilState } from 'recoil'
import tw, { styled } from 'twin.macro'
import { authActionState } from '../../recoil/authProvider'
import { appear } from '../../theme'

interface Props {}

export const FormWrapper = styled.div`
  ${tw`flex flex-col justify-between items-center w-11/12 my-10 mx-0`}
`

export const ModalHeader = styled.div`
  h2 {
    ${tw`m-0`}
  }
  ${tw`flex justify-center items-center w-full m-0 p-0 text-indigo-black`}
`

export const StyledForm = styled.form`
  .email_section_label {
    ${tw`m-0 p-0 text-indigo-black`}
  }
  ${tw`flex flex-col justify-items-stretch items-center w-full`}
`

export const InputContainer = styled.div`
  ${tw`flex flex-col justify-items-stretch items-stretch w-full m-1 my-2`}
  label {
    ${tw`text-indigo-black`}
  }
`

export const Input = styled.input`
  ${tw`w-full h-16 border border-indigo-300 rounded-2xl my-1 mx-0 p-4 text-lg outline-none shadow-md`}
`

export const StyledError = styled.p`
  ${tw`m-0 p-0 text-red-200 text-lg`}
`

export const StyledSwitchAction = styled.div`
  ${tw`m-0 p-0 w-full`}
  p {
    ${tw`text-sm text-indigo-black p-0 m-0 mt-4`}
  }
`

export const StyledInform = styled.div`
  ${tw`m-0 p-1 w-full`}
  p {
    ${tw`text-sm p-0 text-indigo-500`}
  }
`

export const StyledSocial = styled.div`
  ${tw`my-1 mx-auto p-1 w-full`}

  button {
    ${tw`w-full my-4 mx-auto flex justify-around items-center text-white`}
    a {
      ${tw`text-white no-underline`}
    }
  }
  .facebook {
    ${tw`p-2 bg-indigo-500 hover:bg-indigo-400 rounded-full border-2 focus:outline-none`}
  }

  .google {
    ${tw`p-2 bg-indigo-500 hover:bg-indigo-400 rounded-full border-2 focus:outline-none`}
  }
`

export const Divider = styled.hr`
  ${tw`my-2 h-1 w-full bg-indigo-100`}
`

const ModalContainer = styled.div`
  ${tw`fixed overflow-y-scroll inset-0 z-50`}
`

const StyledModal = styled.div`
  ${tw`relative flex flex-col justify-between items-center bg-white h-auto my-0 mx-auto py-4 px-8 rounded-md w-4/5 sm:w-2/4 md:w-96 inset-y-8 md:inset-y-16 `}
  box-shadow: 0px 30px 20px rgba(0, 0, 0, 0.4);
  animation: ${appear} 1s linear;
`

const StyledAction = styled.div`
  ${tw`absolute top-4 right-8 flex justify-center items-center text-3xl cursor-pointer font-bold w-12 h-12 rounded-full text-indigo-black hover:bg-gray-200 transition-colors`}
  transition: background-color 0.2s ease-in;
`

const Modal: React.FC<Props> = ({ children }) => {
  const [, setAuthAction] = useRecoilState(authActionState)

  return (
    <ModalContainer>
      <StyledModal>
        <StyledAction onClick={() => setAuthAction('close')}>
          &times;
        </StyledAction>
        {children}
      </StyledModal>
    </ModalContainer>
  )
}

export default Modal
