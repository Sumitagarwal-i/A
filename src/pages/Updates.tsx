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
          <h1 className="text-3xl md:text-4xl font-bold text-blue-300 mb-6">
            PitchIntel Updates
          </h1>

          {/* Initial Launch */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-purple-300 mb-2">
              July 2025
            </h2>
            <h3 className="text-lg font-bold text-white mb-2">
              First Soft Launch (v1.0)
            </h3>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>We’re live! The first public version of PitchIntel is now accessible to everyone.</li>
              <li>Instantly generate investor-ready company briefs with real data.</li>
              <li>Pro Mode added — unlock advanced analysis and early access to new features.</li>
            </ul>
            <h3 className="text-lg font-bold text-white mb-2">
              UI and Theming Improvements
            </h3>
            <ul className="list-disc pl-6 text-gray-300">
              <li>Dark-mode–first design system with a professional, intelligence-grade aesthetic.</li>
              <li>Gradient accent buttons with improved hover states.</li>
              <li>Modular layout with improved responsiveness and performance.</li>
            </ul>
          </section>

          {/* v1.0.1 Released */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-purple-300 mb-2">
              July 2025 (NEW)
            </h2>
            <h3 className="text-lg font-bold text-white mb-2">
              Maintenance and Improvements (v1.0.1)
            </h3>
            <ul className="list-disc pl-6 text-gray-300">
              <li>Added feedback like/dislike modal on landing page for faster user input.</li>
              <li>Improved duplicate news detection and de-duplication logic.</li>
              <li>Minor performance enhancements and backend cleanup.</li>
              <li>Improved and Personalized Brief Output</li>

            </ul>
          </section>

          {/* Upcoming */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-purple-300 mb-2">
              Coming Next: v1.1
            </h2>
            <h3 className="text-lg font-bold text-white mb-2">
              Planned Features
            </h3>
            <ul className="list-disc pl-6 text-gray-300">
              <li>Competitive Landscape module to compare companies in the same sector.</li>
              <li>Funding history insights and deeper growth signals integration.</li>
              <li>Brief Library to save and manage all generated briefs.</li>
              <li>New data sources to expand real-time company signals.</li>
              <li>Custom Brief Builder for personalized pitch packages.</li>
            </ul>
          </section>

          {/* Feedback */}
          <section>
            <h2 className="text-xl font-semibold text-purple-300 mb-2">
              Feedback
            </h2>
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
              <p className="text-gray-300 mb-2">
                We’re building PitchIntel in public and your feedback drives every update.
              </p>
              <ul className="list-disc pl-6 text-gray-300 mb-2">
                <li>Contact us at <span className="text-blue-300">support@pitchintel.tech</span></li>
                <li>Connect with us on <a href="https://www.indiehackers.com/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">IndieHackers</a>, <a href="https://x.com" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">X/Twitter</a>, or <a href="https://linkedin.com" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              </ul>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  )
}
