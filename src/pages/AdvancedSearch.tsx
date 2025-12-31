import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, MapPin } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import { properties } from '@/data/properties';

const AdvancedSearch = () => {
  const { t } = useLanguage();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 20]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [propertyAge, setPropertyAge] = useState<string>('any');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [bedrooms, setBedrooms] = useState<string>('any');
  const [bathrooms, setBathrooms] = useState<string>('any');
  const [areaRange, setAreaRange] = useState([0, 10000]);
  const [status, setStatus] = useState<string>('all');
  const [amenities, setAmenities] = useState<string[]>([]);

  // Available options
  const locations = [
    { value: 'gulshan', label: 'Gulshan', labelBn: 'গুলশান' },
    { value: 'banani', label: 'Banani', labelBn: 'বনানী' },
    { value: 'uttara', label: 'Uttara', labelBn: 'উত্তরা' },
    { value: 'dhanmondi', label: 'Dhanmondi', labelBn: 'ধানমন্ডি' },
    { value: 'bashundhara', label: 'Bashundhara', labelBn: 'বসুন্ধরা' },
    { value: 'motijheel', label: 'Motijheel', labelBn: 'মতিঝিল' },
  ];

  const allAmenities = [
    'Swimming Pool', 'Garden', 'Gym', 'Parking', 'Security',
    'Elevator', 'Generator', 'Rooftop Access', 'Smart Home',
    'Community Hall', 'Playground', 'Furnished'
  ];

  const propertyAgeOptions = [
    { value: 'any', label: t('Any Age', 'যেকোনো বয়স') },
    { value: 'new', label: t('New Construction (0-1 years)', 'নতুন নির্মাণ (০-১ বছর)') },
    { value: '1-5', label: t('1-5 Years', '১-৫ বছর') },
    { value: '5-10', label: t('5-10 Years', '৫-১০ বছর') },
    { value: '10+', label: t('10+ Years', '১০+ বছর') },
  ];

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 20]);
    setSelectedLocations([]);
    setPropertyAge('any');
    setPropertyType('all');
    setBedrooms('any');
    setBathrooms('any');
    setAreaRange([0, 10000]);
    setStatus('all');
    setAmenities([]);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (priceRange[0] > 0 || priceRange[1] < 20) count++;
    if (selectedLocations.length > 0) count++;
    if (propertyAge !== 'any') count++;
    if (propertyType !== 'all') count++;
    if (bedrooms !== 'any') count++;
    if (bathrooms !== 'any') count++;
    if (areaRange[0] > 0 || areaRange[1] < 10000) count++;
    if (status !== 'all') count++;
    if (amenities.length > 0) count++;
    return count;
  }, [searchQuery, priceRange, selectedLocations, propertyAge, propertyType, bedrooms, bathrooms, areaRange, status, amenities]);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!property.title.toLowerCase().includes(query) &&
            !property.location.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Location filter
      if (selectedLocations.length > 0) {
        const propertyLocation = property.location.toLowerCase();
        if (!selectedLocations.some(loc => propertyLocation.includes(loc))) {
          return false;
        }
      }

      // Property type
      if (propertyType !== 'all' && property.type !== propertyType) {
        return false;
      }

      // Status
      if (status !== 'all' && property.status !== status) {
        return false;
      }

      // Bedrooms
      if (bedrooms !== 'any') {
        const bedroomCount = property.bedrooms || 0;
        if (bedrooms === '5+' && bedroomCount < 5) return false;
        if (bedrooms !== '5+' && bedroomCount !== parseInt(bedrooms)) return false;
      }

      // Bathrooms
      if (bathrooms !== 'any') {
        const bathroomCount = property.bathrooms || 0;
        if (bathrooms === '4+' && bathroomCount < 4) return false;
        if (bathrooms !== '4+' && bathroomCount !== parseInt(bathrooms)) return false;
      }

      // Amenities
      if (amenities.length > 0) {
        if (!amenities.every(amenity => property.amenities?.includes(amenity))) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedLocations, propertyType, status, bedrooms, bathrooms, amenities]);

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('Advanced Property Search', 'উন্নত প্রপার্টি অনুসন্ধান')}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t(
                'Use our advanced filters to find your perfect property',
                'আপনার নিখুঁত প্রপার্টি খুঁজে পেতে আমাদের উন্নত ফিল্টার ব্যবহার করুন'
              )}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-accent" />
                    <h2 className="font-semibold text-foreground">
                      {t('Filters', 'ফিল্টার')}
                    </h2>
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </div>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      {t('Clear All', 'সব মুছুন')}
                    </Button>
                  )}
                </div>

                {/* Search Input */}
                <div className="mb-6">
                  <Label className="text-foreground mb-2 block">
                    {t('Search', 'অনুসন্ধান')}
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('Search properties...', 'প্রপার্টি খুঁজুন...')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Accordion type="multiple" defaultValue={['location', 'price', 'type']} className="space-y-2">
                  {/* Location Filter */}
                  <AccordionItem value="location" className="border-b-0">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {t('Location', 'অবস্থান')}
                        {selectedLocations.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {selectedLocations.length}
                          </Badge>
                        )}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {locations.map((location) => (
                          <div key={location.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={location.value}
                              checked={selectedLocations.includes(location.value)}
                              onCheckedChange={() => toggleLocation(location.value)}
                            />
                            <label
                              htmlFor={location.value}
                              className="text-sm cursor-pointer text-muted-foreground hover:text-foreground"
                            >
                              {t(location.label, location.labelBn)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Price Range */}
                  <AccordionItem value="price" className="border-b-0">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      {t('Price Range', 'মূল্য পরিসীমা')}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={20}
                          min={0}
                          step={0.5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>৳ {priceRange[0]} {t('Crore', 'কোটি')}</span>
                          <span>৳ {priceRange[1]}+ {t('Crore', 'কোটি')}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Property Type */}
                  <AccordionItem value="type" className="border-b-0">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      {t('Property Type', 'প্রপার্টি ধরণ')}
                    </AccordionTrigger>
                    <AccordionContent>
                      <Select value={propertyType} onValueChange={setPropertyType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('All Types', 'সব ধরণ')}</SelectItem>
                          <SelectItem value="sale">{t('For Sale', 'বিক্রয়ের জন্য')}</SelectItem>
                          <SelectItem value="rent">{t('For Rent', 'ভাড়ার জন্য')}</SelectItem>
                          <SelectItem value="project">{t('Project', 'প্রকল্প')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Property Age */}
                  <AccordionItem value="age" className="border-b-0">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      {t('Property Age', 'প্রপার্টি বয়স')}
                    </AccordionTrigger>
                    <AccordionContent>
                      <Select value={propertyAge} onValueChange={setPropertyAge}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyAgeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Bedrooms & Bathrooms */}
                  <AccordionItem value="rooms" className="border-b-0">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      {t('Rooms', 'কক্ষ')}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm text-muted-foreground mb-2 block">
                            {t('Bedrooms', 'শয়নকক্ষ')}
                          </Label>
                          <Select value={bedrooms} onValueChange={setBedrooms}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">{t('Any', 'যেকোনো')}</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5+">5+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground mb-2 block">
                            {t('Bathrooms', 'বাথরুম')}
                          </Label>
                          <Select value={bathrooms} onValueChange={setBathrooms}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">{t('Any', 'যেকোনো')}</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4+">4+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Area Range */}
                  <AccordionItem value="area" className="border-b-0">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      {t('Area (sqft)', 'আয়তন (বর্গফুট)')}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <Slider
                          value={areaRange}
                          onValueChange={setAreaRange}
                          max={10000}
                          min={0}
                          step={100}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{areaRange[0]} sqft</span>
                          <span>{areaRange[1]}+ sqft</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Status */}
                  <AccordionItem value="status" className="border-b-0">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      {t('Status', 'অবস্থা')}
                    </AccordionTrigger>
                    <AccordionContent>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('All', 'সব')}</SelectItem>
                          <SelectItem value="ready">{t('Ready', 'রেডি')}</SelectItem>
                          <SelectItem value="under-construction">{t('Under Construction', 'নির্মাণাধীন')}</SelectItem>
                          <SelectItem value="upcoming">{t('Upcoming', 'আসছে')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Amenities */}
                  <AccordionItem value="amenities" className="border-b-0">
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <span className="flex items-center gap-2">
                        {t('Amenities', 'সুবিধাসমূহ')}
                        {amenities.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {amenities.length}
                          </Badge>
                        )}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2">
                        {allAmenities.map((amenity) => (
                          <div key={amenity} className="flex items-center space-x-2">
                            <Checkbox
                              id={amenity}
                              checked={amenities.includes(amenity)}
                              onCheckedChange={() => toggleAmenity(amenity)}
                            />
                            <label
                              htmlFor={amenity}
                              className="text-xs cursor-pointer text-muted-foreground hover:text-foreground"
                            >
                              {amenity}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1">
              {/* Active Filters */}
              {(selectedLocations.length > 0 || amenities.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedLocations.map(loc => {
                    const location = locations.find(l => l.value === loc);
                    return (
                      <Badge key={loc} variant="secondary" className="flex items-center gap-1">
                        {location?.label}
                        <button onClick={() => toggleLocation(loc)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                  {amenities.map(amenity => (
                    <Badge key={amenity} variant="outline" className="flex items-center gap-1">
                      {amenity}
                      <button onClick={() => toggleAmenity(amenity)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Results Count */}
              <div className="mb-6">
                <p className="text-muted-foreground">
                  {t(
                    `Showing ${filteredProperties.length} properties`,
                    `${filteredProperties.length}টি প্রপার্টি দেখানো হচ্ছে`
                  )}
                </p>
              </div>

              {/* Properties Grid */}
              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-card rounded-xl border border-border">
                  <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t('No Properties Found', 'কোনো প্রপার্টি পাওয়া যায়নি')}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t(
                      'Try adjusting your filters to find more properties',
                      'আরো প্রপার্টি খুঁজে পেতে ফিল্টার পরিবর্তন করুন'
                    )}
                  </p>
                  <Button onClick={clearAllFilters}>
                    {t('Clear All Filters', 'সব ফিল্টার মুছুন')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdvancedSearch;
