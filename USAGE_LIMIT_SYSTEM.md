# Usage Limit System

A comprehensive React-based usage limit system that enforces a 1-brief limit for non-logged-in users while providing unlimited access to logged-in users.

## 🎯 Features

- **Smart Authentication Detection**: Automatically detects logged-in vs non-logged-in users
- **localStorage Persistence**: Tracks usage in browser storage with automatic reset
- **Monthly Reset**: Usage resets every 30 days for non-logged-in users
- **Seamless UX**: No disruption for logged-in users
- **Sign-up Modal**: Beautiful modal with compelling benefits when limits are reached
- **Protected Routes**: Automatic redirects for users who can't create briefs
- **Usage Indicators**: Visual feedback showing remaining briefs

## 📁 File Structure

```
src/
├── hooks/
│   └── useUsageLimit.ts          # Main hook for usage management
├── components/
│   ├── GenerateBriefButton.tsx   # Smart button with usage checks
│   ├── SignUpModal.tsx          # Sign-up modal with benefits
│   └── UsageGuard.tsx           # Route protection component
└── examples/
    └── UsageLimitExample.tsx    # Comprehensive usage example
```

## 🚀 Quick Start

### 1. Basic Usage with GenerateBriefButton

```tsx
import { GenerateBriefButton } from './components/GenerateBriefButton'

function MyComponent() {
  const handleGenerateBrief = () => {
    // Your brief generation logic
    console.log('Generating brief...')
  }

  return (
    <GenerateBriefButton
      onClick={handleGenerateBrief}
      isLoading={false}
    />
  )
}
```

### 2. Using the Hook Directly

```tsx
import { useUsageLimit } from './hooks/useUsageLimit'

function MyComponent() {
  const {
    isLoading,
    canCreateBrief,
    incrementUsage,
    getRemainingBriefs,
    isLoggedIn
  } = useUsageLimit()

  const handleCreateBrief = () => {
    if (!canCreateBrief) {
      // Show sign-up modal or redirect
      return
    }
    
    // Create brief
    incrementUsage()
  }

  return (
    <div>
      {!isLoggedIn && (
        <p>Remaining briefs: {getRemainingBriefs()}</p>
      )}
      <button 
        onClick={handleCreateBrief}
        disabled={!canCreateBrief}
      >
        Generate Brief
      </button>
    </div>
  )
}
```

### 3. Protecting Routes

```tsx
import { UsageGuard } from './components/UsageGuard'

function ProtectedPage() {
  return (
    <UsageGuard>
      <div>This content is only visible to users who can create briefs</div>
    </UsageGuard>
  )
}
```

## 🔧 Components

### useUsageLimit Hook

The core hook that manages usage state and provides utility functions.

```tsx
const {
  isLoading,              // Boolean: true while loading usage data
  canCreateBrief,         // Boolean: true if user can create a brief
  incrementUsage,         // Function: manually increment usage count
  getRemainingBriefs,     // Number: remaining free briefs (Infinity for logged-in)
  getUsagePercentage,     // Number: percentage of usage (0-100)
  getDaysUntilReset,      // Number: days until monthly reset
  isLoggedIn,            // Boolean: true if user is authenticated
  maxFreeBriefs          // Number: maximum free briefs (1)
} = useUsageLimit()
```

**Key Features:**
- Automatic localStorage management
- Monthly reset logic (30 days)
- No tracking for logged-in users
- Error handling with fallbacks

### GenerateBriefButton

A smart button component that automatically handles usage limits and shows the sign-up modal when needed.

```tsx
<GenerateBriefButton
  onClick={handleGenerateBrief}    // Function called when button is clicked
  isLoading={false}               // Boolean: shows loading state
  disabled={false}                // Boolean: additional disabled state
  className="custom-class"        // String: additional CSS classes
  children="Custom Text"          // ReactNode: custom button text
/>
```

**Features:**
- Automatic usage checking
- Sign-up modal integration
- Usage indicator display
- Loading state support
- Customizable styling

### SignUpModal

A beautiful modal that appears when non-logged-in users reach their usage limit.

```tsx
<SignUpModal
  isOpen={showModal}              // Boolean: controls modal visibility
  onClose={() => setShowModal(false)}  // Function: called when modal closes
/>
```

**Features:**
- Google sign-up integration
- Compelling benefits list
- Email sign-up alternative
- Responsive design
- Smooth animations

