'use client'

import { useEffect, useState } from 'react'

const useWindowSize = () => {
  const [
    size,
    setSize,
  ] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      return [
        window.innerWidth,
        window.innerHeight,
      ]
    }
    return [
      0,
      0,
    ]
  })

  const updateSize = () => {
    setSize([
      window.innerWidth,
      window.innerHeight,
    ])
  }

  useEffect(() => {
    window.addEventListener('resize', updateSize)

    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return size
}

export { useWindowSize }
