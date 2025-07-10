import { motion } from 'framer-motion'
import { BookOpen, Zap, Target, TrendingUp, Database, HelpCircle } from 'lucide-react'
import { Navigation } from '../components/Navigation'
import { Link } from 'react-router-dom'

export function Docs() {
  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      content: [
        {
          title: 'Creating Your First Brief',
          description: 'Learn how to generate AI-powered strategic briefs for your B2B outreach.',
          steps: [
            'Navigate to the Briefs section',
            'Click "New Brief" to start',
            'Enter the company name (auto-complete will suggest options)',
            'Add the company website (optional but recommended)',
            'Describe your strategic intent in detail',
            'Click "Generate Intelligence Brief" to create your analysis'
          ]
        },
        {
          title: 'Understanding Your Brief',
          description: 'Each brief contains multiple sections designed to give you comprehensive insights.',
          steps: [
            'Executive Summary: High-level strategic overview',
            'Personalized Pitch Strategy: Tailored approach based on real data',
            'Subject Line: Ready-to-use email subject optimized for engagement',
            'Strategic Warnings: What NOT to pitch to avoid common mistakes',
            'Live News Intelligence: Recent company developments and news',
            'Hiring Intelligence: Current job postings and team expansion signals',
            'Technology Stack: Detected technologies and infrastructure'
          ]
        }
      ]
    },
    {
      id: 'features',
      title: 'Key Features',
      icon: Target,
      content: [
        {
          title: 'Real-Time Intelligence',
          description: 'Our platform aggregates data from multiple live sources to provide the most current insights.',
          steps: [
            'NewsData.io integration for latest company news',
            'JSearch API for hiring signals and job postings',
            'BuiltWith API for technology stack detection',
            'Clearbit integration for company logos and metadata'
          ]
        },
        {
          title: 'AI-Powered Analysis',
          description: 'Advanced AI models process raw data to generate strategic insights.',
          steps: [
            'Groq LLaMA-3 for strategic analysis and pitch generation',
            'Natural language processing for sentiment analysis',
            'Pattern recognition for hiring trends and market signals',
            'Contextual understanding for personalized recommendations'
          ]
        }
      ]
    },
    {
      id: 'data-sources',
      title: 'Data Sources',
      icon: Database,
      content: [
        {
          title: 'News Intelligence',
          description: 'Stay informed about company developments and market movements.',
          steps: [
            'Real-time news aggregation from trusted business sources',
            'Sentiment analysis of recent coverage',
            'Timeline of significant company events',
            'Source attribution and credibility scoring'
          ]
        },
        {
          title: 'Hiring Signals',
          description: 'Understand company growth and expansion through hiring patterns.',
          steps: [
            'Active job posting analysis',
            'Department-wise hiring trends',
            'Geographic expansion indicators',
            'Salary range and role seniority insights'
          ]
        },
        {
          title: 'Technology Stack',
          description: 'Comprehensive analysis of company technology infrastructure.',
          steps: [
            'Frontend and backend technology detection',
            'Cloud platform and infrastructure analysis',
            'Development tools and frameworks identification',
            'Confidence scoring for each detected technology'
          ]
        }
      ]
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      icon: TrendingUp,
      content: [
        {
          title: 'Writing Effective Intent Statements',
          description: 'Your strategic intent drives the entire analysis. Make it count.',
          steps: [
            'Be specific about your offering and value proposition',
            'Include relevant industry context and timing',
            'Mention specific pain points your solution addresses',
            'Provide enough detail for AI to generate targeted insights',
            'Example: "Pitch our DevOps automation platform to help them scale their deployment process and reduce time-to-market as they expand their engineering team"'
          ]
        },
        {
          title: 'Using Brief Insights Effectively',
          description: 'Maximize the impact of your generated briefs in real outreach.',
          steps: [
            'Reference specific recent news or developments in your outreach',
            'Align your timing with detected hiring or expansion signals',
            'Avoid the strategic warnings highlighted in each brief',
            'Customize the generated pitch angle with your specific details',
            'Use the subject line as a starting point, then personalize further'
          ]
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: HelpCircle,
      content: [
        {
          title: 'Common Issues',
          description: 'Solutions to frequently encountered problems.',
          steps: [
            'Brief generation fails: Check your internet connection and try again',
            'No company suggestions: Try typing the full company name',
            'Missing data: Some companies may have limited public information',
            'Slow loading: Large companies with extensive data may take longer to process'
          ]
        },
        {
          title: 'Data Quality',
          description: 'Understanding the reliability and freshness of your data.',
          steps: [
            'News data is updated in real-time from verified sources',
            'Job postings reflect current openings but may have posting delays',
            'Technology stack detection has varying confidence levels',
            'AI analysis quality improves with more detailed intent statements'
          ]
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navigation />
      
      <div className="pt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            IntelliBrief Documentation
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to know to master AI-powered B2B intelligence and strategic outreach.
          </p>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Table of Contents</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors group"
                >
                  <Icon className="w-5 h-5 text-primary-400 group-hover:text-primary-300" />
                  <span className="text-gray-300 group-hover:text-white">{section.title}</span>
                </a>
              )
            })}
          </div>
        </motion.div>

        {/* Documentation Sections */}
        <div className="space-y-12">
          {sections.map((section, sectionIndex) => {
            const Icon = section.icon
            return (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + sectionIndex * 0.1 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                </div>

                <div className="space-y-8">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-l-2 border-primary-500/30 pl-6">
                      <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                      <p className="text-gray-400 mb-4">{item.description}</p>
                      <ul className="space-y-2">
                        {item.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-primary-400 rounded-full" />
                            </div>
                            <span className="text-gray-300">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.section>
            )
          })}
        </div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-primary-500/10 to-violet-500/10 border border-primary-500/20 rounded-xl p-8 text-center mt-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Need More Help?</h2>
          <p className="text-gray-300 mb-6">
            Can't find what you're looking for? Our team is here to help you succeed with IntelliBrief.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              Contact Support
            </Link>
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg font-medium transition-colors"
            >
              Join Community
            </motion.button> */}
          </div>
        </motion.div>
      </div>
    </div>
  )
}