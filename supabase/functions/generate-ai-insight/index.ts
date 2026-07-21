import { createClient } from "jsr:@supabase/supabase-js@2";

const MOCK_RESPONSES: Record<string, string> = {
  government:
    "Analysis indicates elevated geopolitical risk in the Middle East corridor. Recommend increasing strategic reserves by 5% and diversifying suppliers from the African market.",
  procurement:
    "Based on current market trends, Russian Urals and Iraqi Basra Heavy offer the best price-to-yield ratio for Indian refineries. Consider extending contracts with suppliers showing >90% reliability.",
  shipping:
    "Optimal routing suggests avoiding the Red Sea corridor due to monsoon activity. Recommended alternative: Cape of Good Hope route adds 3 days but reduces risk by 40%.",
  refinery:
    "Current inventory levels sufficient for 28 days. Recommend increasing LPG output by 5% to meet winter demand projections. Schedule maintenance during low-demand period.",
  executive:
    "Supply chain health index stable at 74/100. Energy security score improved 3 points month-over-month. Key risk: dependency on Middle East crude (62% of imports).",
};

Deno.serve(async (req) => {
  try {
    const { dashboard, prompt } = await req.json();

    if (!dashboard) {
      return new Response(
        JSON.stringify({ error: "dashboard field is required (government|procurement|shipping|refinery|executive)" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = MOCK_RESPONSES[dashboard] || MOCK_RESPONSES.executive;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const insightPayload = {
      insight_text: response,
      confidence_score: 0.85 + Math.random() * 0.1,
      data_sources: ["AI Analysis", "Market Data", "Historical Trends"],
      expected_impact: "Medium",
    };

    const tableMap: Record<string, string> = {
      government: "ai_risk_insights",
      executive: "executive_insights",
    };

    const table = tableMap[dashboard];
    if (table) {
      await supabase.from(table).insert(insightPayload);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          insight_text: response,
          confidence_score: insightPayload.confidence_score,
          dashboard,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
