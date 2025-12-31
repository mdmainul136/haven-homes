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

interface PropertyFilters {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number;
  status?: string;
  listingType?: string;
  featured?: boolean;
  isOurProject?: boolean;
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
  console.log(`MongoDB ${action} on ${collection}:`, JSON.stringify(result).substring(0, 500));
  return result;
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

    const { action, data, id, filters, vendorId } = await req.json();
    console.log(`Properties action: ${action}`);

    let result;

    switch (action) {
      // Properties CRUD
      case 'getProperties': {
        const query: Record<string, unknown> = { status: 'active' };
        const typedFilters = filters as PropertyFilters | undefined;
        
        if (typedFilters) {
          if (typedFilters.type) query.type = typedFilters.type;
          if (typedFilters.listingType) query.listingType = typedFilters.listingType;
          if (typedFilters.featured !== undefined) query.featured = typedFilters.featured;
          if (typedFilters.isOurProject !== undefined) query.isOurProject = typedFilters.isOurProject;
          if (typedFilters.minPrice || typedFilters.maxPrice) {
            query.price = {};
            if (typedFilters.minPrice) (query.price as Record<string, number>)['$gte'] = typedFilters.minPrice;
            if (typedFilters.maxPrice) (query.price as Record<string, number>)['$lte'] = typedFilters.maxPrice;
          }
          if (typedFilters.location) {
            query.location = { $regex: typedFilters.location, $options: 'i' };
          }
          if (typedFilters.bedrooms) query.bedrooms = typedFilters.bedrooms;
        }
        
        const response = await mongoRequest('find', 'properties', { filter: query });
        result = response.documents || [];
        break;
      }

      case 'getProperty': {
        const response = await mongoRequest('findOne', 'properties', {
          filter: { _id: { $oid: id } }
        });
        result = response.document;
        break;
      }

      case 'createProperty': {
        const response = await mongoRequest('insertOne', 'properties', {
          document: {
            ...data,
            vendorId,
            views: 0,
            inquiryCount: 0,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        });
        result = { insertedId: response.insertedId };
        break;
      }

      case 'updateProperty': {
        const response = await mongoRequest('updateOne', 'properties', {
          filter: { _id: { $oid: id }, vendorId },
          update: { $set: { ...data, updatedAt: new Date().toISOString() } }
        });
        result = response;
        break;
      }

      case 'deleteProperty': {
        const response = await mongoRequest('deleteOne', 'properties', {
          filter: { _id: { $oid: id }, vendorId }
        });
        result = response;
        break;
      }

      // Vendor properties
      case 'getVendorProperties': {
        const response = await mongoRequest('find', 'properties', {
          filter: { vendorId }
        });
        result = response.documents || [];
        break;
      }

      // Favorites
      case 'getFavorites': {
        const favsResponse = await mongoRequest('find', 'favorites', {
          filter: { userId: data.userId }
        });
        const favs = favsResponse.documents || [];
        
        if (favs.length === 0) {
          result = [];
        } else {
          const propertyIds = favs.map((f: { propertyId: string }) => ({ $oid: f.propertyId }));
          const propsResponse = await mongoRequest('find', 'properties', {
            filter: { _id: { $in: propertyIds } }
          });
          result = propsResponse.documents || [];
        }
        break;
      }

      case 'addFavorite': {
        const existingResponse = await mongoRequest('findOne', 'favorites', {
          filter: { userId: data.userId, propertyId: data.propertyId }
        });
        
        if (!existingResponse.document) {
          const response = await mongoRequest('insertOne', 'favorites', {
            document: {
              userId: data.userId,
              propertyId: data.propertyId,
              createdAt: new Date().toISOString(),
            }
          });
          result = response;
        } else {
          result = existingResponse.document;
        }
        break;
      }

      case 'removeFavorite': {
        const response = await mongoRequest('deleteOne', 'favorites', {
          filter: { userId: data.userId, propertyId: data.propertyId }
        });
        result = response;
        break;
      }

      // Inquiries
      case 'createInquiry': {
        const response = await mongoRequest('insertOne', 'inquiries', {
          document: {
            ...data,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        });
        
        // Update inquiry count
        await mongoRequest('updateOne', 'properties', {
          filter: { _id: { $oid: data.propertyId } },
          update: { $inc: { inquiryCount: 1 } }
        });
        
        result = response;
        break;
      }

      case 'getVendorInquiries': {
        const propsResponse = await mongoRequest('find', 'properties', {
          filter: { vendorId }
        });
        const props = propsResponse.documents || [];
        const propIds = props.map((p: { _id: string }) => p._id);
        
        const inqResponse = await mongoRequest('find', 'inquiries', {
          filter: { propertyId: { $in: propIds } }
        });
        result = inqResponse.documents || [];
        break;
      }

      case 'updateInquiryStatus': {
        const response = await mongoRequest('updateOne', 'inquiries', {
          filter: { _id: { $oid: id } },
          update: { $set: { status: data.status, updatedAt: new Date().toISOString() } }
        });
        result = response;
        break;
      }

      // Analytics
      case 'getVendorAnalytics': {
        const propsResponse = await mongoRequest('find', 'properties', {
          filter: { vendorId }
        });
        const props = propsResponse.documents || [];
        const propIds = props.map((p: { _id: string }) => p._id);
        
        const inqResponse = await mongoRequest('find', 'inquiries', {
          filter: { propertyId: { $in: propIds } }
        });
        const inquiries = inqResponse.documents || [];
        
        const totalViews = props.reduce((sum: number, p: { views?: number }) => sum + (p.views || 0), 0);
        
        result = {
          totalProperties: props.length,
          totalInquiries: inquiries.length,
          totalViews,
          properties: props.map((p: { _id: string; title?: string; views?: number; inquiryCount?: number }) => ({
            id: p._id,
            title: p.title,
            views: p.views || 0,
            inquiries: p.inquiryCount || 0,
          })),
        };
        break;
      }

      case 'incrementViews': {
        const response = await mongoRequest('updateOne', 'properties', {
          filter: { _id: { $oid: id } },
          update: { $inc: { views: 1 } }
        });
        result = response;
        break;
      }

      // Admin actions
      case 'getPendingProperties': {
        const response = await mongoRequest('find', 'properties', {
          filter: { status: 'pending' }
        });
        result = response.documents || [];
        break;
      }

      case 'approveProperty': {
        const response = await mongoRequest('updateOne', 'properties', {
          filter: { _id: { $oid: id } },
          update: { 
            $set: { 
              status: 'active', 
              approvedAt: new Date().toISOString(), 
              updatedAt: new Date().toISOString() 
            } 
          }
        });
        result = response;
        break;
      }

      case 'rejectProperty': {
        const response = await mongoRequest('updateOne', 'properties', {
          filter: { _id: { $oid: id } },
          update: { 
            $set: { 
              status: 'rejected', 
              rejectedAt: new Date().toISOString(), 
              updatedAt: new Date().toISOString() 
            } 
          }
        });
        result = response;
        break;
      }

      case 'getAllProperties': {
        const response = await mongoRequest('find', 'properties', {});
        result = response.documents || [];
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
