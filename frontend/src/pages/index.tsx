import React from 'react'
import { NextPage } from 'next'
import Prompt from '../components/Prompt'

const Home: NextPage<HomeProps> = () => {
  return <Prompt></Prompt>
}

export default Home

export interface HomeProps {}
