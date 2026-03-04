import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export const FloatingLeaves = () => {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    })

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const leaves = [
    { icon: '🍃', size: 6, opacity: 0.25 },
    { icon: '🌿', size: 7, opacity: 0.3 },
    { icon: '🍂', size: 5, opacity: 0.2 },
    { icon: '🌱', size: 4, opacity: 0.25 },
    { icon: '🍀', size: 6, opacity: 0.3 },
    { icon: '🌼', size: 5, opacity: 0.2 },
    { icon: '🌸', size: 6, opacity: 0.25 },
    { icon: '🍁', size: 7, opacity: 0.3 },
    { icon: '🍃', size: 6, opacity: 0.25 },
    { icon: '🌿', size: 7, opacity: 0.3 },
    { icon: '🍂', size: 5, opacity: 0.2 },
    { icon: '🌱', size: 4, opacity: 0.25 },
    { icon: '🍀', size: 6, opacity: 0.3 },
    { icon: '🌼', size: 5, opacity: 0.2 },
    { icon: '🌸', size: 6, opacity: 0.25 },
    { icon: '🍁', size: 7, opacity: 0.3 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(12)].map((_, i) => {
        const leaf = leaves[i % leaves.length]
        const xPos = Math.random() * dimensions.width
        const yPos = Math.random() * dimensions.height
        const xMove = (Math.random() - 0.5) * 300
        const yMove = (Math.random() - 0.5) * 300
        const duration = 40 + i * 8
        const delay = i * 1.5
        const rotationDirection = Math.random() > 0.5 ? 1 : -1

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              x: xPos,
              y: yPos,
              opacity: leaf.opacity,
              fontSize: `${leaf.size * 4}px`,
            }}
            animate={{
              x: [xPos, xPos + xMove, xPos - xMove/2, xPos],
              y: [yPos, yPos + yMove, yPos - yMove/2, yPos],
              rotate: [0, 180 * rotationDirection, 360 * rotationDirection],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: delay,
              times: [0, 0.3, 0.7, 1]
            }}
          >
            {leaf.icon}
          </motion.div>
        )
      })}
    </div>
  )
}