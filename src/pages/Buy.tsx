import { useState } from 'react';
import { Search, SlidersHorizontal, Grid, List as ListIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import Layout from '@/components/layout/Layout';
import PropertyCard from '@/components/PropertyCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProperties } from '@/hooks/useProperties';

const Buy = () => {
  const { t } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 100]);
  
  const { properties: saleProperties, isLoading } = useProperties({ listingType: 'sale' });

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            {t('Buy Property', 'সম্পত্তি কিনুন')}
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl">
            {t(
              'Discover your perfect property from our extensive collection of verified listings. Filter by location, price, and amenities.',
              'আমাদের যাচাইকৃত তালিকার বিস্তৃত সংগ্রহ থেকে আপনার নিখুঁত সম্পত্তি আবিষ্কার করুন। অবস্থান, মূল্য এবং সুবিধা অনুযায়ী ফিল্টার করুন।'
            )}
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container">
          {/* Search & Filters Bar */}
          <div className="bg-card rounded-xl p-4 shadow-card mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder={t('Search by location or keyword...', 'অবস্থান বা কীওয়ার্ড দিয়ে অনুসন্ধান করুন...')}
                  className="pl-10 h-12"
                />
              </div>
              <Select>
                <SelectTrigger className="w-full lg:w-48 h-12">
                  <SelectValue placeholder={t('Property Type', 'সম্পত্তির ধরন')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">{t('Apartment', 'অ্যাপার্টমেন্ট')}</SelectItem>
                  <SelectItem value="villa">{t('Villa', 'ভিলা')}</SelectItem>
                  <SelectItem value="townhouse">{t('Townhouse', 'টাউনহাউস')}</SelectItem>
                  <SelectItem value="commercial">{t('Commercial', 'বাণিজ্যিক')}</SelectItem>
                  <SelectItem value="land">{t('Land', 'জমি')}</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full lg:w-48 h-12">
                  <SelectValue placeholder={t('Location', 'অবস্থান')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gulshan">{t('Gulshan', 'গুলশান')}</SelectItem>
                  <SelectItem value="banani">{t('Banani', 'বনানী')}</SelectItem>
                  <SelectItem value="dhanmondi">{t('Dhanmondi', 'ধানমন্ডি')}</SelectItem>
                  <SelectItem value="uttara">{t('Uttara', 'উত্তরা')}</SelectItem>
                  <SelectItem value="bashundhara">{t('Bashundhara', 'বসুন্ধরা')}</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                className="h-12 lg:w-auto"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {t('More Filters', 'আরও ফিল্টার')}
              </Button>
              <Button className="h-12 bg-primary text-primary-foreground">
                <Search className="mr-2 h-4 w-4" />
                {t('Search', 'অনুসন্ধান')}
              </Button>
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('Bedrooms', 'বেডরুম')}</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('Any', 'যেকোনো')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('Bathrooms', 'বাথরুম')}</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('Any', 'যেকোনো')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('Price Range', 'মূল্য পরিসর')}</label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100}
                    step={1}
                    className="mt-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>৳ {priceRange[0]} Lakh</span>
                    <span>৳ {priceRange[1]} Crore</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('Status', 'অবস্থা')}</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="ready" />
                      <label htmlFor="ready" className="text-sm">{t('Ready', 'রেডি')}</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="construction" />
                      <label htmlFor="construction" className="text-sm">{t('Under Construction', 'নির্মাণাধীন')}</label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {t(`Showing ${saleProperties.length} properties`, `${saleProperties.length}টি সম্পত্তি দেখাচ্ছে`)}
            </p>
            <div className="flex items-center gap-4">
              <Select defaultValue="newest">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t('Newest First', 'নতুন প্রথমে')}</SelectItem>
                  <SelectItem value="price-low">{t('Price: Low to High', 'মূল্য: কম থেকে বেশি')}</SelectItem>
                  <SelectItem value="price-high">{t('Price: High to Low', 'মূল্য: বেশি থেকে কম')}</SelectItem>
                </SelectContent>
              </Select>
              <div className="hidden md:flex items-center gap-1 border border-border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className={viewMode === 'grid' ? 'bg-muted' : ''}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={viewMode === 'list' ? 'bg-muted' : ''}
                  onClick={() => setViewMode('list')}
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Property Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : saleProperties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                {t('No properties found. Check back soon!', 'কোন সম্পত্তি পাওয়া যায়নি। শীঘ্রই আবার দেখুন!')}
              </p>
            </div>
          ) : (
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {saleProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Buy;
