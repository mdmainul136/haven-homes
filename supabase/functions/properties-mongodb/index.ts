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

interface PropertyFilters {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number;
  status?: string;
}

interface PropertyDoc {
  _id: ObjectId;
  title?: string;
  views?: number;
  inquiryCount?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data, id, filters, vendorId } = await req.json();
    const db = await getDatabase();
    const properties = db.collection("properties");
    const favorites = db.collection("favorites");
    const inquiries = db.collection("inquiries");

    let result;

    switch (action) {
      // Properties CRUD
      case 'getProperties': {
        const query: Record<string, unknown> = { status: 'active' }; // Only show approved properties
        const typedFilters = filters as PropertyFilters | undefined;
        if (typedFilters) {
          if (typedFilters.type) query.type = typedFilters.type;
          if (typedFilters.minPrice) query.price = { $gte: typedFilters.minPrice };
          if (typedFilters.maxPrice) {
            query.price = { ...(query.price as object || {}), $lte: typedFilters.maxPrice };
          }
          if (typedFilters.location) query.location = { $regex: typedFilters.location, $options: 'i' };
          if (typedFilters.bedrooms) query.bedrooms = typedFilters.bedrooms;
        }
        result = await properties.find(query).toArray();
        break;
      }

      case 'getProperty': {
        result = await properties.findOne({ _id: new ObjectId(id) });
        break;
      }

      case 'createProperty': {
        result = await properties.insertOne({
          ...data,
          vendorId,
          views: 0,
          inquiryCount: 0,
          status: 'pending', // Requires admin approval
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        break;
      }

      case 'updateProperty': {
        result = await properties.updateOne(
          { _id: new ObjectId(id), vendorId },
          { $set: { ...data, updatedAt: new Date() } }
        );
        break;
      }

      case 'deleteProperty': {
        result = await properties.deleteOne({ _id: new ObjectId(id), vendorId });
        break;
      }

      // Vendor properties
      case 'getVendorProperties': {
        result = await properties.find({ vendorId }).toArray();
        break;
      }

      // Favorites
      case 'getFavorites': {
        const userFavorites = await favorites.find({ userId: data.userId }).toArray();
        const propertyIds = userFavorites.map(f => new ObjectId(f.propertyId as string));
        result = await properties.find({ _id: { $in: propertyIds } }).toArray();
        break;
      }

      case 'addFavorite': {
        const existing = await favorites.findOne({ 
          userId: data.userId, 
          propertyId: data.propertyId 
        });
        if (!existing) {
          result = await favorites.insertOne({
            userId: data.userId,
            propertyId: data.propertyId,
            createdAt: new Date(),
          });
        } else {
          result = existing;
        }
        break;
      }

      case 'removeFavorite': {
        result = await favorites.deleteOne({ 
          userId: data.userId, 
          propertyId: data.propertyId 
        });
        break;
      }

      // Inquiries
      case 'createInquiry': {
        result = await inquiries.insertOne({
          ...data,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        // Update inquiry count
        await properties.updateOne(
          { _id: new ObjectId(data.propertyId) },
          { $inc: { inquiryCount: 1 } }
        );
        break;
      }

      case 'getVendorInquiries': {
        const vendorProps = await properties.find({ vendorId }).toArray();
        const propIds = vendorProps.map(p => (p as PropertyDoc)._id.toString());
        result = await inquiries.find({ propertyId: { $in: propIds } }).toArray();
        break;
      }

      case 'updateInquiryStatus': {
        result = await inquiries.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: data.status, updatedAt: new Date() } }
        );
        break;
      }

      // Analytics
      case 'getVendorAnalytics': {
        const vendorProps = await properties.find({ vendorId }).toArray() as PropertyDoc[];
        const propIds = vendorProps.map(p => p._id.toString());
        const totalInquiries = await inquiries.countDocuments({ propertyId: { $in: propIds } });
        const totalViews = vendorProps.reduce((sum, p) => sum + (p.views || 0), 0);
        
        result = {
          totalProperties: vendorProps.length,
          totalInquiries,
          totalViews,
          properties: vendorProps.map(p => ({
            id: p._id.toString(),
            title: p.title,
            views: p.views || 0,
            inquiries: p.inquiryCount || 0,
          })),
        };
        break;
      }

      case 'incrementViews': {
        result = await properties.updateOne(
          { _id: new ObjectId(id) },
          { $inc: { views: 1 } }
        );
        break;
      }

      // Admin actions
      case 'getPendingProperties': {
        result = await properties.find({ status: 'pending' }).toArray();
        break;
      }

      case 'approveProperty': {
        result = await properties.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: 'active', approvedAt: new Date(), updatedAt: new Date() } }
        );
        break;
      }

      case 'rejectProperty': {
        result = await properties.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: 'rejected', rejectedAt: new Date(), updatedAt: new Date() } }
        );
        break;
      }

      case 'getAllProperties': {
        // Admin can see all properties regardless of status
        result = await properties.find({}).toArray();
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Properties operation error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
