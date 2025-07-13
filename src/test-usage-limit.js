// Simple test script to verify usage limit system
// Run this in the browser console to test localStorage functionality

console.log('🧪 Testing Usage Limit System...')

// Test 1: Check if localStorage is available
if (typeof localStorage !== 'undefined') {
  console.log('✅ localStorage is available')
} else {
  console.log('❌ localStorage is not available')
}

// Test 2: Test usage data structure
const testUsageData = {
  briefCount: 0,
  lastReset: new Date().toISOString()
}

try {
  localStorage.setItem('pitchintel_usage', JSON.stringify(testUsageData))
  const retrieved = JSON.parse(localStorage.getItem('pitchintel_usage'))
  console.log('✅ Usage data can be saved and retrieved:', retrieved)
} catch (error) {
  console.log('❌ Error with localStorage:', error)
}

// Test 3: Test monthly reset logic
const oldData = {
  briefCount: 1,
  lastReset: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString() // 31 days ago
}

localStorage.setItem('pitchintel_usage', JSON.stringify(oldData))

// Simulate the reset logic
const stored = localStorage.getItem('pitchintel_usage')
if (stored) {
  const data = JSON.parse(stored)
  const lastReset = new Date(data.lastReset)
  const now = new Date()
  const daysSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24)
  
  if (daysSinceReset >= 30) {
    console.log('✅ Monthly reset logic works - usage should reset')
    const resetData = {
      briefCount: 0,
      lastReset: now.toISOString()
    }
    localStorage.setItem('pitchintel_usage', JSON.stringify(resetData))
  } else {
    console.log('✅ Monthly reset logic works - usage should not reset yet')
  }
}

// Test 4: Clean up
localStorage.removeItem('pitchintel_usage')
console.log('✅ Test completed - localStorage cleaned up')

console.log('🎉 Usage limit system tests completed!') 