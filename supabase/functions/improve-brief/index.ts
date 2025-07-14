const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ImproveBriefRequest {
  briefId: string
  userId?: string
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

    const { briefId, userId }: ImproveBriefRequest = await req.json()

    // Validate input
    if (!briefId) {
      return new Response(
        JSON.stringify({ error: 'Brief ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the existing brief
    let query = supabaseClient
      .from('briefs')
      .select('*')
      .eq('id', briefId)

    if (userId) {
      query = query.eq('userId', userId)
    }

    const { data: brief, error: fetchError } = await query.single()

    if (fetchError || !brief) {
      return new Response(
        JSON.stringify({ error: 'Brief not found or access denied' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate improved analysis focusing on strategic sections
    const improvedAnalysis = await generateImprovedAnalysis(
      brief.companyName,
      brief.userIntent,
      brief.news || [],
      brief.jobSignals || [],
      brief.toneInsights
    )

    // Update only the strategic sections
    const { data: updatedBrief, error: updateError } = await supabaseClient
      .from('briefs')
      .update({
        summary: improvedAnalysis.summary,
        pitchAngle: improvedAnalysis.pitchAngle,
        whatNotToPitch: improvedAnalysis.whatNotToPitch,
        // Keep other fields unchanged
      })
      .eq('id', briefId)
      .select()
      .single()

    if (updateError) {
      console.error('Database update error:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update brief', details: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        brief: updatedBrief,
        message: 'Brief improved with deeper insights and sharper positioning.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error improving brief:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function generateImprovedAnalysis(
  companyName: string,
  userIntent: string,
  newsData: any[],
  jobSignals: any[],
  toneInsights: any
) {
  // Enhanced AI analysis with more sophisticated insights
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
  const sentiment = toneInsights?.sentiment || 'neutral'
  const primaryEmotion = toneInsights?.emotion || 'neutral'

  // More sophisticated analysis
  const marketContext = hasPositiveNews ? 'positive momentum' : 
                       hasNegativeNews ? 'challenging market conditions' : 
                       'stable market position'

  const hiringContext = isActivelyHiring ? 'aggressive expansion phase' : 
                       jobSignals.length > 0 ? 'selective growth mode' : 
                       'maintaining current team size'

  const emotionalContext = primaryEmotion === 'joy' || primaryEmotion === 'trust' ? 'optimistic outlook' :
                          primaryEmotion === 'fear' || primaryEmotion === 'sadness' ? 'cautious approach' :
                          'balanced perspective'

  return {
    summary: `${companyName} demonstrates ${sentiment} market sentiment with ${emotionalContext} based on recent intelligence. Current ${marketContext} combined with ${hiringContext} suggests strategic opportunities for partnership. The company's ${newsData.length} recent news mentions and ${jobSignals.length} active positions indicate ${isActivelyHiring ? 'rapid scaling' : 'steady operations'}, creating optimal timing for strategic engagement.`,
    
    pitchAngle: `Strategic timing analysis reveals ${companyName} is in a ${hiringContext} with ${emotionalContext}, making this an ideal moment for ${userIntent}. ${hasPositiveNews ? 'Recent positive developments create momentum for new partnerships.' : ''} ${isActivelyHiring ? 'Their active hiring across multiple departments signals readiness for solutions that support scaling operations.' : 'Their selective approach to growth indicates focus on high-impact partnerships.'} The ${sentiment} sentiment and ${primaryEmotion} emotional tone suggest receptiveness to strategic initiatives that align with their current trajectory.`,
    
    whatNotToPitch: `Avoid approaches that contradict ${companyName}'s current ${emotionalContext} and ${hiringContext}. ${isActivelyHiring ? 'Don\'t pitch cost-cutting or downsizing solutions during their expansion phase.' : 'Avoid aggressive scaling solutions if they\'re in maintenance mode.'} ${hasNegativeNews ? 'Be sensitive to recent challenges and avoid highlighting competitive threats.' : ''} Don't ignore their ${sentiment} market sentiment or ${primaryEmotion} emotional state. Avoid generic pitches that don't acknowledge their specific ${marketContext} and strategic position in the current market environment.`
  }
}

// Import Supabase client
import { createClient } from 'npm:@supabase/supabase-js@2'