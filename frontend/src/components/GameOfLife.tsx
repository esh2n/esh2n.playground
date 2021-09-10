import React, { useEffect } from 'react'
import tw, { styled } from 'twin.macro'

interface Props {}

const GameOfLife: React.FC<Props> = () => {
  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const { Universe } = await import('@esh2n/wasm-game-of-life')
    const pre = document.getElementById('game-of-life-canvas')

    const universe = Universe.new()
    const renderLoop = () => {
      pre.textContent = universe.render()
      universe.tick()
      requestAnimationFrame(renderLoop)
    }

    requestAnimationFrame(renderLoop)
  }

  const GameWrapper = styled.pre`
    ${tw`absolute flex flex-col bg-indigo-500 justify-center items-center w-96 h-96 my-10 mx-0`}
  `

  return (
    <>
      GameOfLife
      <GameWrapper id="game-of-life-canvas" />
    </>
  )
}

export default GameOfLife
