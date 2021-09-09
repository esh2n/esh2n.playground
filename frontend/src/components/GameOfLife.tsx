import React, { useEffect, useRef } from 'react'
import { Universe } from '../wasm/pkg/wasm_game_of_life.js'

interface Props {}

const GameOfLife: React.FC<Props> = () => {
  const ref = useRef(null)
  useEffect(() => {
    const universe = Universe.new()
    const renderLoop = () => {
      ref.current = universe.render()
      universe.tick()

      requestAnimationFrame(renderLoop)
    }
    requestAnimationFrame(renderLoop)
  }, [ref])

  return <div ref={ref} />
}

export default GameOfLife
