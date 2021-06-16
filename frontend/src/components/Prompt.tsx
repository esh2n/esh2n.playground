import React, { useEffect, useRef } from 'react'
import { Elm as e } from '../Elm/Main.elm'

interface Props {}

const Prompt: React.FC<Props> = () => {
  const ref = useRef(null)
  useEffect(() => {
    e.Main.init({
      node: ref.current as HTMLElement,
      flags: null,
    })
    const f = async () => {
      const { greet } = await import('@esh2n/wasm')
      greet('from wasm')
    }
    f()
  }, [ref])
  return <div ref={ref} />
}

export default Prompt
