import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yxqvopuiwpplgszmgpeo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cXZvcHVpd3BwbGdzem1ncGVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NDg5ODAsImV4cCI6MjA2NjUyNDk4MH0.CPOr1Y78Gf08Gxs8-z2_YrBnFhBQyBGoIuvgfSNl1Co'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  email: string
  created_at: string
}

export type AuthState = {
  user: User | null
  loading: boolean
}

export const authService = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    return { data, error }
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_, session) => {
      callback(session?.user as User | null)
    })
  }
}
