
import { OutreachTab } from '../components/OutreachTab'
import { Navigation } from '../components/Navigation'

export function Outreach() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <div className="pt-16 h-screen">
        <OutreachTab />
      </div>
    </div>
  )
}
