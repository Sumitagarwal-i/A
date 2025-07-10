import { motion } from 'framer-motion'
import { Users, MapPin, DollarSign, TrendingUp, Briefcase, Calendar, AlertCircle } from 'lucide-react'
import { JobSignal } from '../lib/supabase'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts'

interface HiringChartProps {
  jobSignals: JobSignal[]
}

export function HiringChart({ jobSignals }: HiringChartProps) {
  if (!jobSignals || jobSignals.length === 0) {
    return (
      <div className="bg-gray-800/30 rounded-xl p-8 text-center border border-gray-700">
        <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-400 mb-2">No hiring data available</h3>
        <p className="text-gray-500 text-sm">No recent job postings detected for this company</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Move getCategoryColor above its first usage
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Engineering': return '#3b82f6'
      case 'Data/AI': return '#8b5cf6'
      case 'Product': return '#10b981'
      case 'Sales': return '#f59e0b'
      case 'Marketing': return '#ec4899'
      case 'Design': return '#6366f1'
      case 'DevOps': return '#ef4444'
      default: return '#6b7280'
    }
  }

  // Analyze job patterns for meaningful data
  const roleAnalysis = jobSignals.reduce((acc, job) => {
    const title = job.title.toLowerCase()
    let category = 'Other'
    
    if (title.includes('engineer') || title.includes('developer') || title.includes('architect')) category = 'Engineering'
    else if (title.includes('data') || title.includes('ai') || title.includes('ml')) category = 'Data/AI'
    else if (title.includes('product') || title.includes('pm')) category = 'Product'
    else if (title.includes('sales') || title.includes('account')) category = 'Sales'
    else if (title.includes('marketing') || title.includes('growth')) category = 'Marketing'
    else if (title.includes('design') || title.includes('ux') || title.includes('ui')) category = 'Design'
    else if (title.includes('devops') || title.includes('sre') || title.includes('infrastructure')) category = 'DevOps'
    
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const locationAnalysis = jobSignals.reduce((acc, job) => {
    const location = job.location.split(',')[0].trim()
    acc[location] = (acc[location] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topRoles = Object.entries(roleAnalysis).sort(([,a], [,b]) => b - a).slice(0, 5)
  const topLocations = Object.entries(locationAnalysis).sort(([,a], [,b]) => b - a).slice(0, 3)

  // Prepare chart data
  const roleChartData = topRoles.map(([name, value]) => ({
    name,
    value,
    color: getCategoryColor(name)
  }))

  const locationChartData = topLocations.map(([name, value]) => ({ name, count: value }))

  const hasRoleData = topRoles.length > 0 && topRoles.some(([,count]) => count > 0)
  const hasLocationData = topLocations.length > 1

  return (
    <div className="space-y-6">
      {/* Hiring Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
          <Briefcase className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{jobSignals.length}</div>
          <div className="text-sm text-blue-300">Open Positions</div>
        </div>
        
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
          <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{topRoles.length}</div>
          <div className="text-sm text-green-300">Departments</div>
        </div>
        
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center">
          <MapPin className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{topLocations.length}</div>
          <div className="text-sm text-purple-300">Locations</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Role Distribution Chart */}
        {hasRoleData ? (
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2" title="Hiring and team growth patterns detected from public data.">
              <Users className="w-5 h-5 text-blue-400" />
              Team Expansion Signals
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {roleChartData.map((entry, index) => (
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
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {roleChartData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-400">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-400 mb-2">Department Analysis</h4>
              <p className="text-gray-500 text-sm">Insufficient data for department visualization</p>
            </div>
          </div>
        )}

        {/* Location Distribution Chart */}
        {hasLocationData ? (
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-400" />
              Top Locations
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationChartData}>
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-400 mb-2">Location Analysis</h4>
              <p className="text-gray-500 text-sm">Insufficient location data for visualization</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Job Postings */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-400" />
          Recent Postings
        </h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {jobSignals.slice(0, 5).map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h5 className="font-medium text-white line-clamp-1">{job.title}</h5>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                  {formatDate(job.postedDate)}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span>{job.salary}</span>
                  </div>
                )}
              </div>
              
              {job.description && (
                <p className="text-xs text-gray-500 line-clamp-2">
                  {job.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}