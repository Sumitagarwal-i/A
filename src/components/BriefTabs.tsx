import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Target, 
  Mail, 
  AlertTriangle, 
  Newspaper, 
  Users, 
  Code, 
  Brain,
  Database,
  Copy,
  CheckCircle,
  ChevronDown,
  Heart,
  Zap,
  Building2,
  Calendar,
  Shield,
  TrendingUp
} from 'lucide-react'
import { Brief } from '../lib/supabase'
import { NewsCard } from './NewsCard'
import { HiringChart } from './HiringChart'
import { TechStackGrid } from './TechStackGrid'
import { ToneAnalysis } from './ToneAnalysis'
import { IntelligenceSources } from './IntelligenceSources'

interface BriefTabsProps {
  brief: Brief
  layout?: 'vertical' | 'content' | 'horizontal'
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

export function BriefTabs({ brief, layout = 'horizontal', activeTab: externalActiveTab, onTabChange }: BriefTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState('summary')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Use external activeTab if provided, otherwise use internal state
  const activeTab = externalActiveTab || internalActiveTab

  const handleTabChange = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId)
    } else {
      setInternalActiveTab(tabId)
    }
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Enhanced strategic insights with user company context
  const deriveContextualInsights = () => {
    const newsCount = brief.news?.length || 0
    const jobsCount = brief.jobSignals?.length || 0
    const techCount = brief.techStack?.length || 0
    const sentiment = brief.toneInsights?.sentiment || 'neutral'
    const emotion = brief.toneInsights?.emotion || 'neutral'
    const mood = brief.toneInsights?.mood || 'neutral'
    
    // Derive top hiring roles
    const topRoles = brief.jobSignals?.slice(0, 3).map(job => {
      const title = job.title.toLowerCase()
      if (title.includes('engineer') || title.includes('developer')) return 'Engineering'
      if (title.includes('product') || title.includes('pm')) return 'Product'
      if (title.includes('sales') || title.includes('account')) return 'Sales'
      if (title.includes('marketing') || title.includes('growth')) return 'Marketing'
      if (title.includes('data') || title.includes('ai') || title.includes('ml')) return 'Data/AI'
      return 'Operations'
    }) || []

    // Infer strategic priorities based on user intent
    const isScaling = jobsCount > 5
    const isAIFocused = brief.techStack?.some(tech => 
      tech.toLowerCase().includes('ai') || 
      tech.toLowerCase().includes('ml') || 
      tech.toLowerCase().includes('python')
    ) || false
    
    const hasPositiveNews = brief.news?.some(n => 
      n.title.toLowerCase().includes('funding') ||
      n.title.toLowerCase().includes('growth') ||
      n.title.toLowerCase().includes('expansion')
    ) || false

    // Extract user company context from intent
    const extractUserCompanyContext = () => {
      const intent = brief.userIntent
      let userProduct = 'solution'
      let userValue = 'efficiency and growth'
      let userIndustry = 'technology'

      // Extract product/service type from intent
      if (intent.includes('devops') || intent.includes('ci/cd')) {
        userProduct = 'DevOps automation platform'
        userValue = 'deployment efficiency and reduced time-to-market'
        userIndustry = 'DevOps'
      } else if (intent.includes('analytics') || intent.includes('data')) {
        userProduct = 'AI-powered analytics platform'
        userValue = 'data insights and decision-making speed'
        userIndustry = 'Data Analytics'
      } else if (intent.includes('cybersecurity') || intent.includes('security')) {
        userProduct = 'cybersecurity solution'
        userValue = 'security and compliance'
        userIndustry = 'Cybersecurity'
      } else if (intent.includes('customer success') || intent.includes('support')) {
        userProduct = 'customer success platform'
        userValue = 'customer retention and support efficiency'
        userIndustry = 'Customer Success'
      } else if (intent.includes('sales') || intent.includes('crm')) {
        userProduct = 'sales enablement platform'
        userValue = 'sales productivity and revenue growth'
        userIndustry = 'Sales Technology'
      }

      return { userProduct, userValue, userIndustry }
    }

    const userContext = extractUserCompanyContext()

    return {
      newsCount,
      jobsCount,
      techCount,
      sentiment,
      emotion,
      mood,
      topRoles: [...new Set(topRoles)],
      isScaling,
      isAIFocused,
      hasPositiveNews,
      userContext
    }
  }

  const insights = deriveContextualInsights()

  const tabs = [
    {
      id: 'summary',
      label: 'Strategic Summary',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'pitch',
      label: 'Pitch Strategy',
      icon: Target,
      color: 'purple'
    },
    {
      id: 'subject',
      label: 'Subject Line',
      icon: Mail,
      color: 'green'
    },
    {
      id: 'warnings',
      label: 'What NOT to Pitch',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      id: 'news',
      label: 'Recent Signals',
      icon: Newspaper,
      color: 'emerald',
      count: brief.news?.length || 0
    },
    {
      id: 'hiring',
      label: 'Team Expansion Signals',
      icon: Users,
      color: 'blue',
      count: brief.jobSignals?.length || 0
    },
    {
      id: 'tech',
      label: 'Tech Arsenal',
      icon: Code,
      color: 'violet',
      count: brief.techStack?.length || 0
    },
    {
      id: 'tone',
      label: 'NLP Tone Analysis',
      icon: Heart,
      color: 'pink'
    },
    {
      id: 'sources',
      label: 'Intelligence Sources',
      icon: Database,
      color: 'gray'
    }
  ]

  const getTabColor = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'text-gray-400 hover:text-blue-300 hover:bg-blue-500/10',
      purple: isActive ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'text-gray-400 hover:text-purple-300 hover:bg-purple-500/10',
      green: isActive ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'text-gray-400 hover:text-green-300 hover:bg-green-500/10',
      red: isActive ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'text-gray-400 hover:text-red-300 hover:bg-red-500/10',
      emerald: isActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/10',
      violet: isActive ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' : 'text-gray-400 hover:text-violet-300 hover:bg-violet-500/10',
      orange: isActive ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' : 'text-gray-400 hover:text-orange-300 hover:bg-orange-500/10',
      pink: isActive ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' : 'text-gray-400 hover:text-pink-300 hover:bg-pink-500/10',
      gray: isActive ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-500/10'
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">

                <Brain className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white" title="High-level, AI-generated overview of the company’s position and signals.">AI-Generated Strategic Summary</h3>

                <Zap className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-semibold text-white">🚀 Strategic Opportunity: {brief.companyName}</h3>
              </div>
              
              <div className="prose prose-invert max-w-none space-y-6">
                <p className="text-gray-300 leading-relaxed text-lg">
                  {brief.companyName} presents a compelling strategic opportunity for your {insights.userContext.userProduct}. 
                  With {insights.sentiment} market sentiment and {insights.emotion} emotional positioning, they're showing {insights.hasPositiveNews ? 'strong growth momentum' : 'stable operations'} 
                  {insights.isScaling && ` with aggressive hiring across ${insights.jobsCount} roles`}. 
                  Their current market position creates an ideal window for strategic partnership.
                </p>

                <div className="bg-gray-800/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    🔍 Key Signals
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-300">
                        <strong>{insights.newsCount} recent news mentions</strong> - {insights.sentiment} sentiment indicates {insights.hasPositiveNews ? 'growth momentum perfect for your ' + insights.userContext.userProduct : 'stable operations ready for efficiency solutions'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-300">
                        <strong>{insights.jobsCount} active hiring roles</strong> - {insights.isScaling ? 'Aggressive scaling creates immediate need for ' + insights.userContext.userValue : 'Selective growth indicates focus on high-impact solutions like yours'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-300">
                        <strong>{insights.techCount} technologies detected</strong> -{insights.isAIFocused ? 'AI/ML focus aligns with modern ' + insights.userContext.userIndustry + ' solutions' : 'Traditional stack suggests opportunity for ' + insights.userContext.userProduct + ' integration'}
                      </span>
                    </li>

                  </ul>
                </div>

                <div className="bg-gray-800/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    🧠 Inferred Priorities
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    Based on their hiring patterns and technology signals, {brief.companyName} is prioritizing {insights.isScaling ? 'rapid scaling operations' : 'operational optimization'}.
                    {insights.isAIFocused && ' Their AI/ML technology adoption suggests innovation-driven growth that aligns with modern ' + insights.userContext.userIndustry + ' solutions.'}
                    {insights.topRoles.length > 0 && ` Heavy investment in ${insights.topRoles.join(' and ')} teams creates immediate opportunities for ${insights.userContext.userProduct} to deliver ${insights.userContext.userValue}.`}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-400" />
                    🎯 Strategic Angle for Your {insights.userContext.userProduct}
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    The convergence of their {insights.sentiment} market position, {insights.emotion} emotional state, and {insights.isScaling ? 'scaling' : 'optimization'} phase creates perfect timing for your {insights.userContext.userProduct}. 
                    Their current trajectory shows clear need for solutions that deliver {insights.userContext.userValue}, making this an ideal strategic partnership opportunity.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/30">
                    {insights.isScaling ? 'Scaling Operations' : 'Optimizing Efficiency'}
                  </span>
                  {insights.isAIFocused && (
                    <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium border border-purple-500/30">
                      AI-Driven Growth
                    </span>
                  )}
                  <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-medium border border-green-500/30">
                    {insights.sentiment.charAt(0).toUpperCase() + insights.sentiment.slice(1)} Market Sentiment
                  </span>
                  <span className="bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium border border-orange-500/30">
                    {insights.userContext.userIndustry} Opportunity
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 'pitch':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-purple-400" />
                  <h3 className="text-2xl font-semibold text-white">🎯 Pitch Strategy for Your {insights.userContext.userProduct}</h3>
                </div>
                <button
                  onClick={() => copyToClipboard(brief.pitchAngle, 'pitch')}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-purple-500/25"
                >
                  {copiedField === 'pitch' ? (
                    <><CheckCircle className="w-4 h-4" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy Strategy</>
                  )}
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-800/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    📌 Positioning Angle
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    Your {insights.userContext.userProduct} fits perfectly with {brief.companyName}'s {insights.sentiment} market position and {insights.isScaling ? 'aggressive scaling needs' : 'operational optimization goals'}. 
                    Their {insights.emotion} emotional state and {insights.jobsCount} active hiring roles create immediate receptiveness to solutions that deliver {insights.userContext.userValue}.
                  </p>
                </div>

                <div className="bg-gray-800/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-400" />
                    🧠 Primary Hook
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    "{brief.companyName}'s {insights.isScaling ? 'rapid expansion' : 'strategic growth'} across {insights.topRoles.join(', ')} teams creates the perfect opportunity for your {insights.userContext.userProduct} to deliver immediate impact. 
                    With {insights.newsCount} recent developments showing {insights.sentiment} momentum, they need solutions that scale with their ambitions while ensuring {insights.userContext.userValue}."
                  </p>
                </div>

                <div className="bg-gray-800/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    ❗ Pain Points Your {insights.userContext.userProduct} Solves
                  </h4>
                  <ul className="space-y-3">
                    {insights.isScaling && (
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-300">
                          <strong>Scaling complexity:</strong> {insights.jobsCount} new hires need streamlined processes that your {insights.userContext.userProduct} provides
                        </span>
                      </li>
                    )}
                    {insights.isAIFocused && (
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-300">
                          <strong>AI/ML infrastructure gaps:</strong> Their innovation initiatives need robust {insights.userContext.userIndustry} solutions
                        </span>
                      </li>
                    )}
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-300">
                        <strong>Cross-functional alignment:</strong> {insights.topRoles.length > 0 ? `${insights.topRoles.join(' and ')} teams need better coordination` : 'Growing teams need unified visibility'} that your platform delivers
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-800/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-400" />
                    👤 Ideal Buyer Personas at {brief.companyName}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {insights.topRoles.includes('Engineering') && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="font-medium text-blue-300">VP of Engineering</div>
                        <div className="text-sm text-gray-400">Needs {insights.userContext.userValue} for scaling tech operations</div>
                      </div>
                    )}
                    {insights.topRoles.includes('Product') && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <div className="font-medium text-green-300">Head of Product</div>
                        <div className="text-sm text-gray-400">Requires visibility into {insights.userContext.userIndustry} metrics</div>
                      </div>
                    )}
                    {insights.topRoles.includes('Sales') && (
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                        <div className="font-medium text-purple-300">VP of Sales</div>
                        <div className="text-sm text-gray-400">Scaling revenue operations with your solution</div>
                      </div>
                    )}
                    {insights.topRoles.includes('Operations') && (
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                        <div className="font-medium text-orange-300">Chief Operating Officer</div>
                        <div className="text-sm text-gray-400">Optimizing {insights.userContext.userValue} across teams</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-400" />
                    📣 Messaging Themes for Your {insights.userContext.userIndustry} Solution
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center">
                      <div className="font-medium text-purple-300">Operational Visibility</div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                      <div className="font-medium text-blue-300">{insights.isScaling ? 'Scaling Efficiency' : 'Process Optimization'}</div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                      <div className="font-medium text-green-300">Strategic {insights.userContext.userValue}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-yellow-400" />
                    🚧 Objections to Anticipate
                  </h4>
                  <div className="space-y-4">
                    <div className="border-l-4 border-yellow-500/30 pl-4">
                      <div className="text-yellow-300 font-medium">"We're already using existing {insights.userContext.userIndustry} tools"</div>
                      <div className="text-gray-400 text-sm mt-1">→ "Our {insights.userContext.userProduct} integrates with your existing stack to provide unified {insights.userContext.userValue} visibility"</div>
                    </div>
                    <div className="border-l-4 border-yellow-500/30 pl-4">
                      <div className="text-yellow-300 font-medium">"Not the right time for new initiatives"</div>
                      <div className="text-gray-400 text-sm mt-1">→ "Actually, your {insights.isScaling ? 'scaling phase with ' + insights.jobsCount + ' new hires' : 'optimization focus'} makes this the perfect time for {insights.userContext.userValue}"</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-400" />
                    📥 Suggested CTA
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    "Happy to share a 5-minute async audit on your {insights.isScaling ? 'scaling' : 'operational'} signals and how companies like {brief.companyName} typically optimize {insights.userContext.userValue} with our {insights.userContext.userProduct}."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 'subject':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-green-400" />
                  <h3 className="text-2xl font-semibold text-white">Strategic Subject Lines for Your {insights.userContext.userProduct}</h3>
                </div>
                <button
                  onClick={() => copyToClipboard(brief.subjectLine, 'subject')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-colors font-medium"
                >
                  {copiedField === 'subject' ? (
                    <><CheckCircle className="w-4 h-4" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy Subject</>
                  )}
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-block bg-green-500/20 border border-green-500/30 rounded-xl px-8 py-6 mb-6">
                    <p className="text-green-300 font-semibold text-xl">"{brief.subjectLine}"</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Contextual Alternatives for Your {insights.userContext.userIndustry} Solution</h4>
                    <div className="space-y-3">
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <div className="text-green-300 font-medium">{insights.userContext.userProduct} for {brief.companyName}'s {insights.isScaling ? 'Scaling' : 'Growth'}</div>
                        <div className="text-xs text-gray-400 mt-1">Direct, solution-focused approach</div>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <div className="text-green-300 font-medium">Accelerating {insights.userContext.userValue} at {brief.companyName}</div>
                        <div className="text-xs text-gray-400 mt-1">Value-focused positioning</div>
                      </div>
                      {insights.hasPositiveNews && (
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <div className="text-green-300 font-medium">{brief.companyName} Growth + {insights.userContext.userIndustry} Partnership</div>
                          <div className="text-xs text-gray-400 mt-1">Timely, momentum-based</div>
                        </div>
                      )}
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <div className="text-green-300 font-medium">{insights.userContext.userValue} Strategy for {brief.companyName}</div>
                        <div className="text-xs text-gray-400 mt-1">Strategic, consultative tone</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Subject Line Guidelines for {insights.userContext.userIndustry}</h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">≤60 characters for mobile optimization</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">Include {brief.companyName} for personalization</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">Reference your {insights.userContext.userProduct} value</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">Align with their {insights.sentiment} market sentiment</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">No generic sales language or excessive punctuation</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Context-Aware Timing</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Given {brief.companyName}'s {insights.sentiment} sentiment and {insights.isScaling ? 'active scaling with ' + insights.jobsCount + ' open roles' : 'strategic growth phase'}, 
                    your subject line should emphasize {insights.hasPositiveNews ? 'momentum and partnership' : 'strategic value and efficiency'}. 
                    Their {insights.emotion} emotional state suggests they're {insights.emotion === 'joy' || insights.emotion === 'trust' ? 'receptive to growth-focused messaging' : 'focused on stability and proven solutions'}.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 'warnings':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h3 className="text-2xl font-semibold text-white">❌ What NOT to Pitch to {brief.companyName}</h3>
              </div>
              
              <div className="space-y-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg mb-6">
                    Based on {brief.companyName}'s current {insights.sentiment} market position and {insights.emotion} emotional state, 
                    avoid these strategic misalignments when pitching your {insights.userContext.userProduct}:
                  </p>
                </div>

                <div className="grid gap-6">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-red-300 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Strategic Misalignments for Your {insights.userContext.userIndustry} Solution
                    </h4>
                    <ul className="space-y-3">
                      {insights.isScaling && (
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-300">
                            <strong>Don't lead with cost reduction:</strong> They're in expansion mode with {insights.jobsCount} active hires - focus on {insights.userContext.userValue} instead
                          </span>
                        </li>
                      )}
                      {insights.sentiment === 'negative' && (
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-300">
                            <strong>Avoid aggressive competitive comparisons:</strong> Their {insights.sentiment} sentiment requires supportive, partnership-focused positioning
                          </span>
                        </li>
                      )}
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-300">
                          <strong>Don't pitch generic {insights.userContext.userIndustry} benefits:</strong> They need specific ROI outcomes related to their {insights.isAIFocused ? 'AI initiatives' : 'core operations'}
                        </span>
                      </li>
                      {!insights.isScaling && (
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-300">
                            <strong>Skip aggressive scaling pitches:</strong> Their selective hiring suggests focus on optimization over rapid expansion
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-orange-300 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Timing & Context Mistakes
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-300">
                          <strong>Don't ignore their {insights.emotion} emotional state:</strong> Your {insights.userContext.userProduct} pitch must align with their current {insights.mood} mood
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-300">
                          <strong>Avoid generic timing assumptions:</strong> Their {insights.newsCount} recent developments require contextual awareness of their specific situation
                        </span>
                      </li>

                    </ul>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-yellow-300 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      {insights.userContext.userIndustry} Solution Pitfalls
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-300">
                          <strong>Never underestimate their {insights.userContext.userIndustry} sophistication:</strong> {insights.techCount} technologies and {insights.isAIFocused ? 'AI focus' : 'operational maturity'} indicate advanced capabilities
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-300">
                          <strong>Don't assume they lack {insights.userContext.userIndustry} tools:</strong> Position your {insights.userContext.userProduct} as enhancement, not replacement
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-300">
                          <strong>Avoid one-size-fits-all messaging:</strong> Their {insights.sentiment} market approach and {insights.topRoles.join(', ')} focus requires tailored {insights.userContext.userValue} positioning
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-400" />
                      Strategic Context Summary
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {brief.companyName}'s {insights.sentiment} sentiment, {insights.emotion} emotional positioning, and {insights.isScaling ? 'scaling trajectory' : 'optimization focus'} 
                      create specific requirements for how you position your {insights.userContext.userProduct}. 
                      Success depends on aligning your {insights.userContext.userValue} message with their current {insights.mood} state and {insights.hasPositiveNews ? 'growth momentum' : 'operational priorities'}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 'news':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Newspaper className="w-6 h-6 text-emerald-400" />
                <h3 className="text-xl font-semibold text-white" title="Real-world data that helps you pitch smarter.">Recent Signals</h3>
                <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-medium">
                  {brief.news?.length || 0} articles
                </span>
              </div>
            </div>
            {brief.news && brief.news.length > 0 ? (
              <div className="space-y-4">
                {brief.news.map((newsItem, index) => (
                  <NewsCard key={index} news={newsItem} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent news found for this company</p>
              </div>
            )}
          </motion.div>
        )

      case 'hiring':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white" title="Hiring and team growth patterns detected from public data.">Team Expansion Signals</h3>
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                  {brief.jobSignals?.length || 0} positions
                </span>
              </div>
            </div>
            <HiringChart jobSignals={brief.jobSignals || []} />
          </motion.div>
        )

      case 'tech':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Code className="w-6 h-6 text-violet-400" />
                <h3 className="text-xl font-semibold text-white" title="See what powers the company behind the scenes.">Tech Arsenal</h3>
                <span className="bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full text-sm font-medium">
                  {brief.techStack?.length || 0} technologies
                </span>
              </div>
            </div>
            <TechStackGrid techStack={brief.techStackData || []} />
          </motion.div>
        )

      case 'tone':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-pink-400" />
              <h3 className="text-xl font-semibold text-white">NLP Tone & Emotion Analysis</h3>
            </div>
            <ToneAnalysis toneInsights={brief.toneInsights} />
          </motion.div>
        )

      case 'sources':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-gray-400" />
              <h3 className="text-xl font-semibold text-white">Intelligence Sources</h3>
            </div>
            <IntelligenceSources sources={brief.intelligenceSources} />
          </motion.div>
        )

      default:
        return null
    }
  }

  // Vertical Tab Navigation (Left Sidebar) - Fixed height without scrollbar
  if (layout === 'vertical') {
    return (
      <div className="space-y-2 h-fit">
        {/* Mobile Dropdown */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 rounded-xl text-white font-medium"
          >
            <span>{tabs.find(tab => tab.id === activeTab)?.label}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-1 bg-gray-800 rounded-xl p-2"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        handleTabChange(tab.id)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-left ${
                        isActive 
                          ? `${getTabColor(tab.color, true)} border` 
                          : getTabColor(tab.color, false)
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="flex-1">{tab.label}</span>
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className="bg-current/20 text-current px-2 py-0.5 rounded-full text-xs font-medium">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Vertical Navigation - Fixed height, no scrollbar */}
        <div className="hidden lg:block space-y-2 min-h-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-left ${
                  isActive 
                    ? `${getTabColor(tab.color, true)} border` 
                    : getTabColor(tab.color, false)
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-current/20 text-current px-2 py-0.5 rounded-full text-xs font-medium">
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Content Area (Right Side)
  if (layout === 'content') {
    return (
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </div>
    )
  }

  // Horizontal Layout (Default)
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-800">
        <div className="flex overflow-x-auto scrollbar-hide">
          <div className="flex space-x-1 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-t-xl font-medium transition-all duration-200 border-b-2 ${
                    isActive 
                      ? `${getTabColor(tab.color, true)} border-current` 
                      : `${getTabColor(tab.color, false)} border-transparent hover:border-gray-600`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="bg-current/20 text-current px-2 py-0.5 rounded-full text-xs font-medium">
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </div>
    </div>
  )
}