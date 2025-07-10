import { motion } from 'framer-motion'
import { Navigation } from '../components/Navigation'

export default function Updates() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/80 border border-gray-800 rounded-2xl p-8 shadow-xl backdrop-blur mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-blue-300 mb-6 flex items-center gap-3">
            <span role="img" aria-label="news">🗞️</span> PitchIntel Updates
          </h1>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-purple-300 mb-2 flex items-center gap-2">
              <span role="img" aria-label="calendar">📅</span> July 2025
            </h2>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span role="img" aria-label="fire">🔥</span> First Soft Launch (v1.0)
            </h3>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>🎉 We’re live! The first public version of PitchIntel is now accessible to everyone.</li>
              <li>🧠 Instantly generate investor-ready company briefs with real data.</li>
              <li>🌓 Pro Mode added — unlock advanced analysis and early access to new features.</li>
            </ul>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span role="img" aria-label="palette">🎨</span> UI + Theming Improvements
            </h3>
            <ul className="list-disc pl-6 text-gray-300">
              <li>🌑 Dark-mode–first design system with a professional, intelligence-grade aesthetic.</li>
              <li>🎨 Gradient accent buttons with improved hover states.</li>
              <li>🧩 Modular layout with improved responsiveness and performance.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-purple-300 mb-2 flex items-center gap-2">
              <span role="img" aria-label="calendar">📅</span> Coming Soon
            </h2>
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 mb-2">
              <p className="text-gray-400 mb-2">We’re actively building more powerful tools for you. Here’s what’s next:</p>
              <ul className="list-disc pl-6 text-gray-300">
                <li>🧩 <b>Competitive Landscape Module</b> – Compare companies across similar categories.</li>
                <li>📉 <b>Funding History + Growth Signals</b> – Dive deeper into a company’s past.</li>
                <li>🗂️ <b>Brief Library</b> – Save, edit, and revisit briefs anytime.</li>
                <li>🔍 <b>More Data Sources</b> – Expansion into new APIs for richer signals.</li>
                <li>🔐 <b>Custom Brief Builder (Beta)</b> – Choose your intel, format, and depth.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-purple-300 mb-2 flex items-center gap-2">
              <span role="img" aria-label="chat">💬</span> Feedback?
            </h2>
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
              <p className="text-gray-300 mb-2">We’re building PitchIntel in public and your feedback drives every update.</p>
              <ul className="list-disc pl-6 text-gray-300 mb-2">
                <li>→ Drop thoughts to <span className="text-blue-300">support@pitchintel.com</span></li>
                <li>→ Or tag us on <a href="https://www.indiehackers.com/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">IndieHackers</a>, <a href="https://x.com" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">X/Twitter</a>, or <a href="https://linkedin.com" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              </ul>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  )
} 