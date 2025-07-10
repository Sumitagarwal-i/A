import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Copy, 
  ExternalLink, 
  CheckCircle,
  Globe,
  Newspaper,
  Briefcase,
  TrendingUp,
  Clock,
  ArrowRight,
  Trash2,
  AlertTriangle
} from 'lucide-react'
import { Brief } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { BriefStatsChart } from './BriefStatsChart'

interface BriefCardProps {
  brief: Brief
  onDelete?: (id: string) => void
}

export function BriefCard({ brief, onDelete }: BriefCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    
    setIsDeleting(true)
    try {
      await onDelete(brief.id)
    } catch (error) {
      console.error('Failed to delete brief:', error)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getCompanyLogo = (website?: string) => {
    if (!website) return null
    try {
      const domain = new URL(website).hostname.replace('www.', '')
      return `https://logo.clearbit.com/${domain}`
    } catch {
      return null
    }
  }

  const getSignalColor = (tag: string) => {
    const lowerTag = tag.toLowerCase()
    if (lowerTag.includes('hiring') || lowerTag.includes('talent')) return 'bg-green-500/20 text-green-300 border-green-500/30'
    if (lowerTag.includes('funding') || lowerTag.includes('series') || lowerTag.includes('raised')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    if (lowerTag.includes('growth') || lowerTag.includes('scaling')) return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    if (lowerTag.includes('launch') || lowerTag.includes('product')) return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    return 'bg-primary-500/20 text-primary-300 border-primary-500/30'
  }

  const logoUrl = getCompanyLogo(brief.website)
  const hasRecentNews = brief.news && brief.news.length > 0
  const recentNewsCount = hasRecentNews ? brief.news.length : 0

  // Prepare chart data
  const chartData = {
    news: recentNewsCount,
    jobs: brief.jobSignals?.length || 0,
    technologies: brief.techStack?.length || 0
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/5 relative group"
    >
      {/* Delete Button */}
      {onDelete && (
        <div className="absolute top-4 right-4 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      )}

      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative flex-shrink-0">
              {logoUrl && logoUrl.startsWith('/') && logoUrl.endsWith('.png') ? (
                <img 
                  src={logoUrl.replace('.png', '.webp')} 
                  alt={`${brief.companyName} logo`} 
                  width="40"
                  height="40"
                  loading="lazy"
                  className="w-10 h-10 rounded-full"
                />
              ) : logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={`${brief.companyName} logo`}
                  width="40"
                  height="40"
                  loading="lazy"
                  className="w-10 h-10 rounded-full"
                />
              ) : null}
              <div className={`w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-r from-primary-500 to-violet-500 rounded-xl flex items-center justify-center ${logoUrl ? 'hidden' : ''}`}>
                <Building2 className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1 truncate">{brief.companyName}</h3>
              {brief.website && (
                <a 
                  href={brief.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 text-xs sm:text-sm flex items-center gap-1 transition-colors truncate"
                >
                  <Globe className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{new URL(brief.website).hostname.replace('www.', '')}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-start gap-2">
            <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              {formatDate(brief.createdAt)}
            </div>
            <span className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-medium rounded-full border ${getSignalColor(brief.signalTag)}`}>
              <TrendingUp className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">{brief.signalTag}</span>
              <span className="sm:hidden">{brief.signalTag.split(' ')[0]}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Executive Summary */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Strategic Summary
          </h4>
          <p className="text-gray-300 leading-relaxed line-clamp-3 text-sm sm:text-base">{brief.summary}</p>
        </div>

        {/* Intelligence Chart */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Intelligence Overview</h4>
          <BriefStatsChart data={chartData} />
        </div>

        {/* Intelligence Signals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
          {/* News Signals */}
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="w-4 h-4 text-green-400" />
              <span className="text-xs font-medium text-gray-400">News Signals</span>
            </div>
            <div className="text-sm text-white font-medium">
              {recentNewsCount > 0 ? `${recentNewsCount} recent headlines` : 'No recent news'}
            </div>
            {hasRecentNews && (
              <div className="text-xs text-gray-400 mt-1 truncate">
                Latest: {brief.news[0].source}
              </div>
            )}
          </div>

          {/* Tech Stack */}
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-medium text-gray-400">Tech Stack</span>
            </div>
            <div className="text-sm text-white font-medium">
              {brief.techStack && brief.techStack.length > 0 ? `${brief.techStack.length} technologies` : 'Stack detected'}
            </div>
            {brief.techStack && brief.techStack.length > 0 && (
              <div className="text-xs text-gray-400 mt-1 truncate">
                {brief.techStack.slice(0, 2).join(', ')}
                {brief.techStack.length > 2 && ` +${brief.techStack.length - 2} more`}
              </div>
            )}
          </div>
        </div>

        {/* Tech Stack Preview */}
        {brief.techStack && brief.techStack.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Detected Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {brief.techStack.slice(0, 5).map((tech, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
              {brief.techStack.length > 5 && (
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-700/50 border border-gray-600 text-gray-400 rounded-lg text-xs">
                  +{brief.techStack.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => copyToClipboard(brief.pitchAngle, 'pitch')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 font-medium text-sm flex-1 shadow-lg hover:shadow-violet-500/25"
          >
            {copiedField === 'pitch' ? (
              <><CheckCircle className="w-4 h-4" /> Copied Pitch!</>
            ) : (
              <><Copy className="w-4 h-4" /> Copy Pitch</>
            )}
          </button>
          <Link
            to={`/brief/${brief.id}`}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white rounded-lg transition-all duration-200 font-medium text-sm"
          >
            <ArrowRight className="w-4 h-4" />
            Full Brief
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-sm mx-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Delete Brief</h3>
                <p className="text-sm text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the brief for <strong>{brief.companyName}</strong>?
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}