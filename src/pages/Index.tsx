import { Link } from 'react-router-dom';
import { Search, ArrowRight, Building2, Home, Key, Star, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/layout/Layout';
import PropertyCard from '@/components/PropertyCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { properties, developmentProjects, testimonials } from '@/data/properties';
import heroBg from '@/assets/hero-bg.jpg';

const Index = () => {
  const { t } = useLanguage();

  const featuredProperties = properties.filter(p => p.featured).slice(0, 3);
  const ourProjects = properties.filter(p => p.isOurProject).slice(0, 3);
  const rentalProperties = properties.filter(p => p.type === 'rent').slice(0, 3);

  const stats = [
    { value: '500+', label: t('Properties Sold', 'বিক্রিত সম্পত্তি') },
    { value: '50+', label: t('Development Projects', 'উন্নয়ন প্রকল্প') },
    { value: '10K+', label: t('Happy Clients', 'সন্তুষ্ট গ্রাহক') },
    { value: '15+', label: t('Years Experience', 'বছরের অভিজ্ঞতা') },
  ];

  const whyChooseUs = [
    {
      icon: CheckCircle,
      title: t('Verified Properties', 'যাচাইকৃত সম্পত্তি'),
      description: t('All properties are verified and legally checked for your peace of mind.', 'সমস্ত সম্পত্তি যাচাই করা এবং আইনগতভাবে পরীক্ষা করা আপনার মানসিক শান্তির জন্য।'),
    },
    {
      icon: TrendingUp,
      title: t('Best Market Price', 'সেরা বাজার মূল্য'),
      description: t('Get the best value for your money with our competitive pricing analysis.', 'আমাদের প্রতিযোগিতামূলক মূল্য বিশ্লেষণের মাধ্যমে আপনার অর্থের জন্য সেরা মূল্য পান।'),
    },
    {
      icon: Users,
      title: t('Expert Team', 'বিশেষজ্ঞ দল'),
      description: t('Our experienced real estate professionals guide you through every step.', 'আমাদের অভিজ্ঞ রিয়েল এস্টেট পেশাদাররা প্রতিটি পদক্ষেপে আপনাকে গাইড করে।'),
    },
    {
      icon: Key,
      title: t('End-to-End Service', 'সম্পূর্ণ সেবা'),
      description: t('From property search to paperwork, we handle everything for you.', 'সম্পত্তি অনুসন্ধান থেকে কাগজপত্র পর্যন্ত, আমরা আপনার জন্য সবকিছু পরিচালনা করি।'),
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-85" />
        
        <div className="container relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-up">
              {t(
                'Buy, Sell & Invest in Properties with Confidence',
                'আত্মবিশ্বাসের সাথে সম্পত্তি কিনুন, বিক্রি করুন এবং বিনিয়োগ করুন'
              )}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {t(
                "Bangladesh's premier real estate platform. Discover premium properties, trusted developers, and seamless transactions.",
                'বাংলাদেশের প্রধান রিয়েল এস্টেট প্ল্যাটফর্ম। প্রিমিয়াম সম্পত্তি, বিশ্বস্ত ডেভেলপার এবং নির্বিঘ্ন লেনদেন আবিষ্কার করুন।'
              )}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/buy">
                <Button size="lg" className="bg-gradient-gold text-primary hover:opacity-90 shadow-gold font-semibold px-8">
                  <Home className="mr-2 h-5 w-5" />
                  {t('Buy Property', 'সম্পত্তি কিনুন')}
                </Button>
              </Link>
              <Link to="/sell">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8">
                  <Key className="mr-2 h-5 w-5" />
                  {t('Sell Property', 'সম্পত্তি বিক্রি')}
                </Button>
              </Link>
              <Link to="/projects">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8">
                  <Building2 className="mr-2 h-5 w-5" />
                  {t('View Projects', 'প্রকল্প দেখুন')}
                </Button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="bg-card rounded-xl p-4 shadow-elevated max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <Input 
                    placeholder={t('Search by location, project, or keyword...', 'অবস্থান, প্রকল্প বা কীওয়ার্ড দিয়ে অনুসন্ধান করুন...')}
                    className="h-12 bg-background border-border"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-full md:w-40 h-12 bg-background border-border">
                    <SelectValue placeholder={t('Type', 'ধরন')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">{t('Buy', 'কিনুন')}</SelectItem>
                    <SelectItem value="rent">{t('Rent', 'ভাড়া')}</SelectItem>
                    <SelectItem value="project">{t('Project', 'প্রকল্প')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Search className="mr-2 h-5 w-5" />
                  {t('Search', 'অনুসন্ধান')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-accent mb-1">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Developed Projects */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-accent font-semibold mb-2">{t('Premium Quality', 'প্রিমিয়াম মান')}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {t('Our Developed Projects', 'আমাদের উন্নত প্রকল্পসমূহ')}
              </h2>
              <p className="text-muted-foreground mt-3 max-w-xl">
                {t(
                  'Explore our premium residential and commercial developments crafted with excellence.',
                  'উৎকর্ষতার সাথে তৈরি আমাদের প্রিমিয়াম আবাসিক এবং বাণিজ্যিক উন্নয়ন অন্বেষণ করুন।'
                )}
              </p>
            </div>
            <Link to="/projects" className="mt-4 md:mt-0">
              <Button variant="outline" className="group">
                {t('View All Projects', 'সব প্রকল্প দেখুন')}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ourProjects.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>
      </section>

      {/* Properties for Sale */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-accent font-semibold mb-2">{t('Find Your Dream Home', 'আপনার স্বপ্নের বাড়ি খুঁজুন')}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {t('Featured Properties for Sale', 'বিক্রয়ের জন্য বিশেষ সম্পত্তি')}
              </h2>
            </div>
            <Link to="/buy" className="mt-4 md:mt-0">
              <Button variant="outline" className="group">
                {t('Browse All', 'সব দেখুন')}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>
      </section>

      {/* Properties for Rent */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-accent font-semibold mb-2">{t('Flexible Rentals', 'নমনীয় ভাড়া')}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {t('Properties for Rent', 'ভাড়ার জন্য সম্পত্তি')}
              </h2>
            </div>
            <Link to="/rent" className="mt-4 md:mt-0">
              <Button variant="outline" className="group">
                {t('View All Rentals', 'সব ভাড়া দেখুন')}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rentalProperties.length > 0 ? rentalProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            )) : (
              <p className="text-muted-foreground col-span-3 text-center py-12">
                {t('No rental properties available at the moment.', 'এই মুহূর্তে কোন ভাড়া সম্পত্তি পাওয়া যাচ্ছে না।')}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-accent font-semibold mb-2">{t('Why Choose Us', 'কেন আমাদের বেছে নেবেন')}</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              {t('Your Trusted Real Estate Partner', 'আপনার বিশ্বস্ত রিয়েল এস্টেট পার্টনার')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-primary-foreground/70">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-accent font-semibold mb-2">{t('Testimonials', 'প্রশংসাপত্র')}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('What Our Clients Say', 'আমাদের গ্রাহকরা কী বলেন')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{t(testimonial.content, testimonial.contentBn)}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-accent font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {t(testimonial.name, testimonial.nameBn)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t(testimonial.role, testimonial.roleBn)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-gold">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              {t('Ready to List Your Property?', 'আপনার সম্পত্তি লিস্ট করতে প্রস্তুত?')}
            </h2>
            <p className="text-primary/80 text-lg mb-8">
              {t(
                'Join thousands of property owners who trust BanglaProperty to connect with genuine buyers and tenants.',
                'হাজার হাজার সম্পত্তির মালিকদের সাথে যোগ দিন যারা প্রকৃত ক্রেতা এবং ভাড়াটেদের সাথে সংযুক্ত হতে বাংলাপ্রপার্টিকে বিশ্বাস করেন।'
              )}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/sell">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8">
                  {t('Register as Vendor', 'বিক্রেতা হিসেবে নিবন্ধন করুন')}
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 font-semibold px-8">
                  {t('Contact Us', 'যোগাযোগ করুন')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
