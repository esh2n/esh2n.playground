import React, { useEffect, useRef } from 'react'

interface Props {}

const SiteView: React.FC<Props> = () => {
  const ref = useRef(null)
  // useEffect(() => {}, [ref])
  return <div ref={ref} />
}

export default SiteView
