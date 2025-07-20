
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, History, Building2, Clock, MessageCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface HistorySession {
  id: string
  brief_id: string
  session_name: string
  messages: any[]
  created_at: string
  updated_at: string
  briefs?: {
    companyName: string
    website?: string
    signalTag: string
  }
}

interface HistoryModalProps {
  isOpen: boolean
  onClose: () => void
  onLoadSession: (session: HistorySession) => void
}

export function HistoryModal({ isOpen, onClose, onLoadSession }: HistoryModalProps) {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<HistorySession[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && user) {
      loadSessions()
    }
  }, [isOpen, user])

  const loadSessions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`https://yxqvopuiwpplgszmgpeo.supabase.co/functions/v1/get-outreach-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cXZvcHVpd3BwbGdzem1ncGVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NDg5ODAsImV4cCI6MjA2NjUyNDk4MH0.CPOr1Y78Gf08Gxs8-z2_YrBnFhBQyBGoIuvgfSNl1Co`,
        },
        body: JSON.stringify({
          user_id: user.id
        }),
      })

      const result = await response.json()
      setSessions(result.sessions || [])
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadSession = (session: HistorySession) => {
    onLoadSession(session)
    onClose()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="border-b border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Outreach History</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-96 p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No outreach sessions yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Your conversation history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <motion.button
                  key={session.id}
                  onClick={() => handleLoadSession(session)}
                  className="w-full text-left p-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 rounded-xl transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">
                            {session.briefs?.companyName || 'Unknown Company'}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <MessageCircle className="w-3 h-3" />
                            {session.messages?.length || 0} messages
                            {session.briefs?.signalTag && (
                              <>
                                <span>•</span>
                                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full">
                                  {session.briefs.signalTag}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500 ml-4">
                      <Clock className="w-3 h-3" />
                      {formatDate(session.updated_at)}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
