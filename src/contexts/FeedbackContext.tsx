import { createContext, useContext, useState, ReactNode } from 'react'

interface FeedbackContextType {
  shouldShowFeedback: boolean
  feedbackTrigger: 'navigation' | 'brief-creation' | null
  showFeedback: (trigger: 'navigation' | 'brief-creation') => void
  hideFeedback: () => void
  markBriefAsViewed: (briefId: string) => void
  hasViewedBrief: (briefId: string) => boolean
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined)

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [shouldShowFeedback, setShouldShowFeedback] = useState(false)
  const [feedbackTrigger, setFeedbackTrigger] = useState<'navigation' | 'brief-creation' | null>(null)
  const [viewedBriefs, setViewedBriefs] = useState<Set<string>>(new Set())

  const showFeedback = (trigger: 'navigation' | 'brief-creation') => {
    setFeedbackTrigger(trigger)
    setShouldShowFeedback(true)
  }

  const hideFeedback = () => {
    setShouldShowFeedback(false)
    setFeedbackTrigger(null)
  }

  const markBriefAsViewed = (briefId: string) => {
    setViewedBriefs(prev => new Set([...prev, briefId]))
  }

  const hasViewedBrief = (briefId: string) => {
    return viewedBriefs.has(briefId)
  }

  return (
    <FeedbackContext.Provider
      value={{
        shouldShowFeedback,
        feedbackTrigger,
        showFeedback,
        hideFeedback,
        markBriefAsViewed,
        hasViewedBrief
      }}
    >
      {children}
    </FeedbackContext.Provider>
  )
}

export function useFeedback() {
  const context = useContext(FeedbackContext)
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider')
  }
  return context
} 