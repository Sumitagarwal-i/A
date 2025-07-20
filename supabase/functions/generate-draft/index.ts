
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { brief_id, draft_type, last_outcome } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get the brief data
    const { data: brief, error: briefError } = await supabaseClient
      .from('briefs')
      .select('*')
      .eq('id', brief_id)
      .single()

    if (briefError) {
      throw new Error(`Brief not found: ${briefError.message}`)
    }

    // Get Groq API key
    const groqApiKey = Deno.env.get('GROQ_API_KEY')
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not configured')
    }

    // Generate prompt based on draft type
    let prompt = ''
    
    if (draft_type === 'email') {
      prompt = `Generate a professional B2B sales email draft based on this brief:
      
Company: ${brief.companyName}
Website: ${brief.website || 'N/A'}
User Intent: ${brief.userIntent}
Summary: ${brief.summary}
Pitch Angle: ${brief.pitchAngle}
What NOT to pitch: ${brief.whatNotToPitch}
Signal Tag: ${brief.signalTag}

Create a personalized email that:
1. Uses the signal tag as conversation starter
2. Follows the pitch angle
3. Avoids what NOT to pitch
4. Includes a clear call-to-action
5. Sounds natural and human

Format the response as JSON with "draft" and "explanation" fields.`
    } else if (draft_type === 'dm') {
      prompt = `Generate a LinkedIn DM based on this brief:
      
Company: ${brief.companyName}
Website: ${brief.website || 'N/A'}
User Intent: ${brief.userIntent}
Summary: ${brief.summary}
Pitch Angle: ${brief.pitchAngle}
Signal Tag: ${brief.signalTag}

Create a short, engaging LinkedIn message that:
1. References the signal tag naturally
2. Follows the pitch angle
3. Feels personal, not salesy
4. Has a soft ask or question
5. Is under 100 words

Format the response as JSON with "draft" and "explanation" fields.`
    } else if (draft_type === 'followup') {
      prompt = `Generate a follow-up message based on this context:
      
Company: ${brief.companyName}
Original Pitch Angle: ${brief.pitchAngle}
Last Outcome: ${last_outcome || 'No response'}

Create a follow-up that:
1. Acknowledges the previous message
2. Adds new value or angle
3. Handles common objections
4. Has a different call-to-action
5. Maintains professionalism

Format the response as JSON with "draft" and "explanation" fields.`
    } else if (draft_type === 'rebuttal') {
      prompt = `Generate a rebuttal/objection handler based on this context:
      
Company: ${brief.companyName}
Original Pitch Angle: ${brief.pitchAngle}
Objection/Outcome: ${last_outcome || 'Generic objection'}

Create a response that:
1. Acknowledges their concern
2. Provides social proof or case study
3. Reframes the value proposition
4. Offers a low-commitment next step
5. Remains respectful and helpful

Format the response as JSON with "draft" and "explanation" fields.`
    }

    // Call Groq API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.status}`)
    }

    const groqData = await groqResponse.json()
    const content = groqData.choices[0]?.message?.content || ''

    // Try to parse JSON response
    let result
    try {
      result = JSON.parse(content)
    } catch {
      // Fallback if not valid JSON
      result = {
        draft: content,
        explanation: "AI-generated draft based on your brief insights"
      }
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error generating draft:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
