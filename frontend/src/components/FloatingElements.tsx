import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export const FloatingElements = () => {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }, [])

  const elements = ['🍃', '🌸', '🌿', '🍂', '🌱', '💮']

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-10"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            rotate: 0,
            scale: 0.5 + Math.random() * 0.5
          }}
          animate={{
            y: [null, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            x: [null, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            rotate: 360,
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 30 + i * 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          {el}
        </motion.div>
      ))}
    </div>
  )
}