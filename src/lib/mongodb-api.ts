const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

async function callFunction<T>(functionName: string, body: object): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/${functionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  } catch (error) {
    console.error(`Error calling ${functionName}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Auth API
export const authApi = {
  signup: (email: string, password: string, name?: string, role?: string) =>
    callFunction('auth-mongodb', { action: 'signup', email, password, name, role }),
  
  login: (email: string, password: string) =>
    callFunction('auth-mongodb', { action: 'login', email, password }),
};

// Properties API
export const propertiesApi = {
  getAll: (filters?: object) =>
    callFunction('properties-mongodb', { action: 'getProperties', filters }),
  
  getOne: (id: string) =>
    callFunction('properties-mongodb', { action: 'getProperty', id }),
  
  create: (data: object, vendorId: string) =>
    callFunction('properties-mongodb', { action: 'createProperty', data, vendorId }),
  
  update: (id: string, data: object, vendorId: string) =>
    callFunction('properties-mongodb', { action: 'updateProperty', id, data, vendorId }),
  
  delete: (id: string, vendorId: string) =>
    callFunction('properties-mongodb', { action: 'deleteProperty', id, vendorId }),
  
  getVendorProperties: (vendorId: string) =>
    callFunction('properties-mongodb', { action: 'getVendorProperties', vendorId }),
  
  incrementViews: (id: string) =>
    callFunction('properties-mongodb', { action: 'incrementViews', id }),
};

// Favorites API
export const favoritesApi = {
  getAll: (userId: string) =>
    callFunction('properties-mongodb', { action: 'getFavorites', data: { userId } }),
  
  add: (userId: string, propertyId: string) =>
    callFunction('properties-mongodb', { action: 'addFavorite', data: { userId, propertyId } }),
  
  remove: (userId: string, propertyId: string) =>
    callFunction('properties-mongodb', { action: 'removeFavorite', data: { userId, propertyId } }),
};

// Inquiries API
export const inquiriesApi = {
  create: (data: { propertyId: string; vendorId: string; userId: string; name: string; email: string; phone?: string; message: string }) =>
    callFunction('properties-mongodb', { action: 'createInquiry', data }),
  
  getVendorInquiries: (vendorId: string) =>
    callFunction('properties-mongodb', { action: 'getVendorInquiries', vendorId }),
  
  updateStatus: (id: string, status: string) =>
    callFunction('properties-mongodb', { action: 'updateInquiryStatus', id, data: { status } }),
};

// Analytics API
export const analyticsApi = {
  getVendorAnalytics: (vendorId: string) =>
    callFunction('properties-mongodb', { action: 'getVendorAnalytics', vendorId }),
};

// Generic MongoDB API
export const mongoApi = {
  find: (collection: string, query?: object) =>
    callFunction('mongodb', { action: 'find', collection, query }),
  
  findOne: (collection: string, id?: string, query?: object) =>
    callFunction('mongodb', { action: 'findOne', collection, id, query }),
  
  insert: (collection: string, data: object) =>
    callFunction('mongodb', { action: 'insert', collection, data }),
  
  update: (collection: string, id: string, data: object) =>
    callFunction('mongodb', { action: 'update', collection, id, data }),
  
  delete: (collection: string, id: string) =>
    callFunction('mongodb', { action: 'delete', collection, id }),
};
