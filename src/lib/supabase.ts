import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yxqvopuiwpplgszmgpeo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cXZvcHVpd3BwbGdzem1ncGVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NDg5ODAsImV4cCI6MjA2NjUyNDk4MH0.CPOr1Y78Gf08Gxs8-z2_YrBnFhBQyBGoIuvgfSNl1Co'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Brief = {
  id: string
  companyName: string
  website?: string
  userIntent: string
  summary: string
  news: NewsItem[]
  techStack: string[]
  pitchAngle: string
  subjectLine: string
  whatNotToPitch: string
  signalTag: string
  createdAt: string
  jobSignals?: JobSignal[]
  techStackData?: TechStackItem[]
  intelligenceSources?: IntelligenceSources
  companyLogo?: string
  hiringTrends?: string
  newsTrends?: string
  userId?: string
  toneInsights?: ToneInsights
  outreachCopy?: string
}

export type NewsItem = {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  sourceFavicon?: string
}

export type JobSignal = {
  title: string
  company: string
  location: string
  postedDate: string
  description: string
  salary?: string
}

export type TechStackItem = {
  name: string
  confidence: 'High' | 'Medium' | 'Low'
  source: string
  category: string
  firstDetected?: string
}

export type IntelligenceSources = {
  news: number
  jobs: number
  technologies: number
  toneAnalysis?: boolean
  builtWithUsed: boolean
}

export type ToneInsights = {
  emotion?: string
  confidence?: number
  mood?: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  emotions?: Array<{ name: string; score: number }>
}

export type CreateBriefRequest = {
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
}

export type Feedback = {
  id?: string
  type: 'like' | 'dislike'
  page?: string
  created_at?: string
}

// Database operations with user isolation
export const briefsService = {
  async getAll(userId?: string): Promise<Brief[]> {
    let query = supabase
      .from('briefs')
      .select('*')
      .order('createdAt', { ascending: false })

    if (userId) {
      query = query.eq('userId', userId)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  },

  async getById(id: string, userId?: string): Promise<Brief | null> {
    let query = supabase
      .from('briefs')
      .select('*')
      .eq('id', id)

    if (userId) {
      query = query.eq('userId', userId)
    }

    const { data, error } = await query.single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data
  },

  async create(brief: Omit<Brief, 'id' | 'createdAt'>, userId?: string): Promise<Brief> {
    const { data, error } = await supabase
      .from('briefs')
      .insert({
        companyName: brief.companyName,
        website: brief.website,
        userIntent: brief.userIntent,
        summary: brief.summary,
        news: brief.news,
        techStack: brief.techStack,
        pitchAngle: brief.pitchAngle,
        subjectLine: brief.subjectLine,
        whatNotToPitch: brief.whatNotToPitch,
        signalTag: brief.signalTag,
        jobSignals: brief.jobSignals,
        techStackData: brief.techStackData,
        intelligenceSources: brief.intelligenceSources,
        companyLogo: brief.companyLogo,
        hiringTrends: brief.hiringTrends,
        newsTrends: brief.newsTrends,
        toneInsights: brief.toneInsights,
        userId: userId
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Brief>, userId?: string): Promise<Brief> {
    let query = supabase
      .from('briefs')
      .update(updates)
      .eq('id', id)

    if (userId) {
      query = query.eq('userId', userId)
    }

    const { data, error } = await query.select().single()

    if (error) throw error
    return data
  },

  async delete(id: string, userId?: string): Promise<void> {
    let query = supabase
      .from('briefs')
      .delete()
      .eq('id', id)

    if (userId) {
      query = query.eq('userId', userId)
    }

    const { error } = await query

    if (error) throw error
  }
}

// Feedback service for like/dislike modal
export const feedbackService = {
  async create(type: Feedback['type'], page: string = 'landing'): Promise<void> {
    const { error } = await supabase
      .from('feedback')
      .insert({ type, page })
    if (error) throw error
  }
}