### UsageGuard

A wrapper component that protects content from users who can't create briefs.

```tsx
<UsageGuard>
  <div>Protected content here</div>
</UsageGuard>
```

**Features:**
- Automatic redirect to landing page
- Loading state handling
- Seamless integration with React Router

## 🎨 Customization

### Changing Usage Limits

Edit the constants in `useUsageLimit.ts`:

```tsx
const MAX_FREE_BRIEFS = 1                    // Change to desired limit
const RESET_INTERVAL_DAYS = 30               // Change reset interval
const USAGE_STORAGE_KEY = 'pitchintel_usage' // Change storage key
```

### Custom Sign-up Modal

Modify `SignUpModal.tsx` to customize:

- Benefits list
- Sign-up methods
- Styling and branding
- Callback functions

### Alternative Storage

To use cookies instead of localStorage:

```tsx
// In useUsageLimit.ts, replace localStorage calls with:
import Cookies from 'js-cookie'

// Save usage
Cookies.set(USAGE_STORAGE_KEY, JSON.stringify(data), { expires: 30 })

// Load usage
const stored = Cookies.get(USAGE_STORAGE_KEY)
```

For server-side sessions:

```tsx
// Replace localStorage with API calls
const saveUsage = async (data) => {
  await fetch('/api/usage', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

const loadUsage = async () => {
  const response = await fetch('/api/usage')
  return response.json()
}
```

## 🔄 Integration Examples

### With React Router

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UsageGuard } from './components/UsageGuard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={
          <UsageGuard>
            <AppPage />
          </UsageGuard>
        } />
      </Routes>
    </BrowserRouter>
  )
}
```

### With Form Submissions

```tsx
import { GenerateBriefButton } from './components/GenerateBriefButton'

function BriefForm() {
  const handleSubmit = (formData) => {
    // Your form submission logic
    console.log('Submitting brief:', formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <GenerateBriefButton
        onClick={handleSubmit}
        isLoading={isSubmitting}
      />
    </form>
  )
}
```

### With Authentication Context

The system automatically integrates with your existing auth context:

```tsx
// In useUsageLimit.ts
import { useAuth } from '../contexts/AuthContext'

export function useUsageLimit() {
  const { user } = useAuth()
  // ... rest of implementation
}
```

## 🧪 Testing

### Manual Testing

1. **Test as non-logged-in user:**
   - Create 1 brief (should work)
   - Try to create 2nd brief (should show sign-up modal)

2. **Test as logged-in user:**
   - Create unlimited briefs (should work)
   - No usage tracking should occur

3. **Test monthly reset:**
   - Modify the reset date in localStorage
   - Verify usage resets after 30 days

### Automated Testing

```tsx
// Example test for useUsageLimit
import { renderHook } from '@testing-library/react'
import { useUsageLimit } from './useUsageLimit'

test('should allow unlimited briefs for logged-in users', () => {
  // Mock auth context
  const { result } = renderHook(() => useUsageLimit())
  
  expect(result.current.canCreateBrief).toBe(true)
  expect(result.current.getRemainingBriefs()).toBe(Infinity)
})
```

## 🚨 Error Handling

The system includes robust error handling:

- **localStorage failures**: Falls back to no usage tracking
- **Invalid data**: Resets to initial state
- **Network errors**: Graceful degradation
- **Auth failures**: Assumes non-logged-in state

## 📊 Analytics Integration

Track usage patterns by extending the hook:

```tsx
// In useUsageLimit.ts
const incrementUsage = () => {
  // ... existing logic
  
  // Track analytics
  analytics.track('brief_created', {
    userId: user?.id || 'anonymous',
    usageCount: usageData.briefCount + 1
  })
}
```

## 🔒 Security Considerations

- **Client-side only**: Usage limits are enforced client-side
- **Easily bypassed**: Users can clear localStorage
- **Server validation**: Implement server-side checks for production
- **Rate limiting**: Add API rate limiting for additional protection

## 🎯 Production Recommendations

1. **Server-side validation**: Implement usage checks in your API
2. **Rate limiting**: Add rate limiting to brief creation endpoints
3. **Analytics**: Track usage patterns for business insights
4. **A/B testing**: Test different limits and reset periods
5. **Monitoring**: Alert on unusual usage patterns

## 📝 License

This usage limit system is provided as-is for educational and implementation purposes. Feel free to adapt and modify for your specific needs. 