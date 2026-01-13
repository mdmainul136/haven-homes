import { supabase } from '@/integrations/supabase/client';

// Properties API
export const propertiesApi = {
  async getAll(filters?: { 
    status?: string; 
    listingType?: string; 
    featured?: boolean; 
    isOurProject?: boolean 
  }) {
    let query = supabase.from('properties').select('*');
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.listingType) {
      query = query.eq('listing_type', filters.listingType);
    }
    if (filters?.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }
    if (filters?.isOurProject !== undefined) {
      query = query.eq('is_our_project', filters.isOurProject);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { success: !error, data, error: error?.message };
  },

  async getOne(id: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    return { success: !error, data, error: error?.message };
  },

  async create(propertyData: {
    title: string;
    description?: string;
    price: number;
    location: string;
    property_type: string;
    listing_type?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    images?: string[];
    amenities?: string[];
    featured?: boolean;
    is_our_project?: boolean;
    vendor_id: string;
  }) {
    const { data, error } = await supabase
      .from('properties')
      .insert({
        ...propertyData,
        status: 'pending',
      })
      .select()
      .single();
    return { success: !error, data, error: error?.message };
  },

  async update(id: string, propertyData: Partial<{
    title: string;
    description: string;
    price: number;
    location: string;
    property_type: string;
    listing_type: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    images: string[];
    amenities: string[];
    featured: boolean;
    is_our_project: boolean;
    status: string;
  }>) {
    const { data, error } = await supabase
      .from('properties')
      .update(propertyData)
      .eq('id', id)
      .select()
      .single();
    return { success: !error, data, error: error?.message };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    return { success: !error, error: error?.message };
  },

  async getVendorProperties(vendorId: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });
    return { success: !error, data, error: error?.message };
  },

  async incrementViews(id: string) {
    const { data: property } = await supabase
      .from('properties')
      .select('views')
      .eq('id', id)
      .maybeSingle();
    
    const currentViews = property?.views || 0;
    
    const { error } = await supabase
      .from('properties')
      .update({ views: currentViews + 1 })
      .eq('id', id);
    return { success: !error, error: error?.message };
  },

  async getPendingProperties() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    return { success: !error, data, error: error?.message };
  },

  async approveProperty(id: string) {
    const { error } = await supabase
      .from('properties')
      .update({ status: 'approved' })
      .eq('id', id);
    return { success: !error, error: error?.message };
  },

  async rejectProperty(id: string) {
    const { error } = await supabase
      .from('properties')
      .update({ status: 'rejected' })
      .eq('id', id);
    return { success: !error, error: error?.message };
  },
};

// Favorites API
export const favoritesApi = {
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        properties (*)
      `)
      .eq('user_id', userId);
    return { success: !error, data, error: error?.message };
  },

  async add(userId: string, propertyId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, property_id: propertyId })
      .select()
      .single();
    return { success: !error, data, error: error?.message };
  },

  async remove(userId: string, propertyId: string) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId);
    return { success: !error, error: error?.message };
  },

  async check(userId: string, propertyId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .maybeSingle();
    return { success: !error, isFavorite: !!data, error: error?.message };
  },
};

// Inquiries API
export const inquiriesApi = {
  async create(inquiryData: {
    property_id: string;
    vendor_id: string;
    user_id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
  }) {
    const { data, error } = await supabase
      .from('inquiries')
      .insert(inquiryData)
      .select()
      .single();
    return { success: !error, data, error: error?.message };
  },

  async getVendorInquiries(vendorId: string) {
    const { data, error } = await supabase
      .from('inquiries')
      .select(`
        *,
        properties (title)
      `)
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });
    
    // Transform to include property title
    const transformed = data?.map(inquiry => ({
      ...inquiry,
      propertyTitle: inquiry.properties?.title,
    }));
    
    return { success: !error, data: transformed, error: error?.message };
  },

  async updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', id);
    return { success: !error, error: error?.message };
  },

  async getUserInquiries(userId: string) {
    const { data, error } = await supabase
      .from('inquiries')
      .select(`
        *,
        properties (title, location)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { success: !error, data, error: error?.message };
  },
};

// Analytics API
export const analyticsApi = {
  async getVendorAnalytics(vendorId: string) {
    // Get all vendor properties
    const { data: properties } = await supabase
      .from('properties')
      .select('id, status, views')
      .eq('vendor_id', vendorId);

    // Get all inquiries for vendor
    const { data: inquiries } = await supabase
      .from('inquiries')
      .select('id')
      .eq('vendor_id', vendorId);

    const totalProperties = properties?.length || 0;
    const totalViews = properties?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;
    const totalInquiries = inquiries?.length || 0;

    const propertiesByStatus = {
      approved: properties?.filter(p => p.status === 'approved').length || 0,
      pending: properties?.filter(p => p.status === 'pending').length || 0,
      rejected: properties?.filter(p => p.status === 'rejected').length || 0,
    };

    return {
      success: true,
      data: {
        totalProperties,
        totalViews,
        totalInquiries,
        propertiesByStatus,
      },
    };
  },
};

// Admin API
export const adminApi = {
  getPendingProperties: propertiesApi.getPendingProperties,
  approveProperty: propertiesApi.approveProperty,
  rejectProperty: propertiesApi.rejectProperty,
  
  async getAllProperties() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    return { success: !error, data, error: error?.message };
  },
};
