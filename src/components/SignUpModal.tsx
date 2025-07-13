import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, CheckCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const { signInWithGoogle } = useAuth()

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle()
      onClose()
    } catch (error) {
      console.error('Google sign up failed:', error)
    }
  }

  const benefits = [
    'Unlimited strategic briefs',
    'Save your brief history',
    'Get email updates and insights',
    'Export to PDF and CSV',
    'Advanced analytics dashboard',
    'Priority customer support'
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                You've used your free brief!
              </h2>
              <p className="text-gray-400">
                Sign up to unlock unlimited briefs, save your history, and get updates.
              </p>
            </div>

            {/* Benefits */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                What you'll get:
              </h3>
              <div className="space-y-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sign up button */}
            <motion.button
              onClick={handleGoogleSignUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold py-3 px-6 rounded-lg shadow hover:bg-gray-100 transition-colors mb-4 border border-gray-300"
            >
              <img 
                src="https://developers.google.com/identity/images/g-logo.png" 
                alt="Google logo" 
                className="w-5 h-5" 
              />
              Sign up with Google
            </motion.button>

            {/* Alternative sign up */}
            <div className="text-center">
              <button
                onClick={() => {
                  onClose()
                  // Navigate to login page
                  window.location.href = '/login'
                }}
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm flex items-center justify-center gap-1 mx-auto"
              >
                Or sign up with email
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-800 text-center">
              <p className="text-gray-500 text-xs">
                Free forever for individual users. No credit card required.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 