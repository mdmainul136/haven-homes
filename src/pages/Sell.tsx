import { useState } from 'react';
import { Upload, Plus, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

const Sell = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast({
      title: t('Application Submitted!', 'আবেদন জমা হয়েছে!'),
      description: t('We will review your property and contact you soon.', 'আমরা আপনার সম্পত্তি পর্যালোচনা করব এবং শীঘ্রই যোগাযোগ করব।'),
    });
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="py-20 bg-background min-h-[60vh] flex items-center">
          <div className="container">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {t('Application Submitted Successfully!', 'আবেদন সফলভাবে জমা হয়েছে!')}
              </h1>
              <p className="text-muted-foreground mb-8">
                {t(
                  'Thank you for listing your property with us. Our team will review your submission and contact you within 24-48 hours.',
                  'আমাদের সাথে আপনার সম্পত্তি তালিকাভুক্ত করার জন্য ধন্যবাদ। আমাদের দল আপনার জমা পর্যালোচনা করবে এবং ২৪-৪৮ ঘন্টার মধ্যে যোগাযোগ করবে।'
                )}
              </p>
              <Button onClick={() => setIsSubmitted(false)} className="bg-primary text-primary-foreground">
                {t('List Another Property', 'আরেকটি সম্পত্তি লিস্ট করুন')}
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            {t('Sell Your Property', 'আপনার সম্পত্তি বিক্রি করুন')}
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl">
            {t(
              'List your property with BanglaProperty and connect with thousands of genuine buyers. Our team will help you get the best value.',
              'বাংলাপ্রপার্টির সাথে আপনার সম্পত্তি তালিকাভুক্ত করুন এবং হাজার হাজার প্রকৃত ক্রেতাদের সাথে সংযুক্ত হন। আমাদের দল আপনাকে সেরা মূল্য পেতে সাহায্য করবে।'
            )}
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container max-w-4xl">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-20 h-1 ${step > s ? 'bg-accent' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>{t('Personal Information', 'ব্যক্তিগত তথ্য')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>{t('Full Name', 'পুরো নাম')} *</Label>
                      <Input placeholder={t('Enter your name', 'আপনার নাম লিখুন')} required />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Phone Number', 'ফোন নম্বর')} *</Label>
                      <Input type="tel" placeholder="+880 1XXX-XXXXXX" required />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Email Address', 'ইমেইল ঠিকানা')} *</Label>
                      <Input type="email" placeholder="you@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('NID Number', 'এনআইডি নম্বর')}</Label>
                      <Input placeholder={t('National ID Number', 'জাতীয় পরিচয়পত্র নম্বর')} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('Address', 'ঠিকানা')} *</Label>
                    <Textarea placeholder={t('Your current address', 'আপনার বর্তমান ঠিকানা')} required />
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" onClick={() => setStep(2)} className="bg-primary text-primary-foreground">
                      {t('Next', 'পরবর্তী')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Property Details */}
            {step === 2 && (
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>{t('Property Details', 'সম্পত্তির বিবরণ')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>{t('Property Title', 'সম্পত্তির শিরোনাম')} *</Label>
                      <Input placeholder={t('e.g., Modern Apartment in Gulshan', 'যেমন, গুলশানে আধুনিক অ্যাপার্টমেন্ট')} required />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Property Type', 'সম্পত্তির ধরন')} *</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder={t('Select type', 'ধরন নির্বাচন করুন')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apartment">{t('Apartment', 'অ্যাপার্টমেন্ট')}</SelectItem>
                          <SelectItem value="villa">{t('Villa', 'ভিলা')}</SelectItem>
                          <SelectItem value="townhouse">{t('Townhouse', 'টাউনহাউস')}</SelectItem>
                          <SelectItem value="commercial">{t('Commercial', 'বাণিজ্যিক')}</SelectItem>
                          <SelectItem value="land">{t('Land', 'জমি')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Listing Type', 'তালিকার ধরন')} *</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder={t('Select', 'নির্বাচন করুন')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sale">{t('For Sale', 'বিক্রয়ের জন্য')}</SelectItem>
                          <SelectItem value="rent">{t('For Rent', 'ভাড়ার জন্য')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Price', 'মূল্য')} (৳) *</Label>
                      <Input type="number" placeholder="0" required />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Area', 'আয়তন')} (sqft) *</Label>
                      <Input type="number" placeholder="0" required />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Bedrooms', 'বেডরুম')}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={t('Select', 'নির্বাচন করুন')} />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map(n => (
                            <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Bathrooms', 'বাথরুম')}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={t('Select', 'নির্বাচন করুন')} />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map(n => (
                            <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Location', 'অবস্থান')} *</Label>
                      <Input placeholder={t('e.g., Gulshan, Dhaka', 'যেমন, গুলশান, ঢাকা')} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('Property Description', 'সম্পত্তির বিবরণ')} *</Label>
                    <Textarea 
                      placeholder={t('Describe your property in detail...', 'আপনার সম্পত্তি বিস্তারিত বর্ণনা করুন...')} 
                      rows={4}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('Amenities', 'সুবিধাসমূহ')}</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Parking', 'Swimming Pool', 'Gym', 'Security', 'Elevator', 'Generator'].map(amenity => (
                        <div key={amenity} className="flex items-center gap-2">
                          <Checkbox id={amenity} />
                          <label htmlFor={amenity} className="text-sm">{amenity}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      {t('Back', 'পূর্ববর্তী')}
                    </Button>
                    <Button type="button" onClick={() => setStep(3)} className="bg-primary text-primary-foreground">
                      {t('Next', 'পরবর্তী')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Photos & Documents */}
            {step === 3 && (
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>{t('Photos & Documents', 'ছবি এবং ডকুমেন্ট')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>{t('Property Photos', 'সম্পত্তির ছবি')} *</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer">
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">
                        {t('Drag and drop images here, or click to browse', 'এখানে ছবি টেনে আনুন, অথবা ব্রাউজ করতে ক্লিক করুন')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('Maximum 10 images, JPG or PNG, max 5MB each', 'সর্বোচ্চ ১০টি ছবি, JPG বা PNG, প্রতিটি সর্বোচ্চ 5MB')}
                      </p>
                      <Input type="file" className="hidden" accept="image/*" multiple />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('Documents (Optional)', 'ডকুমেন্ট (ঐচ্ছিক)')}</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer">
                      <Plus className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {t('Upload ownership documents, floor plans, etc.', 'মালিকানার কাগজপত্র, ফ্লোর প্ল্যান ইত্যাদি আপলোড করুন')}
                      </p>
                      <Input type="file" className="hidden" accept=".pdf,.doc,.docx" multiple />
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Checkbox id="terms" required />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                      {t(
                        'I confirm that all information provided is accurate and I am the legal owner or authorized agent of this property.',
                        'আমি নিশ্চিত করছি যে প্রদত্ত সমস্ত তথ্য সঠিক এবং আমি এই সম্পত্তির আইনি মালিক বা অনুমোদিত এজেন্ট।'
                      )}
                    </label>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                      {t('Back', 'পূর্ববর্তী')}
                    </Button>
                    <Button type="submit" className="bg-gradient-gold text-primary hover:opacity-90 shadow-gold font-semibold">
                      {t('Submit Property', 'সম্পত্তি জমা দিন')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Sell;
