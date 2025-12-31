import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// MongoDB Data API configuration
const MONGODB_DATA_API_KEY = Deno.env.get('MONGODB_DATA_API_KEY');
const MONGODB_APP_ID = Deno.env.get('MONGODB_APP_ID');
const DATA_API_URL = `https://data.mongodb-api.com/app/${MONGODB_APP_ID}/endpoint/data/v1`;
const DATABASE = 'haven_homes';

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
  
  return await response.json();
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

    const { action, collection, data, query, id } = await req.json();
    console.log(`MongoDB action: ${action} on collection: ${collection}`);

    let result;

    switch (action) {
      case 'find':
        const findResponse = await mongoRequest('find', collection, { filter: query || {} });
        result = findResponse.documents || [];
        break;
      
      case 'findOne':
        if (id) {
          const findOneResponse = await mongoRequest('findOne', collection, { 
            filter: { _id: { $oid: id } } 
          });
          result = findOneResponse.document;
        } else {
          const findOneResponse = await mongoRequest('findOne', collection, { 
            filter: query || {} 
          });
          result = findOneResponse.document;
        }
        break;
      
      case 'insert':
        const insertResponse = await mongoRequest('insertOne', collection, {
          document: {
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        });
        result = { insertedId: insertResponse.insertedId };
        break;
      
      case 'insertMany':
        const insertManyResponse = await mongoRequest('insertMany', collection, {
          documents: data.map((item: Record<string, unknown>) => ({
            ...item,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }))
        });
        result = insertManyResponse;
        break;
      
      case 'update':
        const updateResponse = await mongoRequest('updateOne', collection, {
          filter: { _id: { $oid: id } },
          update: { $set: { ...data, updatedAt: new Date().toISOString() } }
        });
        result = updateResponse;
        break;
      
      case 'delete':
        const deleteResponse = await mongoRequest('deleteOne', collection, {
          filter: { _id: { $oid: id } }
        });
        result = deleteResponse;
        break;
      
      case 'aggregate':
        const aggResponse = await mongoRequest('aggregate', collection, {
          pipeline: data
        });
        result = aggResponse.documents || [];
        break;
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('MongoDB operation error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
