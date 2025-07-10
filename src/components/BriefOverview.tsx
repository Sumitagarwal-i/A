import { motion } from 'framer-motion'
import { 
  Building2, 
  Globe, 
  TrendingUp, 
  Users, 
  Code, 
  Newspaper,
  ExternalLink,
  Clock,
  BarChart3,
  Heart
} from 'lucide-react'
import { Brief } from '../lib/supabase'

interface BriefOverviewProps {
  brief: Brief
}

export function BriefOverview({ brief }: BriefOverviewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
    return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  }

  const logoUrl = getCompanyLogo(brief.website)
  const hasJobSignals = brief.jobSignals && brief.jobSignals.length > 0
  const hasTechStack = brief.techStack && brief.techStack.length > 0
  const hasNews = brief.news && brief.news.length > 0
  const hasToneData = brief.toneInsights?.emotion

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8"
    >
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Company Info */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative flex-shrink-0">
              {logoUrl && logoUrl.startsWith('/') && logoUrl.endsWith('.png') ? (
                <img 
                  src={logoUrl.replace('.png', '.webp')} 
                  alt={`${brief.companyName} logo`} 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover bg-gray-800 border border-gray-700 shadow-lg" 
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
              <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg ${logoUrl ? 'hidden' : ''}`}>
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 truncate">{brief.companyName}</h1>
              {brief.website && (
                <a 
                  href={brief.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors text-sm truncate"
                >
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{new URL(brief.website).hostname.replace('www.', '')}</span>
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                </a>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
              <Clock className="w-4 h-4" />
              Generated {formatDate(brief.createdAt)}
            </div>
            
            <div>
              <span className={`inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-full border ${getSignalColor(brief.signalTag)}`}>
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{brief.signalTag}</span>
                <span className="sm:hidden">{brief.signalTag.split(' ')[0]}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Intelligence Metrics */}
        <div className="lg:col-span-2">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2" title="High-level, AI-generated overview of the company's position and signals.">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            Strategic Summary
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* News Signals */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 sm:p-4 text-center">
              <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-lg sm:text-xl font-bold text-white">{hasNews ? brief.news.length : 0}</div>
              <div className="text-xs text-emerald-300">News</div>
            </div>

            {/* Job Signals */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 sm:p-4 text-center">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-lg sm:text-xl font-bold text-white">{hasJobSignals ? brief.jobSignals?.length || 0 : 0}</div>
              <div className="text-xs text-blue-300">Jobs</div>
            </div>

            {/* Tech Stack */}
            <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 sm:p-4 text-center">
              <Code className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400 mx-auto mb-2" />
              <div className="text-lg sm:text-xl font-bold text-white">{hasTechStack ? brief.techStack.length : 0}</div>
              <div className="text-xs text-violet-300">Tech</div>
            </div>

            {/* Tone Analysis */}
            <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-3 sm:p-4 text-center">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 mx-auto mb-2" />
              <div className="text-lg sm:text-xl font-bold text-white capitalize">
                {hasToneData ? brief.toneInsights?.emotion?.slice(0, 3) : '—'}
              </div>
              <div className="text-xs text-pink-300">Tone</div>
            </div>
          </div>

          {/* Key Insights */}
          {(brief.hiringTrends || brief.newsTrends) && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {brief.hiringTrends && (
                <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-gray-300">Hiring Trends</span>
                  </div>
                  <p className="text-xs text-gray-400">{brief.hiringTrends}</p>
                </div>
              )}

              {brief.newsTrends && (
                <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Newspaper className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-gray-300">News Sentiment</span>
                  </div>
                  <p className="text-xs text-gray-400">{brief.newsTrends}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}