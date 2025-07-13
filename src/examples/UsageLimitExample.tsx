import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useUsageLimit } from '../hooks/useUsageLimit'
import { GenerateBriefButton } from '../components/GenerateBriefButton'
import { SignUpModal } from '../components/SignUpModal'
import { UsageGuard } from '../components/UsageGuard'

/**
 * Example component demonstrating the usage limit system
 * 
 * This example shows:
 * 1. How to use the useUsageLimit hook
 * 2. How to integrate GenerateBriefButton
 * 3. How to use UsageGuard for protected routes
 * 4. How to show the SignUpModal
 */
export function UsageLimitExample() {
  const { 
    isLoading, 
    canCreateBrief, 
    incrementUsage, 
    getRemainingBriefs, 
    getUsagePercentage, 
    getDaysUntilReset, 
    isLoggedIn, 
    maxFreeBriefs 
  } = useUsageLimit()
  
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleGenerateBrief = async () => {
    setIsProcessing(true)
    
    // Simulate brief generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Increment usage (this is handled automatically by GenerateBriefButton)
    // incrementUsage()
    
    setIsProcessing(false)
    alert('Brief generated successfully!')
  }

  const handleShowSignUp = () => {
    setShowSignUpModal(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading usage data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Usage Limit System Example</h1>
        
        {/* Usage Status Display */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Usage Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Authentication Status:</p>
              <p className="text-white font-medium">
                {isLoggedIn ? 'Logged In (Unlimited)' : 'Not Logged In (Limited)'}
              </p>
            </div>
            
            <div>
              <p className="text-gray-400">Can Create Brief:</p>
              <p className={`font-medium ${canCreateBrief ? 'text-green-400' : 'text-red-400'}`}>
                {canCreateBrief ? 'Yes' : 'No'}
              </p>
            </div>
            
            <div>
              <p className="text-gray-400">Remaining Free Briefs:</p>
              <p className="text-white font-medium">
                {getRemainingBriefs() === Infinity ? 'Unlimited' : getRemainingBriefs()}
              </p>
            </div>
            
            <div>
              <p className="text-gray-400">Usage Percentage:</p>
              <p className="text-white font-medium">
                {getUsagePercentage()}%
              </p>
            </div>
            
            {!isLoggedIn && (
              <>
                <div>
                  <p className="text-gray-400">Days Until Reset:</p>
                  <p className="text-white font-medium">
                    {getDaysUntilReset()} days
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-400">Max Free Briefs:</p>
                  <p className="text-white font-medium">
                    {maxFreeBriefs}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Usage Progress Bar (for non-logged-in users) */}
        {!isLoggedIn && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Usage Progress</h2>
            
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-400">Free Briefs Used</span>
              <span className="text-white">
                {maxFreeBriefs - getRemainingBriefs()} / {maxFreeBriefs}
              </span>
            </div>
            
            <div className="w-full bg-gray-800 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getUsagePercentage()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <p className="text-gray-400 text-sm mt-2">
              Resets in {getDaysUntilReset()} days
            </p>
          </div>
        )}

        {/* Generate Brief Button Example */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Generate Brief Button</h2>
          <p className="text-gray-400 mb-4">
            This button automatically checks usage limits and shows the sign-up modal when needed.
          </p>
          
          <div className="max-w-md">
            <GenerateBriefButton
              onClick={handleGenerateBrief}
              isLoading={isProcessing}
            />
          </div>
        </div>

        {/* Manual Sign-up Button */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Manual Sign-up Modal</h2>
          <p className="text-gray-400 mb-4">
            You can also manually trigger the sign-up modal.
          </p>
          
          <motion.button
            onClick={handleShowSignUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Show Sign-up Modal
          </motion.button>
        </div>

        {/* Protected Content Example */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Protected Content</h2>
          <p className="text-gray-400 mb-4">
            This content is protected by UsageGuard and will redirect users who can't create briefs.
          </p>
          
          <UsageGuard>
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-300">
                ✅ This content is only visible to users who can create briefs.
              </p>
            </div>
          </UsageGuard>
        </div>

        {/* Manual Usage Control */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Manual Usage Control</h2>
          <p className="text-gray-400 mb-4">
            You can manually control usage tracking (though GenerateBriefButton handles this automatically).
          </p>
          
          <div className="flex gap-4">
            <motion.button
              onClick={incrementUsage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              disabled={isLoggedIn}
            >
              Manually Increment Usage
            </motion.button>
            
            <div className="text-gray-400 text-sm">
              {isLoggedIn ? '(Disabled for logged-in users)' : '(For testing purposes)'}
            </div>
          </div>
        </div>
      </div>

      {/* Sign-up Modal */}
      <SignUpModal 
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
      />
    </div>
  )
} 