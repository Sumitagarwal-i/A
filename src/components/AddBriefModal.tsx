
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Search, Building2, Globe, TrendingUp } from 'lucide-react'
import { Brief, briefsService } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface AddBriefModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (brief: Brief) => void
}

export function AddBriefModal({ isOpen, onClose, onSelect }: AddBriefModalProps) {
  const { user } = useAuth()
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [filteredBriefs, setFilteredBriefs] = useState<Brief[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadBriefs()
      setSearchTerm('')
    }
  }, [isOpen, user])

  useEffect(() => {
    if (searchTerm) {
      const filtered = briefs.filter(brief =>
        brief.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brief.signalTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brief.summary.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredBriefs(filtered)
    } else {
      setFilteredBriefs(briefs)
    }
  }, [searchTerm, briefs])

  const loadBriefs = async () => {
    try {
      setIsLoading(true)
      const data = await briefsService.getAll(user?.id)
      setBriefs(data)
      setFilteredBriefs(data)
    } catch (error) {
      console.error('Error loading briefs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = (brief: Brief) => {
    onSelect(brief)
    onClose()
  }

  const getSignalColor = (tag: string) => {
    const lowerTag = tag.toLowerCase()
    if (lowerTag.includes('hiring') || lowerTag.includes('talent')) return 'bg-green-500/20 text-green-300 border-green-500/30'
    if (lowerTag.includes('funding') || lowerTag.includes('series') || lowerTag.includes('raised')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    if (lowerTag.includes('growth') || lowerTag.includes('scaling')) return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    if (lowerTag.includes('launch') || lowerTag.includes('product')) return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
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
            <h2 className="text-xl font-bold text-white">Select Brief</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search briefs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-96 p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading briefs...</p>
            </div>
          ) : filteredBriefs.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                {searchTerm ? 'No briefs match your search' : 'No briefs available'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBriefs.map((brief) => (
                <motion.button
                  key={brief.id}
                  onClick={() => handleSelect(brief)}
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
                          <h3 className="text-white font-semibold">{brief.companyName}</h3>
                          {brief.website && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Globe className="w-3 h-3" />
                              {new URL(brief.website).hostname}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getSignalColor(brief.signalTag)}`}>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {brief.signalTag}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {brief.summary}
                      </p>
                    </div>
                    
                    <div className="text-xs text-gray-500 ml-4">
                      {new Date(brief.createdAt).toLocaleDateString()}
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
