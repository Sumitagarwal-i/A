import { motion } from 'framer-motion'

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-2xl"
        >
          <img 
            src="/ChatGPT Image Jul 3, 2025, 06_33_42 PM.webp" 
            alt="PitchIntel Logo"
            className="w-20 h-20 object-contain rounded-3xl"
            loading="eager"
          />
        </motion.div> */}
        
        <motion.h3 
          className="text-xl font-semibold text-white mb-2"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Decrypting Signals...
        </motion.h3>
        
        <div className="flex items-center justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary-400 rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}