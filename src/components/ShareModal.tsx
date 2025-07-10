import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Link as LinkIcon, 
  Download, 
  Share2,
  CheckCircle,
  ExternalLink
} from 'lucide-react'
import { Brief } from '../lib/supabase'

interface ShareModalProps {
  brief: Brief
  isOpen: boolean
  onClose: () => void
}

export function ShareModal({ brief, isOpen, onClose }: ShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isGeneratingLinkedIn, setIsGeneratingLinkedIn] = useState(false)

  const shareUrl = `${window.location.origin}/brief/${brief.id}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleExportPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      // Generate PDF export
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>PitchIntel Brief - ${brief.companyName}</title>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; margin: 40px; background: #000; color: #fff; }
            .header { text-align: center; margin-bottom: 40px; }
            .company-name { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
            .section { margin-bottom: 30px; page-break-inside: avoid; }
            .section-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #60a5fa; }
            .content { line-height: 1.6; margin-bottom: 20px; }
            .tech-stack { display: flex; flex-wrap: wrap; gap: 8px; }
            .tech-item { background: #1f2937; padding: 4px 12px; border-radius: 6px; font-size: 14px; }
            .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; color: #dc2626; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">${brief.companyName}</div>
            <p>Strategic Intelligence Brief</p>
            <p><small>Generated on ${new Date().toLocaleDateString()}</small></p>
          </div>
          
          <div class="section">
            <div class="section-title">Strategic Summary</div>
            <div class="content">${brief.summary}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Personalized Pitch Strategy</div>
            <div class="content">${brief.pitchAngle}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Subject Line</div>
            <div class="content">"${brief.subjectLine}"</div>
          </div>
          
          <div class="section warning">
            <div class="section-title">What NOT to Pitch</div>
            <div class="content">${brief.whatNotToPitch}</div>
          </div>
          
          ${brief.techStack && brief.techStack.length > 0 ? `
            <div class="section">
              <div class="section-title">Technology Stack</div>
              <div class="tech-stack">
                ${brief.techStack.map(tech => `<span class="tech-item">${tech}</span>`).join('')}
              </div>
            </div>
          ` : ''}
          
          <div class="section">
            <div class="section-title">Intelligence Sources</div>
            <p>News Articles: ${brief.news?.length || 0}</p>
            <p>Job Postings: ${brief.jobSignals?.length || 0}</p>
            <p>Technologies: ${brief.techStack?.length || 0}</p>
          </div>
        </body>
        </html>
      `

      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pitchintel-brief-${brief.companyName.toLowerCase().replace(/\s+/g, '-')}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleLinkedInPost = async () => {
    setIsGeneratingLinkedIn(true)
    try {
      // Generate comprehensive LinkedIn post content
      const briefSummary = brief.summary.length > 100 
        ? brief.summary.substring(0, 100) + '...' 
        : brief.summary

      const linkedInText = `🚀 Just ran a strategic brief on ${brief.companyName} using PitchIntel — brilliant AI-driven insights!

📊 Key Intelligence:
• ${brief.news?.length || 0} recent news articles analyzed
• ${brief.jobSignals?.length || 0} hiring signals detected  
• ${brief.techStack?.length || 0} technologies identified

💡 Strategic Summary: ${briefSummary}

${brief.toneInsights?.sentiment ? `📈 Market Sentiment: ${brief.toneInsights.sentiment}` : ''}

👉 Check it out: ${shareUrl}

#B2BIntelligence #AIPowered #SalesStrategy #BusinessDevelopment #PitchIntel`

      // Use LinkedIn's sharing API with proper encoding
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(linkedInText)}`
      
      // Open LinkedIn sharing in new window
      const popup = window.open(linkedInUrl, '_blank', 'width=600,height=600,scrollbars=yes,resizable=yes')
      
      // Check if popup was blocked
      if (!popup) {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(linkedInText)
        alert('LinkedIn sharing popup was blocked. The post content has been copied to your clipboard!')
      }
    } catch (error) {
      console.error('Failed to generate LinkedIn post:', error)
      // Fallback: copy basic text
      try {
        const fallbackText = `🚀 Just analyzed ${brief.companyName} using PitchIntel AI! Check out the insights: ${shareUrl} #B2BIntelligence #AI`
        await navigator.clipboard.writeText(fallbackText)
        alert('LinkedIn sharing failed, but the post content has been copied to your clipboard!')
      } catch (clipboardError) {
        alert('LinkedIn sharing failed. Please try again.')
      }
    } finally {
      setIsGeneratingLinkedIn(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Share2 className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Share Brief</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Company Info */}
            <div className="mb-6 p-4 bg-gray-800/50 rounded-xl">
              <h4 className="font-semibold text-white">{brief.companyName}</h4>
              <p className="text-sm text-gray-400">Strategic Intelligence Brief</p>
            </div>

            {/* Share Options */}
            <div className="space-y-3">
              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/30 rounded-xl transition-all duration-200 text-left"
              >
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  {copiedLink ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <LinkIcon className="w-5 h-5 text-blue-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">
                    {copiedLink ? 'Link Copied!' : 'Copy Share Link'}
                  </div>
                  <div className="text-sm text-gray-400">
                    {copiedLink ? 'Link copied to clipboard' : 'Share this brief with others'}
                  </div>
                </div>
              </button>

              {/* Export PDF */}
              <button
                onClick={handleExportPDF}
                disabled={isGeneratingPDF}
                className="w-full flex items-center gap-3 p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/30 rounded-xl transition-all duration-200 text-left disabled:opacity-50"
              >
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  {isGeneratingPDF ? (
                    <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="w-5 h-5 text-green-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">
                    {isGeneratingPDF ? 'Generating...' : 'Export as HTML'}
                  </div>
                  <div className="text-sm text-gray-400">
                    Download a professional HTML report
                  </div>
                </div>
              </button>

              {/* LinkedIn Post */}
              <button
                onClick={handleLinkedInPost}
                disabled={isGeneratingLinkedIn}
                className="w-full flex items-center gap-3 p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/30 rounded-xl transition-all duration-200 text-left disabled:opacity-50"
              >
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  {isGeneratingLinkedIn ? (
                    <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ExternalLink className="w-5 h-5 text-purple-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">
                    {isGeneratingLinkedIn ? 'Generating...' : 'Post to LinkedIn'}
                  </div>
                  <div className="text-sm text-gray-400">
                    Share insights with your network
                  </div>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-800">
              <p className="text-xs text-gray-500 text-center">
                Share responsibly. Ensure you have permission to share company intelligence.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}