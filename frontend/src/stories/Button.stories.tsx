import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'

import { Button, ButtonProps } from '../components/Button'

export default {
  title: 'Component/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<ButtonProps> = (args) => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = {
  label: 'Button',
}

export const Secondary = Template.bind({})
Secondary.args = {
  isPrimary: false,
  label: 'Button',
}

export const Large = Template.bind({})
Large.args = {
  isPrimary: false,
  size: 'large',
  label: 'Button',
}

export const Small = Template.bind({})
Small.args = {
  isPrimary: false,
  size: 'small',
  label: 'Button',
}
