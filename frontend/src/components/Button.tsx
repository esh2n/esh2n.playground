// TODO: apply other color
import React from 'react'
import tw, { css } from 'twin.macro'

// style
const primaryStyle = tw`border-2 border-indigo-500 bg-indigo-500  text-white hover:bg-indigo-400`

const reversePrimaryStyle = tw`border-2 border-indigo-500 bg-white text-indigo-500 hover:bg-indigo-500 hover:text-white`

const stylesButton = ({ isPrimary }) => [
  css`
    font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  `,
  tw`inline-block items-center px-4 py-2 rounded-full shadow leading-tight focus:outline-none cursor-pointer text-xs lg:text-sm whitespace-nowrap`,
  isPrimary ? primaryStyle : reversePrimaryStyle,
]

// FC
export const Button: React.FC<ButtonProps> = ({
  children,
  isPrimary = true,
  disabled = false,
  style = {},
  type = 'button',
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      css={stylesButton({ isPrimary })}
      style={style}
      {...props}
    >
      {children}
    </button>
  )
}

export interface ButtonProps {
  isPrimary?: boolean
  onClick?: () => void
  disabled?: boolean
  style?: any
  type?: ButtonType
}

type ButtonType = 'reset' | 'button' | 'submit'
