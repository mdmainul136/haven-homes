import { useState, useEffect, useCallback } from 'react';
import { propertiesApi } from '@/lib/mongodb-api';
import { properties as staticProperties, Property as StaticProperty } from '@/data/properties';

export interface MongoProperty {
  _id: string;
  title: string;
  titleBn?: string;
  description?: string;
  descriptionBn?: string;
  price: number;
  priceDisplay?: string;
  location: string;
  locationBn?: string;
  type: string;
  listingType?: 'sale' | 'rent' | 'project';
  status?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaDisplay?: string;
  images?: string[];
  amenities?: string[];
  featured?: boolean;
  isOurProject?: boolean;
  vendorId?: string;
  views?: number;
  createdAt?: string;
}

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
}

function normalizeMongoProperty(prop: MongoProperty): NormalizedProperty {
  const formatPrice = (price: number, listingType?: string) => {
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
  };

  return {
    id: prop._id,
    image: prop.images?.[0] || '/placeholder.svg',
    title: prop.title,
    titleBn: prop.titleBn || prop.title,
    location: prop.location,
    locationBn: prop.locationBn || prop.location,
    price: prop.priceDisplay || formatPrice(prop.price, prop.listingType),
    priceBn: prop.priceDisplay || formatPrice(prop.price, prop.listingType),
    bedrooms: prop.bedrooms,
    bathrooms: prop.bathrooms,
    area: prop.areaDisplay || (prop.area ? `${prop.area} sqft` : ''),
    type: (prop.listingType as 'sale' | 'rent' | 'project') || 'sale',
    status: prop.status as 'ready' | 'under-construction' | 'upcoming',
    featured: prop.featured,
    description: prop.description,
    descriptionBn: prop.descriptionBn,
    amenities: prop.amenities,
    isOurProject: prop.isOurProject,
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
  const [isFromMongo, setIsFromMongo] = useState(false);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const filters: Record<string, unknown> = { status: 'approved' };
      
      if (options.listingType && options.listingType !== 'all') {
        filters.listingType = options.listingType;
      }
      if (options.featured !== undefined) {
        filters.featured = options.featured;
      }
      if (options.isOurProject !== undefined) {
        filters.isOurProject = options.isOurProject;
      }

      const response = await propertiesApi.getAll(filters);

      if (response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
        const normalized = (response.data as MongoProperty[]).map(normalizeMongoProperty);
        setProperties(normalized);
        setIsFromMongo(true);
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
        setIsFromMongo(false);
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
      setIsFromMongo(false);
      setError('Using cached data');
    } finally {
      setIsLoading(false);
    }
  }, [options.listingType, options.featured, options.isOurProject]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, isLoading, error, isFromMongo, refetch: fetchProperties };
}
