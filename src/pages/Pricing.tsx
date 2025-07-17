import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  Zap, 
  ArrowRight,
  Sparkles,
  Users,
  Clock,
  Gift,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import { Navigation } from '../components/Navigation'
import { Link } from 'react-router-dom'

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const plans = [
    {
      name: 'Scanner Mode',
      description: 'Ideal for individual users and early-stage outreach.',
      price: { monthly: 0, yearly: 0 },
      icon: Sparkles,
      color: 'gray',
      features: [
        'Generate up to 3 strategic briefs/month',
        'Access real-time news insights',
        'Analyze job postings and hiring trends',
        'Understand tone and sentiment of company activity',
        'View summarized pitch recommendations',
        'BuiltWith-powered tech stack analysis'
      ],
      limitations: [
        'No advanced buyer persona mapping',
        'No usage history or CRM-ready formats',
        'No priority support',
        'No saving/exporting briefs'
      ],
      cta: 'Start Free',
      popular: false
    },
    {
      name: 'Intel Pro',
      description: 'For growth teams, SDRs, and founders who pitch smarter.',
      price: { monthly: 10, yearly: 100 },
      icon: Zap,
      color: 'blue',
      features: [
        'Unlimited brief generation',
        'BuiltWith tech stack analysis of company websites',
        'Advanced tone and intent analysis',
        'Suggested pitch angles, buyer personas & pain points',
        'Save Unlimited Briefs',
        'Export to PDF / email-ready format',
        'Early Access to New Features',
        'Priority access to new feature rollouts',
        'Premium support (48h response time)'
      ],
      limitations: [],
      cta: 'Upgrade to Intel Pro',
      popular: true
    }
  ]

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors = {
      gray: {
        bg: 'bg-gray-500/10',
        text: 'text-gray-400',
        border: 'border-gray-500/20'
      },
      blue: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/20'
      },
      purple: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
        border: 'border-purple-500/20'
      }
    }
    return colors[color as keyof typeof colors]?.[type] || colors.gray[type]
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="pt-24 container mx-auto px-4 py-8 sm:py-16 mt-20">
        {/* 30-Day Free Access Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-4 sm:p-6 mb-8 sm:mb-12 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-green-300 mb-2">
            🕒 Enjoy full access — free for 30 days!
          </h3>
          <p className="text-green-400 text-base sm:text-lg">
            No credit card required. Experience all Pro features during your trial period.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-3 sm:px-4 py-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-300 font-medium text-sm">29 days remaining</span>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            PitchIntel Pricing
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-6 sm:mb-8">
            Choose the plan that aligns with your prospecting strategy.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8 sm:mb-12">
            <span className={`text-sm font-medium ${!isYearly ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isYearly ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  isYearly ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-white' : 'text-gray-400'}`}>
              Yearly
            </span>
            {isYearly && (
              <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                Save 20%
              </span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto mb-12 sm:mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            const price = typeof plan.price.monthly === 'number' 
              ? (isYearly ? plan.price.yearly : plan.price.monthly)
              : plan.price.monthly

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-gray-900/50 backdrop-blur border rounded-2xl p-6 sm:p-8 ${
                  plan.popular 
                    ? 'border-blue-500/50 shadow-2xl shadow-blue-500/10' 
                    : 'border-gray-800 hover:border-gray-700'
                } transition-all duration-200 hover:scale-105`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6 sm:mb-8">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 ${getColorClasses(plan.color, 'bg')} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${getColorClasses(plan.color, 'text')}`} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm sm:text-base mb-4">{plan.description}</p>
                  <div className="mb-6">
                    {typeof price === 'number' ? (
                      <>
                        <span className="text-3xl sm:text-4xl font-bold text-white">${price}</span>
                        <span className="text-gray-400 text-sm sm:text-base">/{isYearly ? 'year' : 'month'}</span>
                        {isYearly && typeof plan.price.monthly === 'number' && plan.price.monthly > 0 && (
                          <div className="text-sm text-gray-500 line-through">
                            ${plan.price.monthly}/month
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-3xl sm:text-4xl font-bold text-white">{price}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations?.map((limitation, limitationIndex) => (
                    <div key={limitationIndex} className="flex items-center gap-3 opacity-50">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-gray-600 rounded-full" />
                      </div>
                      <span className="text-gray-500 text-sm sm:text-base">{limitation}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 relative group text-sm sm:text-base ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-blue-500/25'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600'
                  }`}
                  title="🚀 Everything is free for 30 days — no billing yet!"
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    🚀 Everything is free for 30 days — no billing yet!
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
                  </div>
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">Feature Comparison</h2>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-800 bg-gray-800/50">
              <div className="font-semibold text-white">Features</div>
              <div className="text-center font-semibold text-gray-400">Scanner Mode</div>
              <div className="text-center font-semibold text-blue-400">Intel Pro</div>
            </div>
            {[
              { name: 'Monthly Briefs', free: '3', pro: 'Unlimited' },
              { name: 'Real-time News & Signals', free: '✓', pro: '✓' },
              { name: 'Job/Team Expansion Signals', free: '✓', pro: '✓' },
              { name: 'Tone & Sentiment Analysis', free: '✓', pro: 'Advanced' },
              { name: 'Tech Arsenal (Stack Analysis)', free: '✓', pro: '✓' },
              { name: 'Save Briefs', free: '✗', pro: '✓' },
              { name: 'Export Briefs (PDF/HTML)', free: '✗', pro: '✓' },
              { name: 'Early Access to New Features', free: '✗', pro: '✓' },
              { name: 'Priority Support', free: '✗', pro: '✓' }
            ].map((row, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 p-4 border-b border-gray-800 last:border-b-0">
                <div className="text-gray-300 font-medium">{row.name}</div>
                <div className="text-center text-gray-400">{row.free}</div>
                <div className="text-center text-blue-400">{row.pro}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pricing FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">Pricing FAQs</h2>
          <div className="space-y-6">
            {/* Collapsible FAQ 1 */}
            <div className="border border-gray-800 rounded-xl overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors font-medium text-white" onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}>
                What's included in the free plan?
                {openFaq === 0 ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              <AnimatePresence>{openFaq === 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="p-4 pt-0 text-gray-400 leading-relaxed">
                    The free plan includes up to 3 briefs per month, real-time news insights, job trend analysis, tone/sentiment detection, and tech stack analysis. No credit card or sign-up required during early access.
                  </div>
                </motion.div>
              )}</AnimatePresence>
            </div>
            {/* Collapsible FAQ 2 */}
            <div className="border border-gray-800 rounded-xl overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors font-medium text-white" onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}>
                What do I get with the Pro plan?
                {openFaq === 1 ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              <AnimatePresence>{openFaq === 1 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="p-4 pt-0 text-gray-400 leading-relaxed">
                    Pro unlocks unlimited briefs, advanced AI insights, buyer persona detection, enhanced tech stack analysis, PDF export, early access to new features, and priority support. All Pro features are free for the first 30 days.
                  </div>
                </motion.div>
              )}</AnimatePresence>
            </div>
            {/* Collapsible FAQ 3 */}
            <div className="border border-gray-800 rounded-xl overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors font-medium text-white" onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}>
                How long is the free trial?
                {openFaq === 2 ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              <AnimatePresence>{openFaq === 2 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="p-4 pt-0 text-gray-400 leading-relaxed">
                    All features are free for 30 days from your first use. After that, Pro features require a subscription. A visible timer on this page tracks your free period.
                  </div>
                </motion.div>
              )}</AnimatePresence>
            </div>
            {/* Collapsible FAQ 4 */}
            <div className="border border-gray-800 rounded-xl overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors font-medium text-white" onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}>
                Do I need a credit card to start?
                {openFaq === 3 ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              <AnimatePresence>{openFaq === 3 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="p-4 pt-0 text-gray-400 leading-relaxed">
                    No credit card is required during the 30-day free access period. You can explore all features risk-free.
                  </div>
                </motion.div>
              )}</AnimatePresence>
            </div>
            {/* Collapsible FAQ 5 */}
            <div className="border border-gray-800 rounded-xl overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors font-medium text-white" onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}>
                What happens after the free period ends?
                {openFaq === 4 ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              <AnimatePresence>{openFaq === 4 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="p-4 pt-0 text-gray-400 leading-relaxed">
                    After 30 days, you can continue using the Scanner Mode plan for free with 3 briefs per month, or upgrade to Pro for unlimited access and advanced features. No charges will occur unless you choose to upgrade.
                  </div>
                </motion.div>
              )}</AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your B2B Intelligence?</h2>
          <p className="text-gray-300 mb-6 text-lg max-w-2xl mx-auto">
            Join thousands of sales professionals using PitchIntel to close more deals with AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white rounded-lg font-semibold text-lg transition-all duration-200"
            >
              <Users className="w-5 h-5" />
              Contact Sales
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}