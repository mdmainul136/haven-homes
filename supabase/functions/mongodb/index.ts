import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient, ObjectId } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, collection, data, query, id } = await req.json();
    const db = await getDatabase();
    const coll = db.collection(collection);

    let result;

    switch (action) {
      case 'find':
        result = await coll.find(query || {}).toArray();
        break;
      
      case 'findOne':
        if (id) {
          result = await coll.findOne({ _id: new ObjectId(id) });
        } else {
          result = await coll.findOne(query || {});
        }
        break;
      
      case 'insert':
        result = await coll.insertOne({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        break;
      
      case 'insertMany':
        result = await coll.insertMany(data.map((item: Record<string, unknown>) => ({
          ...item,
          createdAt: new Date(),
          updatedAt: new Date(),
        })));
        break;
      
      case 'update':
        result = await coll.updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...data, updatedAt: new Date() } }
        );
        break;
      
      case 'delete':
        result = await coll.deleteOne({ _id: new ObjectId(id) });
        break;
      
      case 'aggregate':
        result = await coll.aggregate(data).toArray();
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
