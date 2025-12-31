import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ValuationAlertRequest {
  email: string;
  location: string;
  oldValue: number;
  newValue: number;
  changePercentage: number;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Valuation alert function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { email, location, oldValue, newValue, changePercentage }: ValuationAlertRequest = await req.json();
    
    console.log(`Sending valuation alert to ${email} for ${location}`);

    const changeDirection = changePercentage > 0 ? "increased" : "decreased";
    const changeColor = changePercentage > 0 ? "#22c55e" : "#ef4444";

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Haven Homes <onboarding@resend.dev>",
        to: [email],
        subject: `Property Valuation Alert: ${location} values have ${changeDirection}!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1a365d, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
              .stat-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .change { font-size: 24px; font-weight: bold; color: ${changeColor}; }
              .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🏠 Property Valuation Alert</h1>
                <p>Haven Homes Market Update</p>
              </div>
              <div class="content">
                <h2>Values in ${location} have changed!</h2>
                <p>We noticed a significant change in property valuations in your subscribed area.</p>
                
                <div class="stat-box">
                  <p><strong>Location:</strong> ${location}</p>
                  <p><strong>Previous Average:</strong> AED ${oldValue.toLocaleString()}</p>
                  <p><strong>Current Average:</strong> AED ${newValue.toLocaleString()}</p>
                  <p class="change">${changePercentage > 0 ? "+" : ""}${changePercentage.toFixed(1)}% ${changeDirection}</p>
                </div>
                
                <p>This could be a good time to ${changePercentage > 0 ? "review your property's value" : "consider investment opportunities"}!</p>
                
                <p>Visit our website to get an updated valuation for your property.</p>
              </div>
              <div class="footer">
                <p>You're receiving this because you subscribed to valuation alerts for ${location}.</p>
                <p>© ${new Date().getFullYear()} Haven Homes. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const result = await emailResponse.json();
    console.log("Email sent successfully:", result);

    return new Response(JSON.stringify(result), {
      status: emailResponse.ok ? 200 : 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending valuation alert:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
