// TODO: apply other color
import React from 'react'
import tw, { css } from 'twin.macro'

// style
const primaryStyle = tw`border-0 bg-blue-500  text-white hover:bg-blue-400`

const reversePrimaryStyle = tw`border-2 border-blue-500 bg-white text-blue-500 hover:bg-blue-500 hover:text-white`

const stylesButton = ({ isPrimary, size }) => [
  css`
    font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    cursor: pointer;
  `,
  tw`inline-block items-center px-4 py-2 rounded-full shadow leading-tight`,
  isPrimary ? primaryStyle : reversePrimaryStyle,
  size === 'small' && tw`text-xs`,
  size === 'medium' && tw`text-sm`,
  size === 'large' && tw`text-lg`,
]

// FC
export const Button: React.FC<ButtonProps> = ({
  isPrimary = true,
  size = 'medium',
  label,
  ...props
}) => {
  return (
    <button type="button" css={stylesButton({ isPrimary, size })} {...props}>
      {label}
    </button>
  )
}

// type related
type Size = 'small' | 'medium' | 'large'
export interface ButtonProps {
  isPrimary?: boolean
  size?: Size
  label: string
  onClick?: () => void
}
