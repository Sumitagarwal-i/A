import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  MessageSquare, 
  Star, 
  Send,
  CheckCircle
} from 'lucide-react'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  trigger?: 'navigation' | 'brief-creation'
}

export function FeedbackModal({ isOpen, onClose, trigger = 'navigation' }: FeedbackModalProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitted(true)
    setIsSubmitting(false)
    
    // Close modal after 2 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setRating(null)
      setFeedback('')
      onClose()
    }, 2000)
  }

  const handleNoThanks = () => {
    onClose()
  }

  const getTitle = () => {
    if (trigger === 'brief-creation') {
      return 'How was your brief creation experience?'
    }
    return 'How are we doing?'
  }

  const getSubtitle = () => {
    if (trigger === 'brief-creation') {
      return 'We\'d love to hear about your experience creating this brief'
    }
    return 'Your feedback helps us improve PitchIntel for everyone'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleNoThanks}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden"
          >
            {isSubmitted ? (
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                <p className="text-gray-400">Your feedback helps us improve PitchIntel</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Feedback</h3>
                      <p className="text-xs text-gray-400">Help us improve</p>
                    </div>
                  </div>
                  <button
                    onClick={handleNoThanks}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {getTitle()}
                  </h4>
                  <p className="text-gray-400 text-sm mb-6">
                    {getSubtitle()}
                  </p>

                  {/* Rating */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Rate your experience
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setRating(star)}
                          className={`p-2 rounded-lg transition-colors ${
                            rating && star <= rating
                              ? 'text-yellow-400 bg-yellow-400/10'
                              : 'text-gray-500 hover:text-gray-400'
                          }`}
                        >
                          <Star className="w-6 h-6 fill-current" />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Additional feedback (optional)
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Tell us what you think..."
                      className="w-full h-24 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleNoThanks}
                      className="flex-1 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      No Thanks
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={!rating || isSubmitting}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Feedback
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}