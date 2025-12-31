import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calculator, Home, MapPin, TrendingUp, Building2, Bath, BedDouble, Ruler } from 'lucide-react';

const PropertyValuation = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [valuationResult, setValuationResult] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    propertyType: '',
    location: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    age: '',
    condition: '',
    amenities: [] as string[],
  });

  const locations = [
    'Gulshan, Dhaka',
    'Banani, Dhaka',
    'Dhanmondi, Dhaka',
    'Uttara, Dhaka',
    'Bashundhara, Dhaka',
    'Mirpur, Dhaka',
    'Mohammadpur, Dhaka',
    'Chittagong City',
    'Sylhet City',
    'Other',
  ];

  const propertyTypes = [
    { value: 'apartment', label: t('Apartment', 'অ্যাপার্টমেন্ট') },
    { value: 'house', label: t('House', 'বাড়ি') },
    { value: 'villa', label: t('Villa', 'ভিলা') },
    { value: 'duplex', label: t('Duplex', 'ডুপ্লেক্স') },
    { value: 'penthouse', label: t('Penthouse', 'পেন্টহাউস') },
    { value: 'commercial', label: t('Commercial', 'বাণিজ্যিক') },
    { value: 'land', label: t('Land', 'জমি') },
  ];

  const conditions = [
    { value: 'excellent', label: t('Excellent', 'চমৎকার'), multiplier: 1.2 },
    { value: 'good', label: t('Good', 'ভালো'), multiplier: 1.0 },
    { value: 'average', label: t('Average', 'গড়'), multiplier: 0.85 },
    { value: 'needs-renovation', label: t('Needs Renovation', 'সংস্কার প্রয়োজন'), multiplier: 0.7 },
  ];

  const amenitiesList = [
    { value: 'parking', label: t('Parking', 'পার্কিং') },
    { value: 'elevator', label: t('Elevator', 'লিফট') },
    { value: 'security', label: t('24/7 Security', '২৪/৭ নিরাপত্তা') },
    { value: 'gym', label: t('Gym', 'জিম') },
    { value: 'pool', label: t('Swimming Pool', 'সুইমিং পুল') },
    { value: 'garden', label: t('Garden', 'বাগান') },
    { value: 'rooftop', label: t('Rooftop Access', 'ছাদে প্রবেশাধিকার') },
    { value: 'generator', label: t('Generator Backup', 'জেনারেটর ব্যাকআপ') },
  ];

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const calculateValuation = () => {
    setIsCalculating(true);
    
    // Base price per sq ft by location (in BDT)
    const locationPrices: Record<string, number> = {
      'Gulshan, Dhaka': 22000,
      'Banani, Dhaka': 18000,
      'Dhanmondi, Dhaka': 16000,
      'Uttara, Dhaka': 12000,
      'Bashundhara, Dhaka': 10000,
      'Mirpur, Dhaka': 8000,
      'Mohammadpur, Dhaka': 9000,
      'Chittagong City': 8000,
      'Sylhet City': 7000,
      'Other': 6000,
    };

    const basePrice = locationPrices[formData.location] || 6000;
    const area = parseFloat(formData.area) || 0;
    
    // Property type multiplier
    const typeMultipliers: Record<string, number> = {
      apartment: 1.0,
      house: 1.15,
      villa: 1.4,
      duplex: 1.25,
      penthouse: 1.5,
      commercial: 1.3,
      land: 0.6,
    };
    const typeMultiplier = typeMultipliers[formData.propertyType] || 1.0;

    // Condition multiplier
    const conditionMultiplier = conditions.find(c => c.value === formData.condition)?.multiplier || 1.0;

    // Age depreciation
    const age = parseInt(formData.age) || 0;
    const ageMultiplier = Math.max(0.7, 1 - (age * 0.015));

    // Amenities bonus (2% per amenity, max 15%)
    const amenitiesBonus = Math.min(0.15, formData.amenities.length * 0.02);

    // Calculate final valuation
    const valuation = basePrice * area * typeMultiplier * conditionMultiplier * ageMultiplier * (1 + amenitiesBonus);

    setTimeout(() => {
      setValuationResult(Math.round(valuation));
      setIsCalculating(false);
      setStep(3);
    }, 1500);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `৳${(price / 10000000).toFixed(2)} ${t('Crore', 'কোটি')}`;
    } else if (price >= 100000) {
      return `৳${(price / 100000).toFixed(2)} ${t('Lakh', 'লাখ')}`;
    }
    return `৳${price.toLocaleString()}`;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background py-12">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4">
              <Calculator className="h-4 w-4" />
              <span className="text-sm font-medium">{t('Free Valuation Tool', 'বিনামূল্যে মূল্যায়ন টুল')}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {t('Property Valuation', 'সম্পত্তি মূল্যায়ন')}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t(
                'Get an instant estimate of your property value based on current market conditions and property details.',
                'বর্তমান বাজার পরিস্থিতি এবং সম্পত্তির বিবরণের ভিত্তিতে আপনার সম্পত্তির তাৎক্ষণিক মূল্যায়ন পান।'
              )}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 rounded ${
                      step > s ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Details */}
          {step === 1 && (
            <Card className="shadow-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-accent" />
                  {t('Property Details', 'সম্পত্তির বিবরণ')}
                </CardTitle>
                <CardDescription>
                  {t('Tell us about your property', 'আপনার সম্পত্তি সম্পর্কে বলুন')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>{t('Property Type', 'সম্পত্তির ধরন')}</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select type', 'ধরন নির্বাচন করুন')} />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('Location', 'অবস্থান')}</Label>
                    <Select
                      value={formData.location}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select location', 'অবস্থান নির্বাচন করুন')} />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      {t('Area (sq ft)', 'আয়তন (বর্গ ফুট)')}
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g., 1500"
                      value={formData.area}
                      onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {t('Property Age (years)', 'সম্পত্তির বয়স (বছর)')}
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g., 5"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <BedDouble className="h-4 w-4" />
                      {t('Bedrooms', 'বেডরুম')}
                    </Label>
                    <Select
                      value={formData.bedrooms}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, bedrooms: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select', 'নির্বাচন করুন')} />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, '6+'].map((num) => (
                          <SelectItem key={num} value={String(num)}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Bath className="h-4 w-4" />
                      {t('Bathrooms', 'বাথরুম')}
                    </Label>
                    <Select
                      value={formData.bathrooms}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, bathrooms: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select', 'নির্বাচন করুন')} />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, '5+'].map((num) => (
                          <SelectItem key={num} value={String(num)}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!formData.propertyType || !formData.location || !formData.area}
                    className="bg-gradient-gold text-primary hover:opacity-90"
                  >
                    {t('Continue', 'চালিয়ে যান')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Condition & Amenities */}
          {step === 2 && (
            <Card className="shadow-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  {t('Condition & Amenities', 'অবস্থা ও সুযোগ-সুবিধা')}
                </CardTitle>
                <CardDescription>
                  {t('Help us understand your property better', 'আপনার সম্পত্তি সম্পর্কে আরও জানতে সাহায্য করুন')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>{t('Property Condition', 'সম্পত্তির অবস্থা')}</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {conditions.map((condition) => (
                      <Button
                        key={condition.value}
                        variant={formData.condition === condition.value ? 'default' : 'outline'}
                        className={formData.condition === condition.value ? 'bg-primary' : ''}
                        onClick={() => setFormData(prev => ({ ...prev, condition: condition.value }))}
                      >
                        {condition.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>{t('Amenities (select all that apply)', 'সুবিধাসমূহ (প্রযোজ্য সব নির্বাচন করুন)')}</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {amenitiesList.map((amenity) => (
                      <Button
                        key={amenity.value}
                        variant={formData.amenities.includes(amenity.value) ? 'default' : 'outline'}
                        className={formData.amenities.includes(amenity.value) ? 'bg-accent text-accent-foreground' : ''}
                        onClick={() => handleAmenityToggle(amenity.value)}
                      >
                        {amenity.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    {t('Back', 'পেছনে')}
                  </Button>
                  <Button
                    onClick={calculateValuation}
                    disabled={!formData.condition || isCalculating}
                    className="bg-gradient-gold text-primary hover:opacity-90"
                  >
                    {isCalculating ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        {t('Calculating...', 'গণনা করা হচ্ছে...')}
                      </span>
                    ) : (
                      t('Get Valuation', 'মূল্যায়ন পান')
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Results */}
          {step === 3 && valuationResult && (
            <div className="space-y-6 animate-fade-in">
              <Card className="shadow-elevated border-accent/20">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl text-muted-foreground">
                    {t('Estimated Property Value', 'আনুমানিক সম্পত্তির মূল্য')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {formatPrice(valuationResult)}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {t('Based on current market conditions', 'বর্তমান বাজার পরিস্থিতির উপর ভিত্তি করে')}
                  </p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="shadow-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      {t('Property Summary', 'সম্পত্তির সারসংক্ষেপ')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Type', 'ধরন')}</span>
                      <span className="font-medium capitalize">{formData.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Location', 'অবস্থান')}</span>
                      <span className="font-medium">{formData.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Area', 'আয়তন')}</span>
                      <span className="font-medium">{formData.area} sq ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Condition', 'অবস্থা')}</span>
                      <span className="font-medium capitalize">{formData.condition}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-accent" />
                      {t('Price Range', 'মূল্য পরিসীমা')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Low Estimate', 'নিম্ন অনুমান')}</span>
                      <span className="font-medium">{formatPrice(Math.round(valuationResult * 0.9))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Mid Estimate', 'মধ্য অনুমান')}</span>
                      <span className="font-medium text-primary">{formatPrice(valuationResult)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('High Estimate', 'উচ্চ অনুমান')}</span>
                      <span className="font-medium">{formatPrice(Math.round(valuationResult * 1.1))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Price/sq ft', 'মূল্য/বর্গ ফুট')}</span>
                      <span className="font-medium">৳{Math.round(valuationResult / parseFloat(formData.area)).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep(1);
                    setValuationResult(null);
                    setFormData({
                      propertyType: '',
                      location: '',
                      area: '',
                      bedrooms: '',
                      bathrooms: '',
                      age: '',
                      condition: '',
                      amenities: [],
                    });
                  }}
                >
                  {t('Start New Valuation', 'নতুন মূল্যায়ন শুরু করুন')}
                </Button>
                <Button className="bg-gradient-gold text-primary hover:opacity-90">
                  {t('Get Expert Valuation', 'বিশেষজ্ঞ মূল্যায়ন পান')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PropertyValuation;
