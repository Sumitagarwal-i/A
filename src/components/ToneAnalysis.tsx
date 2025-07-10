import { motion } from 'framer-motion'
import { Heart, Brain, TrendingUp, AlertCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts'

interface ToneInsights {
  emotion?: string
  confidence?: number
  mood?: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  emotions?: Array<{ name: string; score: number }>
}

interface ToneAnalysisProps {
  toneInsights?: ToneInsights
}

export function ToneAnalysis({ toneInsights }: ToneAnalysisProps) {
  if (!toneInsights || !toneInsights.emotion) {
    return (
      <div className="bg-gray-900/50 rounded-2xl p-8 text-center border border-gray-800">
        <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-400 mb-2">No Tone Analysis Available</h3>
        <p className="text-gray-500 text-sm">Tone analysis could not be performed for this brief</p>
      </div>
    )
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400'
      case 'negative': return 'text-red-400'
      case 'neutral': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const getEmotionColor = (emotion?: string) => {
    const colors: Record<string, string> = {
      joy: '#10b981',
      trust: '#3b82f6',
      fear: '#ef4444',
      surprise: '#f59e0b',
      sadness: '#6366f1',
      disgust: '#84cc16',
      anger: '#dc2626',
      anticipation: '#8b5cf6'
    }
    return colors[emotion?.toLowerCase() || ''] || '#6b7280'
  }

  const emotionData = toneInsights.emotions?.map(emotion => ({
    name: emotion.name,
    value: emotion.score,
    color: getEmotionColor(emotion.name)
  })) || []

  return (
    <div className="space-y-6">
      {/* Primary Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-pink-400" />
            <h4 className="text-lg font-semibold text-white">Primary Emotion</h4>
          </div>
          <div className="text-2xl font-bold text-pink-300 mb-2 capitalize">
            {toneInsights.emotion}
          </div>
          {toneInsights.confidence && (
            <div className="text-sm text-gray-400">
              Confidence: {Math.round(toneInsights.confidence * 100)}%
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-blue-400" />
            <h4 className="text-lg font-semibold text-white">Overall Mood</h4>
          </div>
          <div className="text-2xl font-bold text-blue-300 mb-2 capitalize">
            {toneInsights.mood || 'Neutral'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <h4 className="text-lg font-semibold text-white">Sentiment</h4>
          </div>
          <div className={`text-2xl font-bold mb-2 capitalize ${getSentimentColor(toneInsights.sentiment)}`}>
            {toneInsights.sentiment || 'Neutral'}
          </div>
        </div>
      </div>

      {/* Emotion Breakdown */}
      {emotionData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800"
          >
            <h4 className="text-lg font-semibold text-white mb-6">Emotion Distribution</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emotionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {emotionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Score']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {emotionData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-400 capitalize">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800"
          >
            <h4 className="text-lg font-semibold text-white mb-6">Emotion Scores</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emotionData}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    fontSize={12}
                    domain={[0, 1]}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Score']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {emotionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}

      {/* Analysis Info */}
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
        <p className="text-xs text-gray-400 flex items-center gap-2">
          <Brain className="w-3 h-3" />
          Tone analysis powered by Twinword API. Based on user intent and company news sentiment.
        </p>
      </div>
    </div>
  )
}