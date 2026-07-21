import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    const { shipmentId } = await req.json();

    if (!shipmentId) {
      return new Response(
        JSON.stringify({ error: "shipmentId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: shipment, error: fetchError } = await supabase
      .from("shipments")
      .select("*")
      .eq("id", shipmentId)
      .single();

    if (fetchError || !shipment) {
      return new Response(
        JSON.stringify({ error: "Shipment not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const { error: insertError } = await supabase
      .from("incoming_shipments")
      .insert({
        shipment_id: shipmentId,
        refinery_name: shipment.destination_refinery,
        expected_arrival: shipment.current_eta,
        quantity: shipment.quantity,
        status: "pending",
      });

    if (insertError) {
      return new Response(
        JSON.stringify({ error: "Failed to create incoming shipment record" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    await supabase.from("notifications").insert({
      target_role: "refinery",
      title: "New Shipment Incoming",
      message: `Shipment for ${shipment.destination_refinery} is on its way. ETA: ${shipment.current_eta}.`,
    });

    await supabase.from("shipment_events").insert({
      shipment_id: shipmentId,
      event_type: "NOTIFY_REFINERY",
      event_description: `Refinery ${shipment.destination_refinery} has been notified of incoming shipment.`,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
