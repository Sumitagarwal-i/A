import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'
import { useUsageLimit } from '../hooks/useUsageLimit'
import { SignUpModal } from './SignUpModal'

interface GenerateBriefButtonProps {
  onClick: () => void
  isLoading?: boolean
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

export function GenerateBriefButton({ 
  onClick, 
  isLoading = false, 
  disabled = false,
  className = "",
  children 
}: GenerateBriefButtonProps) {
  const { canCreateBrief, incrementUsage, isLoggedIn, getRemainingBriefs } = useUsageLimit()
  const [showSignUpModal, setShowSignUpModal] = useState(false)

  const handleClick = () => {
    if (!canCreateBrief && !isLoggedIn) {
      // Show sign-up modal for non-logged-in users who've reached their limit
      setShowSignUpModal(true)
      return
    }

    // Increment usage for non-logged-in users
    if (!isLoggedIn) {
      incrementUsage()
    }

    // Call the original onClick handler
    onClick()
  }

  const isDisabled = disabled || isLoading || (!canCreateBrief && !isLoggedIn)

  return (
    <>
      <motion.button
        onClick={handleClick}
        disabled={isDisabled}
        whileHover={{ scale: isDisabled ? 1 : 1.02 }}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-2xl shadow-blue-500/25 ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing Real-Time Data...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            {children || 'Generate Intelligence Brief'}
          </>
        )}
      </motion.button>

      {/* Usage indicator for non-logged-in users */}
      {!isLoggedIn && (
        <div className="mt-3 text-center">
          <p className="text-gray-400 text-sm">
            {getRemainingBriefs() > 0 
              ? `${getRemainingBriefs()} free brief${getRemainingBriefs() === 1 ? '' : 's'} remaining`
              : 'Free briefs used up'
            }
          </p>
        </div>
      )}

      {/* Sign-up modal */}
      <SignUpModal 
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
      />
    </>
  )
} 