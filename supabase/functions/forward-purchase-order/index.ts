import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    const { purchaseOrderId } = await req.json();

    if (!purchaseOrderId) {
      return new Response(
        JSON.stringify({ error: "purchaseOrderId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: po, error: fetchError } = await supabase
      .from("purchase_orders")
      .select("*")
      .eq("id", purchaseOrderId)
      .single();

    if (fetchError || !po) {
      return new Response(
        JSON.stringify({ error: "Purchase order not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const { error: updateError } = await supabase
      .from("purchase_orders")
      .update({ status: "Approved" })
      .eq("id", purchaseOrderId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: "Failed to approve purchase order" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data: vessels, error: vError } = await supabase
      .from("vessels")
      .select("id")
      .limit(1);

    const vesselId = vessels && vessels.length > 0 ? vessels[0].id : null;

    const { error: shipError } = await supabase
      .from("shipments")
      .insert({
        po_number: po.po_number,
        supplier_country: po.supplier,
        destination_port: "Paradip Port",
        destination_refinery: po.destination_refinery,
        vessel_id: vesselId,
        quantity: po.quantity,
        current_eta: po.expected_delivery,
        status: "Preparing",
        progress_stage: 1,
      });

    if (shipError) {
      return new Response(
        JSON.stringify({ error: "Failed to create shipment" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    await supabase.from("notifications").insert({
      target_role: "shipping",
      title: "New Shipment Ready for Dispatch",
      message: `Purchase Order ${po.po_number} has been approved and is ready for dispatch.`,
    });

    await supabase.from("notifications").insert({
      target_role: "procurement",
      title: "Purchase Order Approved",
      message: `PO ${po.po_number} has been approved and forwarded to Shipping.`,
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
