import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Globe, Target, User, ChevronDown, ChevronUp } from 'lucide-react'
import { CompanyAutocomplete } from './CompanyAutocomplete'
import { GenerateBriefButton } from './GenerateBriefButton'

interface BriefFormProps {
  onSubmit: (data: { 
    companyName: string
    website?: string
    userIntent: string
    userCompany?: {
      name: string
      industry: string
      product: string
      valueProposition: string
      website?: string
      goals: string
    }
  }) => void
  isLoading: boolean
}

export function BriefForm({ onSubmit, isLoading }: BriefFormProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    userIntent: ''
  })
  
  const [userCompanyData, setUserCompanyData] = useState({
    name: '',
    industry: '',
    product: '',
    valueProposition: '',
    website: '',
    goals: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showUserCompany, setShowUserCompany] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }
    
    if (!formData.userIntent.trim()) {
      newErrors.userIntent = 'Please describe your intent'
    } else if (formData.userIntent.trim().length < 15) {
      newErrors.userIntent = 'Please provide more details about your intent (minimum 15 characters)'
    }
    
    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Please enter a valid URL (starting with http:// or https://)'
    }

    // Validate user company if section is expanded
    if (showUserCompany) {
      if (!userCompanyData.name.trim()) {
        newErrors.userCompanyName = 'Your company name is required'
      }
      if (!userCompanyData.industry.trim()) {
        newErrors.userCompanyIndustry = 'Industry is required'
      }
      if (!userCompanyData.product.trim()) {
        newErrors.userCompanyProduct = 'Product/service description is required'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        companyName: formData.companyName.trim(),
        website: formData.website.trim() || undefined,
        userIntent: formData.userIntent.trim(),
        userCompany: showUserCompany && userCompanyData.name ? {
          name: userCompanyData.name.trim(),
          industry: userCompanyData.industry.trim(),
          product: userCompanyData.product.trim(),
          valueProposition: userCompanyData.valueProposition.trim(),
          website: userCompanyData.website.trim() || undefined,
          goals: userCompanyData.goals.trim()
        } : undefined
      })
    }
  }

  const handleCompanyChange = (name: string, website?: string) => {
    setFormData(prev => ({
      ...prev,
      companyName: name,
      website: website || prev.website
    }))
    if (errors.companyName) {
      setErrors(prev => ({ ...prev, companyName: '' }))
    }
  }

  const intentExamples = [
    "As a DevOps automation platform, I want to pitch our CI/CD solution to help them streamline their deployment process and reduce time-to-market for their growing engineering team",
    "Our AI-powered analytics platform can help them optimize their data pipeline, reduce infrastructure costs, and improve decision-making speed as they scale",
    "I want to introduce our cybersecurity solution to protect their expanding remote workforce and cloud infrastructure during their growth phase",
    "As a customer success platform provider, I want to help them scale their support operations, improve retention rates, and handle their increasing customer base more efficiently"
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
        <div className="text-center mb-8">
          {/* <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div> */}
          <h2 className="text-3xl font-bold text-white mb-3">
            Generate Strategic Intelligence Brief
          </h2>
          <p className="text-gray-400 text-lg">
            Get personalized insights powered by live data sources and AI analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Your Company Context (Collapsible) */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6">
            <button
              type="button"
              onClick={() => setShowUserCompany(!showUserCompany)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Your Company Context</h3>
                  <p className="text-sm text-gray-400">Add your company info for personalized briefs (recommended)</p>
                </div>
              </div>
              {showUserCompany ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            <motion.div
              initial={false}
              animate={{ height: showUserCompany ? 'auto' : 0, opacity: showUserCompany ? 1 : 0 }}
              className="overflow-hidden"
            >
              <div className="pt-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Company Name *
                    </label>
                    <input
                      type="text"
                      value={userCompanyData.name}
                      onChange={(e) => setUserCompanyData({ ...userCompanyData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g., TechFlow Solutions"
                      disabled={isLoading}
                    />
                    {errors.userCompanyName && (
                      <p className="text-red-400 text-sm mt-2">{errors.userCompanyName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Industry/Sector *
                    </label>
                    <input
                      type="text"
                      value={userCompanyData.industry}
                      onChange={(e) => setUserCompanyData({ ...userCompanyData, industry: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g., SaaS, DevOps, AI/ML, Cybersecurity"
                      disabled={isLoading}
                    />
                    {errors.userCompanyIndustry && (
                      <p className="text-red-400 text-sm mt-2">{errors.userCompanyIndustry}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product/Service Overview *
                  </label>
                  <textarea
                    value={userCompanyData.product}
                    onChange={(e) => setUserCompanyData({ ...userCompanyData, product: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Brief description of what your company offers..."
                    disabled={isLoading}
                  />
                  {errors.userCompanyProduct && (
                    <p className="text-red-400 text-sm mt-2">{errors.userCompanyProduct}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Unique Value Proposition
                    </label>
                    <textarea
                      value={userCompanyData.valueProposition}
                      onChange={(e) => setUserCompanyData({ ...userCompanyData, valueProposition: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      placeholder="What makes you different from competitors..."
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Website
                    </label>
                    <input
                      type="url"
                      value={userCompanyData.website}
                      onChange={(e) => setUserCompanyData({ ...userCompanyData, website: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="https://yourcompany.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Target Company */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Building2 className="w-4 h-4 inline mr-2" />
              Target Company Name *
            </label>
            <CompanyAutocomplete
              value={formData.companyName}
              onChange={handleCompanyChange}
              placeholder="Start typing company name (e.g., Shopify, Stripe, OpenAI)"
              disabled={isLoading}
            />
            {errors.companyName && (
              <p className="text-red-400 text-sm mt-2">{errors.companyName}</p>
            )}
            <p className="text-gray-500 text-xs mt-2">
              We'll auto-suggest companies and fetch their website
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Globe className="w-4 h-4 inline mr-2" />
              Target Company Website (Optional)
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="https://company.com (auto-filled from company selection)"
              disabled={isLoading}
            />
            {errors.website && (
              <p className="text-red-400 text-sm mt-2">{errors.website}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <Target className="w-4 h-4 inline mr-2" />
              Your Strategic Intent *
            </label>
            <textarea
              value={formData.userIntent}
              onChange={(e) => setFormData({ ...formData, userIntent: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              placeholder="Describe what you want to pitch and how it can help them..."
              disabled={isLoading}
            />
            {errors.userIntent && (
              <p className="text-red-400 text-sm mt-2">{errors.userIntent}</p>
            )}
            
            {/* Intent Examples */}
            <div className="mt-4">
              <p className="text-gray-500 text-xs mb-3">Example intents (click to use):</p>
              <div className="grid gap-2">
                {intentExamples.map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData({ ...formData, userIntent: example })}
                    className="text-left p-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 hover:text-white text-sm transition-all duration-200"
                    disabled={isLoading}
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          <GenerateBriefButton
            onClick={handleSubmit}
            isLoading={isLoading}
          />

          {/* Data Sources Preview */}
          {/* <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Real-Time Data Sources</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                NewsData.io
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                JSearch Jobs
              </div>
              <div className="flex items-center gap-2 text-orange-400">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Yahoo Finance
              </div>
              <div className="flex items-center gap-2 text-pink-400">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                Twinword NLP
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                Groq AI
              </div>
            </div>
          </div> */}
        </form>
      </div>
    </motion.div>
  )
}