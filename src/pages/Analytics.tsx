import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Filter, Download } from 'lucide-react'
import { Brief, briefsService } from '../lib/supabase'
import { DashboardCharts } from '../components/DashboardCharts'
import { Navigation } from '../components/Navigation'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { useAuth } from '../contexts/AuthContext'
import { exportToPDF, exportToCSV } from '../utils/exportUtils'

export function Analytics() {
  const { user } = useAuth()
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState('all')

  useEffect(() => {
    if (user) {
      loadBriefs()
    }
  }, [user])

  const loadBriefs = async () => {
    try {
      setLoading(true)
      const data = await briefsService.getAll(user?.id)
      setBriefs(data)
    } catch (error) {
      console.error('Error loading briefs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBriefs = useMemo(() => briefs.filter(brief => {
    if (timeFilter === 'all') return true
    
    const briefDate = new Date(brief.createdAt)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - briefDate.getTime()) / (1000 * 60 * 60 * 24))
    
    switch (timeFilter) {
      case 'week': return diffDays <= 7
      case 'month': return diffDays <= 30
      case 'quarter': return diffDays <= 90
      default: return true
    }
  }), [briefs, timeFilter])

  const handleExport = (format: 'pdf' | 'csv') => {
    if (filteredBriefs.length === 0) return
    
    if (format === 'pdf') {
      exportToPDF(filteredBriefs)
    } else {
      exportToCSV(filteredBriefs)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="pt-24 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-2 flex items-center gap-3"
            >
              <BarChart3 className="w-8 h-8 text-blue-400" />
              Intelligence Analytics
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-lg"
            >
              Insights and trends from your strategic intelligence briefs
            </motion.p>
          </div>

          <div className="flex items-center gap-4">
            {/* Time Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
              </select>
            </div>

            {/* Export Buttons */}
            {filteredBriefs.length > 0 && (
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleExport('csv')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleExport('pdf')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  HTML
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Content */}
        {filteredBriefs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No data available
            </h3>
            <p className="text-gray-400 mb-8">
              {timeFilter === 'all' 
                ? 'Create your first brief to see analytics' 
                : 'No briefs found for the selected time period'
              }
            </p>
          </motion.div>
        ) : (
          <DashboardCharts briefs={filteredBriefs} />
        )}
      </div>
    </div>
  )
}