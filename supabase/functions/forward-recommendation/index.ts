import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    const { recommendationId } = await req.json();

    if (!recommendationId) {
      return new Response(
        JSON.stringify({ error: "recommendationId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: recommendation, error: fetchError } = await supabase
      .from("government_recommendations")
      .select("*")
      .eq("id", recommendationId)
      .single();

    if (fetchError || !recommendation) {
      return new Response(
        JSON.stringify({ error: "Recommendation not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const { error: updateError } = await supabase
      .from("government_recommendations")
      .update({ status: "forwarded" })
      .eq("id", recommendationId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: "Failed to forward recommendation" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const { error: notifError } = await supabase
      .from("notifications")
      .insert({
        target_role: "procurement",
        title: "New Government Recommendation Forwarded",
        message: `A recommendation for "${recommendation.title}" has been approved by the Government and forwarded to Procurement.`,
      });

    if (notifError) {
      console.error("Failed to create notification:", notifError);
    }

    return new Response(
      JSON.stringify({ success: true, data: recommendation }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
