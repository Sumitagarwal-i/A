
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Mail, 
  MessageCircle, 
  RotateCcw, 
  Trash2, 
  History,
  Copy,
  CheckCircle,
  Building2,
  Globe,
  ExternalLink
} from 'lucide-react'
import { Brief } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { AddBriefModal } from './AddBriefModal'
import { HistoryModal } from './HistoryModal'

interface Message {
  id: string
  type: 'user' | 'ai' | 'draft'
  content: string
  timestamp: Date
  draftType?: 'email' | 'dm' | 'followup' | 'rebuttal'
  explanation?: string
}

interface OutreachSession {
  id: string
  brief_id: string
  session_name: string
  messages: Message[]
  created_at: string
  updated_at: string
  briefs?: Brief
}

const OUTCOME_CHIPS = [
  { id: 'positive', label: '✅ Positive Response', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  { id: 'no_response', label: '😐 No Response', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
  { id: 'objection', label: '🚫 Objection', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  { id: 'interested', label: '👀 Showed Interest', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { id: 'not_now', label: '⏰ Not Right Now', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  { id: 'wrong_person', label: '👤 Wrong Person', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' }
]

export function OutreachTab() {
  const { user } = useAuth()
  const [activeBrief, setActiveBrief] = useState<Brief | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAddBrief, setShowAddBrief] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showOutcomes, setShowOutcomes] = useState(false)
  const [lastDraftType, setLastDraftType] = useState<string>('')
  const [copiedId, setCopiedId] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleBriefSelect = (brief: Brief) => {
    setActiveBrief(brief)
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: `Great! I've loaded **${brief.companyName}** for outreach. Based on your brief, I can help you generate:\n\n📧 **Email Draft** - Professional outreach email\n💬 **LinkedIn DM** - Personal connection message\n\nWhat would you like to create first?`,
        timestamp: new Date()
      }
    ])
    setShowAddBrief(false)
  }

  const handleGenerateDraft = async (draftType: 'email' | 'dm' | 'followup' | 'rebuttal', lastOutcome?: string) => {
    if (!activeBrief || !user) return

    setIsGenerating(true)
    setLastDraftType(draftType)

    try {
      const response = await fetch(`https://yxqvopuiwpplgszmgpeo.supabase.co/functions/v1/generate-draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cXZvcHVpd3BwbGdzem1ncGVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NDg5ODAsImV4cCI6MjA2NjUyNDk4MH0.CPOr1Y78Gf08Gxs8-z2_YrBnFhBQyBGoIuvgfSNl1Co`,
        },
        body: JSON.stringify({
          brief_id: activeBrief.id,
          draft_type: draftType,
          last_outcome: lastOutcome
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate draft')
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'draft',
        content: result.draft,
        explanation: result.explanation,
        draftType,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, newMessage])
      setShowOutcomes(true)

    } catch (error) {
      console.error('Error generating draft:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `Sorry, I encountered an error generating the ${draftType}. Please try again.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleOutcomeSelect = (outcome: typeof OUTCOME_CHIPS[0]) => {
    const outcomeMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Outcome: ${outcome.label}`,
      timestamp: new Date()
    }

    let aiResponse = ''
    if (outcome.id === 'positive' || outcome.id === 'interested') {
      aiResponse = "🎉 Excellent! That's a great result. Would you like to generate a follow-up to keep the momentum going?"
    } else if (outcome.id === 'objection') {
      aiResponse = "I can help you craft a thoughtful rebuttal that addresses their concerns. Ready to generate one?"
    } else if (outcome.id === 'no_response') {
      aiResponse = "No worries! Let's create a follow-up that adds new value and gives them another reason to respond."
    } else {
      aiResponse = "Thanks for the update! Would you like to generate a follow-up or try a different approach?"
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: aiResponse,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, outcomeMessage, aiMessage])
    setShowOutcomes(false)
  }

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(''), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleReset = () => {
    setActiveBrief(null)
    setMessages([])
    setShowOutcomes(false)
    setLastDraftType('')
  }

  const handleSaveSession = async () => {
    if (!activeBrief || !user || messages.length === 0) return

    try {
      await fetch(`https://yxqvopuiwpplgszmgpeo.supabase.co/functions/v1/save-outreach-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cXZvcHVpd3BwbGdzem1ncGVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NDg5ODAsImV4cCI6MjA2NjUyNDk4MH0.CPOr1Y78Gf08Gxs8-z2_YrBnFhBQyBGoIuvgfSNl1Co`,
        },
        body: JSON.stringify({
          brief_id: activeBrief.id,
          messages,
          session_name: `${activeBrief.companyName} - ${new Date().toLocaleDateString()}`,
          user_id: user.id
        }),
      })
    } catch (error) {
      console.error('Error saving session:', error)
    }
  }

  const handleLoadSession = (session: OutreachSession) => {
    setActiveBrief(session.briefs as Brief)
    setMessages(session.messages)
    setShowHistory(false)
  }

  const hasLastDraft = messages.some(m => m.type === 'draft')
  const canGenerateFollowUp = hasLastDraft && showOutcomes

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Active Brief Header */}
      <AnimatePresence>
        {activeBrief && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="border-b border-gray-800 p-4"
          >
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{activeBrief.companyName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                      {activeBrief.signalTag}
                    </span>
                    {activeBrief.website && (
                      <a
                        href={activeBrief.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-gray-300"
                      >
                        <Globe className="w-3 h-3" />
                        {new URL(activeBrief.website).hostname}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Outreach Copilot</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Select a brief to start generating personalized outreach messages and follow-ups
              </p>
              <button
                onClick={() => setShowAddBrief(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl"
              >
                <Plus className="w-5 h-5" />
                Add Brief
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : message.type === 'draft' ? 'justify-center' : 'justify-start'}`}
                >
                  {message.type === 'draft' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {message.draftType === 'email' ? (
                            <Mail className="w-5 h-5 text-blue-400" />
                          ) : (
                            <MessageCircle className="w-5 h-5 text-blue-400" />
                          )}
                          <span className="text-white font-semibold capitalize">
                            {message.draftType} Draft
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(message.content, message.id)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
                        >
                          {copiedId === message.id ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      
                      <div className="bg-gray-800 rounded-lg p-4 mb-4 font-mono text-sm text-gray-100 whitespace-pre-wrap">
                        {message.content}
                      </div>
                      
                      {message.explanation && (
                        <div className="text-sm text-gray-400 bg-gray-800/50 rounded-lg p-3">
                          <strong className="text-gray-300">Why this works:</strong> {message.explanation}
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`max-w-xs sm:max-w-md px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-100'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content.split('**').map((part, index) => 
                          index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}

              {/* Outcome Chips */}
              <AnimatePresence>
                {showOutcomes && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex justify-center"
                  >
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4">
                      <p className="text-gray-300 text-sm text-center mb-4">
                        How did it go? Select an outcome:
                      </p>
                      <div className="grid grid-cols-2 gap-2 max-w-sm">
                        {OUTCOME_CHIPS.map((outcome) => (
                          <button
                            key={outcome.id}
                            onClick={() => handleOutcomeSelect(outcome)}
                            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all hover:scale-105 ${outcome.color}`}
                          >
                            {outcome.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="border-t border-gray-800 p-4 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setShowAddBrief(true)}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Brief</span>
            </button>

            <button
              onClick={() => handleGenerateDraft('email')}
              disabled={!activeBrief || isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-gray-800 text-white rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Draft</span>
            </button>

            <button
              onClick={() => handleGenerateDraft('dm')}
              disabled={!activeBrief || isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:bg-gray-800 text-white rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">DM</span>
            </button>

            <button
              onClick={() => handleGenerateDraft('followup')}
              disabled={!canGenerateFollowUp || isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:bg-gray-800 text-white rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Follow-Up</span>
            </button>

            <button
              onClick={handleReset}
              disabled={!activeBrief || isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:bg-gray-800 text-white rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={() => setShowHistory(true)}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>
          </div>

          {isGenerating && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center gap-2 text-blue-400">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddBriefModal
        isOpen={showAddBrief}
        onClose={() => setShowAddBrief(false)}
        onSelect={handleBriefSelect}
      />

      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onLoadSession={handleLoadSession}
      />
    </div>
  )
}
