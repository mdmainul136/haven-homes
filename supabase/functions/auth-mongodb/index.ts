import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";
import { create } from "https://deno.land/x/djwt@v3.0.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

let client: MongoClient | null = null;

async function getDatabase() {
  if (!client) {
    const mongoUri = Deno.env.get('MONGODB_URI');
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not configured');
    }
    client = new MongoClient();
    await client.connect(mongoUri);
  }
  return client.database("realestate");
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateToken(userId: string, email: string): Promise<string> {
  const jwtSecret = Deno.env.get('JWT_SECRET') || 'default-secret-change-me';
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(jwtSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  
  return await create(
    { alg: "HS256", typ: "JWT" },
    { 
      sub: userId, 
      email,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days
    },
    key
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, email, password, name, role } = await req.json();
    const db = await getDatabase();
    const users = db.collection("users");
    const profiles = db.collection("profiles");

    switch (action) {
      case 'signup': {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'User already exists' 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const hashedPassword = await hashPassword(password);
        const userId = await users.insertOne({
          email,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await profiles.insertOne({
          userId: userId.toString(),
          email,
          name: name || '',
          role: role || 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const token = await generateToken(userId.toString(), email);

        return new Response(JSON.stringify({ 
          success: true, 
          data: { 
            token, 
            user: { id: userId.toString(), email, name, role: role || 'user' } 
          } 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'login': {
        const user = await users.findOne({ email });
        if (!user) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Invalid credentials' 
          }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const hashedPassword = await hashPassword(password);
        if (user.password !== hashedPassword) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Invalid credentials' 
          }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const profile = await profiles.findOne({ userId: user._id.toString() });
        const token = await generateToken(user._id.toString(), email);

        return new Response(JSON.stringify({ 
          success: true, 
          data: { 
            token, 
            user: { 
              id: user._id.toString(), 
              email, 
              name: profile?.name || '',
              role: profile?.role || 'user'
            } 
          } 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Auth error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
