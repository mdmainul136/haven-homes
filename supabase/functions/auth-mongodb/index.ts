import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { create } from "https://deno.land/x/djwt@v3.0.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// MongoDB Data API configuration
const MONGODB_DATA_API_KEY = Deno.env.get('MONGODB_DATA_API_KEY');
const MONGODB_APP_ID = Deno.env.get('MONGODB_APP_ID');
const DATA_API_URL = `https://data.mongodb-api.com/app/${MONGODB_APP_ID}/endpoint/data/v1`;
const DATABASE = 'haven_homes';

interface MongoDocument {
  _id?: string;
  [key: string]: unknown;
}

async function mongoRequest(action: string, collection: string, data: Record<string, unknown> = {}) {
  const response = await fetch(`${DATA_API_URL}/action/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': MONGODB_DATA_API_KEY!,
    },
    body: JSON.stringify({
      dataSource: 'Cluster0',
      database: DATABASE,
      collection,
      ...data,
    }),
  });
  
  const result = await response.json();
  console.log(`MongoDB ${action} on ${collection}:`, JSON.stringify(result));
  return result;
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
    // Validate API key is configured
    if (!MONGODB_DATA_API_KEY || !MONGODB_APP_ID) {
      throw new Error('MongoDB Data API is not configured. Please add MONGODB_DATA_API_KEY and MONGODB_APP_ID secrets.');
    }

    const { action, email, password, name, role } = await req.json();
    console.log(`Auth action: ${action} for email: ${email}`);

    switch (action) {
      case 'signup': {
        // Check if user exists
        const existingResult = await mongoRequest('findOne', 'users', {
          filter: { email }
        });
        
        if (existingResult.document) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'User already exists' 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const hashedPassword = await hashPassword(password);
        
        // Insert user
        const userResult = await mongoRequest('insertOne', 'users', {
          document: {
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        });

        const userId = userResult.insertedId;

        // Insert profile
        await mongoRequest('insertOne', 'profiles', {
          document: {
            userId: userId,
            email,
            name: name || '',
            role: role || 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        });

        const token = await generateToken(userId, email);

        return new Response(JSON.stringify({ 
          success: true, 
          data: { 
            token, 
            user: { id: userId, email, name, role: role || 'user' } 
          } 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'login': {
        // Find user
        const userResult = await mongoRequest('findOne', 'users', {
          filter: { email }
        });
        
        const user = userResult.document;
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

        // Get profile
        const profileResult = await mongoRequest('findOne', 'profiles', {
          filter: { userId: user._id }
        });
        const profile = profileResult.document;
        
        const token = await generateToken(user._id, email);

        return new Response(JSON.stringify({ 
          success: true, 
          data: { 
            token, 
            user: { 
              id: user._id, 
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
