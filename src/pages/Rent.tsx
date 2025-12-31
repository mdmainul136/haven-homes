import { useState } from 'react';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import PropertyCard from '@/components/PropertyCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProperties } from '@/hooks/useProperties';

const Rent = () => {
  const { t } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);

  const { properties: rentalProperties, isLoading } = useProperties({ listingType: 'rent' });

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            {t('Properties for Rent', 'ভাড়ার জন্য সম্পত্তি')}
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl">
            {t(
              'Find your perfect rental property. From short-term stays to long-term leases, we have options for everyone.',
              'আপনার নিখুঁত ভাড়া সম্পত্তি খুঁজুন। স্বল্পমেয়াদী থেকে দীর্ঘমেয়াদী লিজ পর্যন্ত, আমাদের কাছে সকলের জন্য বিকল্প রয়েছে।'
            )}
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container">
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm">
              {t('All', 'সব')}
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm">
              {t('Short Term', 'স্বল্পমেয়াদী')}
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm">
              {t('Long Term', 'দীর্ঘমেয়াদী')}
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm">
              {t('Furnished', 'আসবাবপত্র সহ')}
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm">
              {t('Unfurnished', 'আসবাবপত্র ছাড়া')}
            </Badge>
          </div>

          {/* Search Bar */}
          <div className="bg-card rounded-xl p-4 shadow-card mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder={t('Search rental properties...', 'ভাড়া সম্পত্তি অনুসন্ধান করুন...')}
                  className="pl-10 h-12"
                />
              </div>
              <Select>
                <SelectTrigger className="w-full lg:w-48 h-12">
                  <SelectValue placeholder={t('Monthly Budget', 'মাসিক বাজেট')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20k">{t('Under ৳20,000', '৳২০,০০০ এর নিচে')}</SelectItem>
                  <SelectItem value="50k">{t('৳20,000 - ৳50,000', '৳২০,০০০ - ৳৫০,০০০')}</SelectItem>
                  <SelectItem value="100k">{t('৳50,000 - ৳1,00,000', '৳৫০,০০০ - ৳১,০০,০০০')}</SelectItem>
                  <SelectItem value="above">{t('Above ৳1,00,000', '৳১,০০,০০০ এর উপরে')}</SelectItem>
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
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                className="h-12"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {t('Filters', 'ফিল্টার')}
              </Button>
              <Button className="h-12 bg-primary text-primary-foreground">
                <Search className="mr-2 h-4 w-4" />
                {t('Search', 'অনুসন্ধান')}
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {t(`Showing ${rentalProperties.length} rental properties`, `${rentalProperties.length}টি ভাড়া সম্পত্তি দেখাচ্ছে`)}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : rentalProperties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                {t('No rental properties found. Check back soon!', 'কোন ভাড়া সম্পত্তি পাওয়া যায়নি। শীঘ্রই আবার দেখুন!')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rentalProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Rent;
