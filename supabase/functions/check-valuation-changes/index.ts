import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Subscription {
  id: string;
  email: string;
  location: string;
  threshold_percentage: number;
  last_notified_at: string | null;
}

interface ValuationStats {
  location: string;
  avg_value: number;
  prev_avg_value: number;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Check valuation changes function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all active subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from("valuation_subscriptions")
      .select("*");

    if (subError) {
      console.error("Error fetching subscriptions:", subError);
      throw subError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log("No subscriptions found");
      return new Response(JSON.stringify({ message: "No subscriptions to process" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`Processing ${subscriptions.length} subscriptions`);

    // Get unique locations from subscriptions
    const locations = [...new Set(subscriptions.map((s: Subscription) => s.location))];

    // For each location, calculate current and previous average valuations
    const alertsToSend: { subscription: Subscription; oldValue: number; newValue: number; changePercentage: number }[] = [];

    for (const location of locations) {
      // Get valuations for this location from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentValuations, error: recentError } = await supabase
        .from("valuations")
        .select("estimated_value, created_at")
        .eq("location", location)
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: false });

      if (recentError) {
        console.error(`Error fetching valuations for ${location}:`, recentError);
        continue;
      }

      if (!recentValuations || recentValuations.length < 2) {
        console.log(`Not enough valuations for ${location} to compare`);
        continue;
      }

      // Split valuations into recent (last 7 days) and older (8-30 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentVals = recentValuations.filter(
        (v) => new Date(v.created_at) >= sevenDaysAgo
      );
      const olderVals = recentValuations.filter(
        (v) => new Date(v.created_at) < sevenDaysAgo
      );

      if (recentVals.length === 0 || olderVals.length === 0) {
        console.log(`Not enough data split for ${location}`);
        continue;
      }

      const currentAvg = recentVals.reduce((sum, v) => sum + Number(v.estimated_value), 0) / recentVals.length;
      const previousAvg = olderVals.reduce((sum, v) => sum + Number(v.estimated_value), 0) / olderVals.length;

      const changePercentage = ((currentAvg - previousAvg) / previousAvg) * 100;

      console.log(`${location}: Previous avg: ${previousAvg}, Current avg: ${currentAvg}, Change: ${changePercentage.toFixed(2)}%`);

      // Find subscriptions for this location that exceed threshold
      const locationSubs = subscriptions.filter((s: Subscription) => s.location === location);

      for (const sub of locationSubs) {
        if (Math.abs(changePercentage) >= sub.threshold_percentage) {
          // Check if we already notified recently (within 24 hours)
          if (sub.last_notified_at) {
            const lastNotified = new Date(sub.last_notified_at);
            const hoursSinceNotified = (Date.now() - lastNotified.getTime()) / (1000 * 60 * 60);
            if (hoursSinceNotified < 24) {
              console.log(`Skipping ${sub.email} for ${location} - notified ${hoursSinceNotified.toFixed(1)} hours ago`);
              continue;
            }
          }

          alertsToSend.push({
            subscription: sub,
            oldValue: Math.round(previousAvg),
            newValue: Math.round(currentAvg),
            changePercentage,
          });
        }
      }
    }

    console.log(`Sending ${alertsToSend.length} alerts`);

    // Send alerts
    for (const alert of alertsToSend) {
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/send-valuation-alert`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            email: alert.subscription.email,
            location: alert.subscription.location,
            oldValue: alert.oldValue,
            newValue: alert.newValue,
            changePercentage: alert.changePercentage,
          }),
        });

        if (response.ok) {
          // Update last_notified_at
          await supabase
            .from("valuation_subscriptions")
            .update({ last_notified_at: new Date().toISOString() })
            .eq("id", alert.subscription.id);

          console.log(`Alert sent to ${alert.subscription.email} for ${alert.subscription.location}`);
        } else {
          console.error(`Failed to send alert to ${alert.subscription.email}:`, await response.text());
        }
      } catch (emailError) {
        console.error(`Error sending alert to ${alert.subscription.email}:`, emailError);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: "Valuation check complete", 
        alertsSent: alertsToSend.length,
        subscriptionsProcessed: subscriptions.length 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in check-valuation-changes:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
