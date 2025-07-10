import { motion } from 'framer-motion'
import { 
  Database, 
  Newspaper, 
  Users, 
  Code, 
  Heart, 
  CheckCircle, 
  XCircle,
  ExternalLink
} from 'lucide-react'

interface IntelligenceSources {
  news?: number
  jobs?: number
  technologies?: number
  stockData?: boolean
  toneAnalysis?: boolean
  builtWithUsed?: boolean
}

interface IntelligenceSourcesProps {
  sources?: IntelligenceSources
}

export function IntelligenceSources({ sources }: IntelligenceSourcesProps) {
  const dataSources = [
    {
      name: 'NewsData.io',
      description: 'Real-time news aggregation',
      icon: Newspaper,
      color: 'emerald',
      count: sources?.news || 0,
      available: (sources?.news || 0) > 0,
      url: 'https://newsdata.io'
    },
    {
      name: 'JSearch API',
      description: 'Job postings and hiring signals',
      icon: Users,
      color: 'blue',
      count: sources?.jobs || 0,
      available: (sources?.jobs || 0) > 0,
      url: 'https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch'
    },
    {
      name: 'BuiltWith API',
      description: 'Technology stack detection',
      icon: Code,
      color: 'violet',
      count: sources?.technologies || 0,
      available: sources?.builtWithUsed || false,
      url: 'https://builtwith.com'
    },
    {
      name: 'Twinword API',
      description: 'NLP tone and emotion analysis',
      icon: Heart,
      color: 'pink',
      available: sources?.toneAnalysis || false,
      url: 'https://www.twinword.com'
    },
    {
      name: 'Clearbit',
      description: 'Company logos and metadata',
      icon: Database,
      color: 'gray',
      available: true,
      url: 'https://clearbit.com'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
      blue: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
      violet: 'bg-violet-500/10 border-violet-500/20 text-violet-300',
      pink: 'bg-pink-500/10 border-pink-500/20 text-pink-300',
      gray: 'bg-gray-500/10 border-gray-500/20 text-gray-300'
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  return (
    <div className="space-y-6">
      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataSources.map((source, index) => {
          const Icon = source.icon
          
          return (
            <motion.div
              key={source.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl p-6 border transition-all duration-200 hover:scale-105 ${
                source.available 
                  ? getColorClasses(source.color)
                  : 'bg-gray-800/30 border-gray-700 text-gray-500'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6" />
                  <div>
                    <h4 className="font-semibold">{source.name}</h4>
                    <p className="text-xs opacity-80">{source.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {source.available ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </div>
              
              {source.count !== undefined && source.count > 0 && (
                <div className="mb-3">
                  <div className="text-2xl font-bold">{source.count}</div>
                  <div className="text-xs opacity-80">data points</div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">
                  {source.available ? 'Active' : 'Unavailable'}
                </span>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity"
                >
                  Visit <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800"
      >
        <h4 className="text-lg font-semibold text-white mb-4">Intelligence Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{sources?.news || 0}</div>
            <div className="text-sm text-gray-400">News Articles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{sources?.jobs || 0}</div>
            <div className="text-sm text-gray-400">Job Postings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-violet-400">{sources?.technologies || 0}</div>
            <div className="text-sm text-gray-400">Technologies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              {dataSources.filter(s => s.available).length}
            </div>
            <div className="text-sm text-gray-400">Active Sources</div>
          </div>
        </div>
      </motion.div>

      {/* Data Quality Info */}
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
        <p className="text-xs text-gray-400 flex items-center gap-2">
          <Database className="w-3 h-3" />
          All data is collected in real-time from verified sources. Intelligence quality depends on public data availability.
        </p>
      </div>
    </div>
  )
}