import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { properties as staticProperties, Property as StaticProperty } from '@/data/properties';

export interface NormalizedProperty {
  id: string;
  image: string;
  title: string;
  titleBn: string;
  location: string;
  locationBn: string;
  price: string;
  priceBn: string;
  bedrooms?: number;
  bathrooms?: number;
  area: string;
  type: 'sale' | 'rent' | 'project';
  status?: 'ready' | 'under-construction' | 'upcoming';
  featured?: boolean;
  description?: string;
  descriptionBn?: string;
  amenities?: string[];
  isOurProject?: boolean;
  vendorId?: string;
  views?: number;
}

interface SupabaseProperty {
  id: string;
  title: string;
  description: string | null;
  price: number;
  location: string;
  property_type: string;
  listing_type: string;
  status: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  images: string[] | null;
  amenities: string[] | null;
  featured: boolean | null;
  is_our_project: boolean | null;
  vendor_id: string;
  views: number | null;
  created_at: string;
}

function formatPrice(price: number, listingType?: string): string {
  if (listingType === 'rent') {
    return `৳ ${(price / 1000).toFixed(0)}K/month`;
  }
  if (price >= 10000000) {
    return `৳ ${(price / 10000000).toFixed(1)} Crore`;
  }
  if (price >= 100000) {
    return `৳ ${(price / 100000).toFixed(1)} Lakh`;
  }
  return `৳ ${price.toLocaleString()}`;
}

function normalizeSupabaseProperty(prop: SupabaseProperty): NormalizedProperty {
  return {
    id: prop.id,
    image: prop.images?.[0] || '/placeholder.svg',
    title: prop.title,
    titleBn: prop.title, // Can be extended to support Bengali
    location: prop.location,
    locationBn: prop.location, // Can be extended to support Bengali
    price: formatPrice(prop.price, prop.listing_type),
    priceBn: formatPrice(prop.price, prop.listing_type),
    bedrooms: prop.bedrooms || undefined,
    bathrooms: prop.bathrooms || undefined,
    area: prop.area ? `${prop.area} sqft` : '',
    type: (prop.listing_type as 'sale' | 'rent' | 'project') || 'sale',
    status: prop.status as 'ready' | 'under-construction' | 'upcoming' | undefined,
    featured: prop.featured || false,
    description: prop.description || undefined,
    amenities: prop.amenities || undefined,
    isOurProject: prop.is_our_project || false,
    vendorId: prop.vendor_id,
    views: prop.views || 0,
  };
}

interface UsePropertiesOptions {
  listingType?: 'sale' | 'rent' | 'project' | 'all';
  featured?: boolean;
  isOurProject?: boolean;
}

export function useProperties(options: UsePropertiesOptions = {}) {
  const [properties, setProperties] = useState<NormalizedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromSupabase, setIsFromSupabase] = useState(false);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'approved');

      if (options.listingType && options.listingType !== 'all') {
        query = query.eq('listing_type', options.listingType);
      }
      if (options.featured !== undefined) {
        query = query.eq('featured', options.featured);
      }
      if (options.isOurProject !== undefined) {
        query = query.eq('is_our_project', options.isOurProject);
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        const normalized = data.map(normalizeSupabaseProperty);
        setProperties(normalized);
        setIsFromSupabase(true);
      } else {
        // Fallback to static data
        let filtered = [...staticProperties];
        
        if (options.listingType && options.listingType !== 'all') {
          if (options.listingType === 'sale') {
            filtered = filtered.filter(p => p.type === 'sale' || p.type === 'project');
          } else {
            filtered = filtered.filter(p => p.type === options.listingType);
          }
        }
        if (options.featured !== undefined) {
          filtered = filtered.filter(p => p.featured === options.featured);
        }
        if (options.isOurProject !== undefined) {
          filtered = filtered.filter(p => p.isOurProject === options.isOurProject);
        }

        setProperties(filtered as NormalizedProperty[]);
        setIsFromSupabase(false);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      // Fallback to static data on error
      let filtered = [...staticProperties];
      
      if (options.listingType && options.listingType !== 'all') {
        if (options.listingType === 'sale') {
          filtered = filtered.filter(p => p.type === 'sale' || p.type === 'project');
        } else {
          filtered = filtered.filter(p => p.type === options.listingType);
        }
      }

      setProperties(filtered as NormalizedProperty[]);
      setIsFromSupabase(false);
      setError('Using cached data');
    } finally {
      setIsLoading(false);
    }
  }, [options.listingType, options.featured, options.isOurProject]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, isLoading, error, isFromSupabase, refetch: fetchProperties };
}
