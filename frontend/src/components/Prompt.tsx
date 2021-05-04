import React, { useEffect, useRef } from 'react'
import { Elm as e } from '../Elm/Main.elm'

interface Props {}

const Prompt: React.FC<Props> = () => {
  const ref = useRef(null)
  useEffect(() => {
    e.Elm.Main.init({
      node: ref.current as HTMLElement,
      flags: null,
    })
  }, [ref])
  return <div ref={ref} />
}

export default Prompt
