import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { feedbackService } from '../lib/supabase'

export function FeedbackLikeModal() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFeedback = async (type: 'like' | 'dislike') => {
    setLoading(true)
    setError(null)
    try {
      await feedbackService.create(type, 'landing')
      setSubmitted(true)
    } catch (e) {
      setError('Failed to submit feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-3xl shadow flex flex-wrap md:flex-nowrap items-center justify-between gap-4 px-6 py-4">
      {submitted ? (
        <div className="w-full text-center">
          <span className="text-lg font-semibold text-white mr-2">Thank you for your feedback!</span>
        </div>
      ) : (
        <>
          <span className="text-base text-white font-medium">
            Did this app help you or could it help you in the future?
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleFeedback('like')}
              disabled={loading}
              aria-label="Like"
              className="flex items-center justify-center gap-1 px-4 py-2 border border-emerald-400 hover:bg-emerald-500/20 text-emerald-400 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
            >
              <ThumbsUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleFeedback('dislike')}
              disabled={loading}
              aria-label="Dislike"
              className="flex items-center justify-center gap-1 px-4 py-2 border border-red-400 hover:bg-red-500/20 text-red-400 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
            >
              <ThumbsDown className="w-5 h-5" />
            </button>
          </div>
          <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">No sign-in needed</span>
          {error && <span className="text-red-400 ml-4">{error}</span>}
        </>
      )}
    </div>
  )
}
