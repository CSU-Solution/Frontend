"use client"
import { motion } from "framer-motion"

export default function AnalysisAnimation() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  }

  const personas = ["🧑‍⚕️", "👩‍🏫", "👨‍🔧", "👩‍💼"]

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100">
      <motion.div className="text-center space-y-8" variants={containerVariants} initial="hidden" animate="visible">
        {/* Central Rotating Globe */}
        <div className="flex justify-center">
          <motion.div
            className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center shadow-2xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <motion.div
              className="text-5xl"
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              🌐
            </motion.div>
          </motion.div>
        </div>

        {/* Orbiting Personas */}
        <div className="relative w-40 h-40 mx-auto">
          {personas.map((persona, index) => (
            <motion.div
              key={index}
              className="absolute w-12 h-12 text-3xl flex items-center justify-center"
              initial={{ x: 0, y: 0 }}
              animate={{
                x: Math.cos((index * Math.PI * 2) / personas.length) * 70,
                y: Math.sin((index * Math.PI * 2) / personas.length) * 70,
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              {persona}
            </motion.div>
          ))}
        </div>

        {/* Text Animation */}
        <motion.div className="space-y-4" variants={itemVariants}>
          <motion.p
            className="text-2xl font-semibold text-foreground"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Analyzing perspectives across cultures…
          </motion.p>
          <motion.p
            className="text-lg text-muted-foreground"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
          >
            Translating empathy into insight…
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  )
}
