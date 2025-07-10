import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, User, Bell, Shield, Download } from 'lucide-react'
import { Navigation } from '../components/Navigation'
import { useAuth } from '../contexts/AuthContext'

export function Settings() {
  const { user } = useAuth()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(true)

  const handleToggle = (setting: string, value: boolean) => {
    switch (setting) {
      case 'email':
        setEmailNotifications(value)
        break
      case 'weekly':
        setWeeklyDigest(value)
        break
      case 'marketing':
        setMarketingEmails(value)
        break
    }
    
    // Here you would typically save to backend/localStorage
    console.log(`Setting ${setting} changed to:`, value)
  }

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: (value: boolean) => void }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-primary-600' : 'bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />
      
      <div className="pt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary-400" />
            Settings
          </h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-400" />
              Profile
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Member Since</label>
                <input
                  type="text"
                  value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                  disabled
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-400" />
              Notifications
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Email Notifications</h3>
                  <p className="text-gray-400 text-sm">Receive updates about your briefs and account</p>
                </div>
                <ToggleSwitch 
                  enabled={emailNotifications} 
                  onChange={(value) => handleToggle('email', value)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Weekly Digest</h3>
                  <p className="text-gray-400 text-sm">Get a weekly summary of your activity and insights</p>
                </div>
                <ToggleSwitch 
                  enabled={weeklyDigest} 
                  onChange={(value) => handleToggle('weekly', value)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Product Updates</h3>
                  <p className="text-gray-400 text-sm">Stay informed about new features and improvements</p>
                </div>
                <ToggleSwitch 
                  enabled={marketingEmails} 
                  onChange={(value) => handleToggle('marketing', value)} 
                />
              </div>
            </div>
          </motion.div>

          {/* Data & Privacy Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-400" />
              Data & Privacy
            </h2>
            <div className="space-y-4">
              <button className="flex items-center gap-3 w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-left">
                <Download className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="text-white font-medium">Export Data</h3>
                  <p className="text-gray-400 text-sm">Download all your briefs and account data</p>
                </div>
              </button>
              
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium mb-2">Data Usage</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Your data is used to generate personalized briefs and improve our AI models. 
                  We never share your data with third parties without consent.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Data Sources:</strong> NewsData.io, JSearch API, BuiltWith API, Clearbit
                </div>
              </div>
              
              <button className="flex items-center gap-3 w-full p-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-colors text-left">
                <Shield className="w-5 h-5 text-red-400" />
                <div>
                  <h3 className="text-red-300 font-medium">Delete Account</h3>
                  <p className="text-red-400 text-sm">Permanently delete your account and all associated data</p>
                </div>
              </button>
            </div>
          </motion.div>

          {/* API Usage Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Usage Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary-400">12</div>
                <div className="text-sm text-gray-400">Briefs Created</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">156</div>
                <div className="text-sm text-gray-400">News Articles</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">89</div>
                <div className="text-sm text-gray-400">Job Signals</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">45</div>
                <div className="text-sm text-gray-400">Tech Stacks</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}