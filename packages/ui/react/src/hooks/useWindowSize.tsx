import { useEffect, useState } from 'react'

const useWindowSize = () => {
  const [
    size,
    setSize,
  ] = useState<number[]>([
    0,
    0,
  ])

  const updateSize = () => {
    setSize([
      window.innerWidth,
      window.innerHeight,
    ])
  }

  useEffect(() => {
    window.addEventListener('resize', updateSize)

    updateSize()
    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return size
}

export { useWindowSize }
