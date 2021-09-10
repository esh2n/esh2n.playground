import React, { useEffect, useRef } from 'react'
import tw, { styled } from 'twin.macro'

interface Props {}

const GameOfLife: React.FC<Props> = () => {
  const ref = useRef(null)
  useEffect(() => {
    init()
  }, [ref])

  const init = async () => {
    const { Universe } = await import('@esh2n/wasm-game-of-life')
    const universe = Universe.new()
    const renderLoop = () => {
      ref.current = universe.render()
      universe.tick()
      requestAnimationFrame(renderLoop)
    }

    requestAnimationFrame(renderLoop)
  }

  const GameWrapper = styled.div`
    ${tw`absolute flex flex-col bg-indigo-500 justify-center items-center w-12 h-12 my-10 mx-0`}
  `

  return (
    <>
      GameOfLife
      <GameWrapper ref={ref} />
    </>
  )
}

export default GameOfLife
