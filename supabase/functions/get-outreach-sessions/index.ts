
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
    const { user_id } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get all sessions for the user with brief details
    const { data: sessions, error } = await supabaseClient
      .from('outreach_sessions')
      .select(`
        *,
        briefs!brief_id (
          companyName,
          website,
          signalTag
        )
      `)
      .eq('user_id', user_id)
      .order('updated_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to get sessions: ${error.message}`)
    }

    return new Response(
      JSON.stringify({ sessions: sessions || [] }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error getting sessions:', error)
    return new Response(
      JSON.stringify({ error: error.message, sessions: [] }),
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
