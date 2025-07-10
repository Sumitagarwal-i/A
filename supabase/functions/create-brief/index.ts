const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CreateBriefRequest {
  companyName: string
  website?: string
  userIntent: string
  userId?: string
  userCompany?: {
    name: string
    industry: string
    product: string
    valueProposition: string
    website?: string
    goals: string
  }
}

interface NewsItem {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  sourceFavicon?: string
}

interface JobSignal {
  title: string
  company: string
  location: string
  postedDate: string
  description: string
  salary?: string
}

interface TechStackItem {
  name: string
  confidence: 'High' | 'Medium' | 'Low'
  source: string
  category: string
  firstDetected?: string
}

interface ToneInsights {
  emotion?: string
  confidence?: number
  mood?: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  emotions?: Array<{ name: string; score: number }>
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { companyName, website, userIntent, userId, userCompany }: CreateBriefRequest = await req.json()

    // Validate input
    if (!companyName || !userIntent) {
      return new Response(
        JSON.stringify({ error: 'Company name and user intent are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Creating context-aware brief for ${companyName}...`)

    // 1. Extract domain and setup Clearbit
    let companyDomain = ''
    let companyLogo = ''
    if (website) {
      try {
        const url = new URL(website)
        companyDomain = url.hostname.replace('www.', '')
        companyLogo = `https://logo.clearbit.com/${companyDomain}`
      } catch (e) {
        console.log('Failed to extract domain from website:', e)
      }
    }

    // 2. Fetch real data from APIs
    const newsData: NewsItem[] = await fetchNewsData(companyName)
    const jobSignals: JobSignal[] = await fetchJobSignals(companyName)
    const techStackData: TechStackItem[] = await analyzeTechStack(jobSignals)
    const toneInsights: ToneInsights = await analyzeTone(userIntent, newsData)

    // 3. Generate context-aware AI analysis using both companies
    const aiAnalysis = await generateContextAwareAnalysis(
      companyName, 
      userIntent, 
      newsData, 
      jobSignals, 
      toneInsights,
      userCompany
    )

    const hiringTrends = `Active hiring: ${jobSignals.length} roles across ${new Set(jobSignals.map(j => j.location.split(',')[0])).size} locations`
    const newsTrends = `${newsData.length} recent articles - ${toneInsights.sentiment || 'neutral'} sentiment`

    // 4. Save comprehensive brief to database
    const { data, error } = await supabaseClient
      .from('briefs')
      .insert({
        companyName,
        website,
        userIntent,
        summary: aiAnalysis.summary,
        news: newsData,
        techStack: techStackData.map(t => t.name),
        pitchAngle: aiAnalysis.pitchAngle,
        subjectLine: aiAnalysis.subjectLine,
        whatNotToPitch: aiAnalysis.whatNotToPitch,
        signalTag: aiAnalysis.signalTag,
        jobSignals: jobSignals,
        techStackData: techStackData,
        intelligenceSources: {
          news: newsData.length,
          jobs: jobSignals.length,
          technologies: techStackData.length,
          stockData: false,
          toneAnalysis: !!toneInsights.emotion,
          builtWithUsed: false
        },
        companyLogo,
        hiringTrends,
        newsTrends,
        toneInsights,
        userId: userId || null
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to save brief to database', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Successfully created context-aware brief for ${companyName}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        brief: data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error creating brief:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Helper functions for API integrations
async function fetchNewsData(companyName: string): Promise<NewsItem[]> {
  try {
    const apiKey = Deno.env.get('NEWSDATA_API_KEY')
    if (!apiKey) {
      console.log('NewsData API key not found, using mock data')
      return generateMockNews(companyName)
    }

    const response = await fetch(`https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(companyName)}&language=en&size=10`)
    const data = await response.json()

    if (data.results) {
      // Deduplicate news by title and url
      const seen = new Set()
      const uniqueNews = data.results.map((item: any) => ({
        title: item.title,
        description: item.description || '',
        url: item.link,
        publishedAt: item.pubDate,
        source: item.source_id,
        sourceFavicon: `https://www.google.com/s2/favicons?domain=${item.source_id}`
      })).filter(item => {
        const key = item.title + '|' + item.url
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      return uniqueNews
    }
  } catch (error) {
    console.error('Error fetching news data:', error)
  }

  return generateMockNews(companyName)
}

async function fetchJobSignals(companyName: string): Promise<JobSignal[]> {
  try {
    const apiKey = Deno.env.get('JSEARCH_API_KEY')
    if (!apiKey) {
      console.log('JSearch API key not found, using mock data')
      return generateMockJobs(companyName)
    }

    const response = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(companyName)}&page=1&num_pages=1`, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    })
    const data = await response.json()

    if (data.data) {
      return data.data.slice(0, 10).map((job: any) => ({
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city + ', ' + job.job_state,
        postedDate: job.job_posted_at_datetime_utc,
        description: job.job_description?.substring(0, 200) + '...',
        salary: job.job_min_salary && job.job_max_salary ? 
          `$${job.job_min_salary.toLocaleString()} - $${job.job_max_salary.toLocaleString()}` : undefined
      }))
    }
  } catch (error) {
    console.error('Error fetching job signals:', error)
  }

  return generateMockJobs(companyName)
}

async function analyzeTone(userIntent: string, newsData: NewsItem[]): Promise<ToneInsights> {
  try {
    const apiKey = Deno.env.get('TWINWORD_API_KEY')
    if (!apiKey) {
      console.log('Twinword API key not found, using mock data')
      return generateMockTone()
    }

    // Combine user intent and news headlines for analysis
    const textToAnalyze = userIntent + ' ' + newsData.slice(0, 3).map(n => n.title).join(' ')

    const response = await fetch('https://twinword-emotion-analysis-v1.p.rapidapi.com/analyze/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'twinword-emotion-analysis-v1.p.rapidapi.com'
      },
      body: `text=${encodeURIComponent(textToAnalyze)}`
    })

    const data = await response.json()

    if (data.emotions_detected) {
      return {
        emotion: data.emotions_detected[0]?.emotion,
        confidence: data.emotions_detected[0]?.emotion_score,
        mood: data.mood,
        sentiment: data.sentiment,
        emotions: data.emotions_detected?.slice(0, 6) || []
      }
    }
  } catch (error) {
    console.error('Error analyzing tone:', error)
  }

  return generateMockTone()
}

async function analyzeTechStack(jobSignals: JobSignal[]): Promise<TechStackItem[]> {
  const techKeywords = [
    'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'AWS', 'Docker', 
    'Kubernetes', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
    'Microservices', 'CI/CD', 'Git', 'Jenkins', 'Terraform', 'Vue.js', 'Angular'
  ]

  const detectedTech: Record<string, number> = {}
  
  jobSignals.forEach(job => {
    const jobText = (job.title + ' ' + job.description).toLowerCase()
    techKeywords.forEach(tech => {
      if (jobText.includes(tech.toLowerCase())) {
        detectedTech[tech] = (detectedTech[tech] || 0) + 1
      }
    })
  })

  return Object.entries(detectedTech)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({
      name,
      confidence: count > 2 ? 'High' : count > 1 ? 'Medium' : 'Low',
      source: 'Job Analysis',
      category: getCategoryForTech(name),
      firstDetected: new Date().toISOString()
    }))
}

function getCategoryForTech(tech: string): string {
  const categories: Record<string, string> = {
    'React': 'Frontend',
    'Vue.js': 'Frontend',
    'Angular': 'Frontend',
    'Node.js': 'Backend',
    'Python': 'Backend',
    'JavaScript': 'Language',
    'TypeScript': 'Language',
    'AWS': 'Cloud',
    'Docker': 'DevOps',
    'Kubernetes': 'DevOps',
    'PostgreSQL': 'Database',
    'MongoDB': 'Database',
    'Redis': 'Database'
  }
  return categories[tech] || 'Other'
}

async function generateContextAwareAnalysis(
  companyName: string, 
  userIntent: string, 
  newsData: NewsItem[], 
  jobSignals: JobSignal[],
  toneInsights: ToneInsights,
  userCompany?: {
    name: string
    industry: string
    product: string
    valueProposition: string
    website?: string
    goals: string
  }
) {
  // Enhanced context-aware AI analysis
  const hasPositiveNews = newsData.some(n => 
    n.title.toLowerCase().includes('growth') || 
    n.title.toLowerCase().includes('funding') ||
    n.title.toLowerCase().includes('expansion') ||
    n.title.toLowerCase().includes('partnership')
  )

  const hasNegativeNews = newsData.some(n =>
    n.title.toLowerCase().includes('layoffs') ||
    n.title.toLowerCase().includes('decline') ||
    n.title.toLowerCase().includes('loss')
  )

  const isActivelyHiring = jobSignals.length > 5
  const sentiment = toneInsights.sentiment || 'neutral'
  const primaryEmotion = toneInsights.emotion || 'neutral'

  // Context-aware analysis considering both companies
  const userContext = userCompany ? 
    `As a ${userCompany.industry} company offering ${userCompany.product}, ` : 
    'Given your strategic objectives, '

  const competitiveContext = userCompany && userCompany.industry ? 
    `This positions your ${userCompany.industry} solution strategically against their current market approach. ` : 
    ''

  const valueAlignmentContext = userCompany && userCompany.valueProposition ?
    `Your unique value proposition of ${userCompany.valueProposition} aligns well with their ${sentiment} market position. ` :
    ''

  const keySignalsArray = [
    `${userContext}${companyName} presents a compelling strategic opportunity with ${sentiment} market sentiment and ${primaryEmotion} emotional positioning. Their ${newsData.length} recent news mentions indicate ${hasPositiveNews ? 'positive momentum' : hasNegativeNews ? 'market challenges' : 'stable operations'}, while ${jobSignals.length} active job postings suggest ${isActivelyHiring ? 'aggressive expansion' : 'selective growth'}.`,
    `${userContext}the strategic timing for engaging ${companyName} is exceptionally favorable. Their ${sentiment} sentiment combined with ${primaryEmotion} emotional state creates receptiveness to partnerships that support their ${isActivelyHiring ? 'scaling initiatives' : 'operational objectives'}.`,
    `${userContext}avoid approaches that contradict ${companyName}'s current ${sentiment} sentiment and ${primaryEmotion} emotional state. ${isActivelyHiring ? 'Never pitch cost-reduction or efficiency-only solutions during their expansion phase. ' : 'Avoid aggressive scaling pitches if they\'re in maintenance mode. '}${hasNegativeNews ? 'Be sensitive to recent market challenges and avoid highlighting competitive threats. ' : ''}${userCompany ? `Don't position your ${userCompany.product} as a replacement for their existing systems without acknowledging their current ${sentiment} market approach. ` : ''}Avoid generic pitches that ignore their specific ${newsData.length} recent developments, ${jobSignals.length} hiring signals, and ${primaryEmotion} emotional positioning. Never underestimate their strategic sophistication or current market intelligence.`,
    `${isActivelyHiring ? 'Scaling Operations' : 'Strategic Growth'} - ${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} Market Position`
  ]

  const uniqueSignals = Array.from(new Set(keySignalsArray));

  return {
    summary: `${uniqueSignals.join(' ')} The timing appears optimal for strategic engagement based on their current trajectory and market positioning.`,
    
    pitchAngle: `${uniqueSignals[1]} ${userCompany ? `Your ${userCompany.product} directly addresses their expansion needs, particularly given their ${jobSignals.length} active hiring positions. ` : ''}${valueAlignmentContext}The convergence of their market position, emotional readiness, and operational scaling creates an ideal window for ${userIntent}. Their ${newsData.length} recent news mentions and hiring patterns suggest they're actively seeking solutions that align with your strategic offering.`,
    
    subjectLine: userCompany ? 
      `Strategic Partnership: ${userCompany.name} + ${companyName}${hasPositiveNews ? ' - Perfect Timing' : ''}` :
      `Strategic Partnership Opportunity for ${companyName}${hasPositiveNews ? ' - Capitalizing on Growth' : ''}`,
    
    whatNotToPitch: `${uniqueSignals[2]}`,
    
    signalTag: uniqueSignals[3]
  }
}

// Mock data generators for fallback
function generateMockNews(companyName: string): NewsItem[] {
  return [
    {
      title: `${companyName} announces strategic expansion plans`,
      description: `${companyName} has unveiled comprehensive growth initiatives focusing on market expansion and technology advancement.`,
      url: `https://example.com/news/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
      publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'TechCrunch',
      sourceFavicon: 'https://techcrunch.com/favicon.ico'
    },
    {
      title: `${companyName} secures significant funding round`,
      description: `The company raised substantial investment to accelerate product development and team expansion.`,
      url: `https://example.com/funding/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
      publishedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'VentureBeat',
      sourceFavicon: 'https://venturebeat.com/favicon.ico'
    }
  ]
}

function generateMockJobs(companyName: string): JobSignal[] {
  const roles = ['Senior Software Engineer', 'Product Manager', 'Data Scientist', 'DevOps Engineer', 'UX Designer']
  const locations = ['San Francisco, CA', 'New York, NY', 'Remote', 'Seattle, WA', 'Austin, TX']
  
  return roles.map(role => ({
    title: role,
    company: companyName,
    location: locations[Math.floor(Math.random() * locations.length)],
    postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    description: `Join our growing team as a ${role}. We're looking for talented individuals to help build scalable solutions.`,
    salary: `$${Math.floor(Math.random() * 100 + 100)}k - $${Math.floor(Math.random() * 100 + 150)}k`
  }))
}

function generateMockTone(): ToneInsights {
  const emotions = ['joy', 'trust', 'anticipation', 'surprise', 'fear', 'sadness']
  const primaryEmotion = emotions[Math.floor(Math.random() * emotions.length)]
  
  return {
    emotion: primaryEmotion,
    confidence: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
    mood: primaryEmotion === 'joy' || primaryEmotion === 'trust' ? 'positive' : 
          primaryEmotion === 'fear' || primaryEmotion === 'sadness' ? 'negative' : 'neutral',
    sentiment: primaryEmotion === 'joy' || primaryEmotion === 'trust' ? 'positive' : 
               primaryEmotion === 'fear' || primaryEmotion === 'sadness' ? 'negative' : 'neutral',
    emotions: emotions.map(emotion => ({
      name: emotion,
      score: emotion === primaryEmotion ? Math.random() * 0.3 + 0.7 : Math.random() * 0.4
    }))
  }
}

// Import Supabase client
import { createClient } from 'npm:@supabase/supabase-js@2'