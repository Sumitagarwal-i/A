import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  BarChart3, 
  Menu, 
  X,
  User,
  Settings,
  LogOut,
  BookOpen,
  Plus,
  ChevronDown,
  DollarSign,
  Crown,
  MessageCircle,
  HelpCircle,
  MessageSquare,
  LogIn
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { FeedbackModal } from './FeedbackModal'
import { useFeedback } from '../contexts/FeedbackContext'

export function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { shouldShowFeedback, feedbackTrigger, hideFeedback } = useFeedback()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  const handleSignIn = () => {
    // Navigate to analytics page to trigger AuthGuard and working sign-in
    navigate('/analytics')
  }

  const navItems = [
    { path: '/app', label: 'Briefs', icon: FileText },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/pricing', label: 'Pricing', icon: DollarSign },
    { path: '/docs', label: 'Docs', icon: BookOpen }
  ]

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  const handleSignOut = async () => {
    await signOut()
    setIsProfileOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 flex items-center justify-center"
            >
              <img 
                src="/ChatGPT Image Jul 3, 2025, 06_33_42 PM.webp" 
                alt="PitchIntel Logo"
                width="32"
                height="32"
                loading="lazy"
                className="w-16 h-16 object-contain"
              />
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                PitchIntel
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const active = isActive(item.path)
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    active
                      ? 'text-blue-300'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Sign In Button - Show for non-logged-in users */}
            {!user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignIn}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all duration-200 rounded-xl"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </motion.button>
            )}

            {/* Feedback Button */}
            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFeedbackModal(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors border border-gray-700/50 rounded-xl"
              >
                <MessageSquare className="w-4 h-4" />
                Feedback
              </motion.button>
            )}

            {/* Upgrade Button */}
            {user && (
              <Link
                to="/pricing"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7B61FF] to-[#5A4BFF] hover:from-[#6F5AFF] hover:to-[#4739E6]

 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
              >
                <Crown className="w-4 h-4" />
                Upgrade
              </Link>
            )}

            {user && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors border border-gray-700/50"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm font-medium">{user.email?.split('@')[0]}</span>
                  <ChevronDown className="w-4 h-4" />
                </motion.button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl py-2"
                    >
                      <div className="px-4 py-3 border-b border-gray-700/50">
                        <div className="text-sm font-medium text-white">{user.email?.split('@')[0]}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                      <Link
                        to="/pricing"
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-purple-300 hover:bg-gray-800/50 hover:text-purple-200 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Crown className="w-4 h-4" />
                        Upgrade Plan
                      </Link>
                      <Link
                        to="/updates"
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-blue-300 hover:bg-gray-800/50 hover:text-blue-200 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <BookOpen className="w-4 h-4" />
                        Updates
                      </Link>
                      <Link
                        to="/help"
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <HelpCircle className="w-4 h-4" />
                        Help Center
                      </Link>
                      <Link
                        to="/contact"
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Contact
                      </Link>
                      <Link
                        to="/settings"
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-800/50 py-4"
            >
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        active
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  )
                })}
                
                {user ? (
                  <>
                    <Link
                      to="/pricing"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#7B61FF] to-[#3C2A99] hover:from-[#6B54E6] hover:to-[#2D217A]
 text-white rounded-xl font-medium transition-all duration-200"
                    >
                      <Crown className="w-5 h-5" />
                      Upgrade Plan
                    </Link>
                    <Link
                      to="/app?new=true"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all duration-200"
                    >
                      <Plus className="w-5 h-5" />
                      New Brief
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      handleSignIn()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all duration-200"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal || shouldShowFeedback}
        onClose={() => {
          setShowFeedbackModal(false)
          hideFeedback()
        }}
        trigger={feedbackTrigger || "navigation"}
      />

      {/* Click outside to close profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </nav>
  )
}