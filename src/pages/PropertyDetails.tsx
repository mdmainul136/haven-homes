import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  MapPin, Bed, Bath, Square, Heart, Share2, ArrowLeft, 
  Check, Phone, Mail, Calendar, ChevronLeft, ChevronRight,
  Building2, Car, Shield, Waves, Trees, Dumbbell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { properties } from '@/data/properties';
import Layout from '@/components/layout/Layout';
import MortgageCalculator from '@/components/MortgageCalculator';
import { toast } from 'sonner';

const amenityIcons: Record<string, React.ElementType> = {
  'Swimming Pool': Waves,
  'Garden': Trees,
  'Gym': Dumbbell,
  'Parking': Car,
  'Security': Shield,
  'Elevator': Building2,
  'Generator': Building2,
  'Rooftop Access': Building2,
  'Smart Home': Building2,
  'Community Hall': Building2,
  'Playground': Trees,
  'Furnished': Building2,
  '24/7 Security': Shield,
};

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const property = properties.find((p) => p.id === id);

  if (!property) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {t('Property Not Found', 'প্রপার্টি পাওয়া যায়নি')}
          </h1>
          <Link to="/buy">
            <Button>{t('Browse Properties', 'প্রপার্টি দেখুন')}</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Create gallery images array (using the same image for demo)
  const galleryImages = [property.image, property.image, property.image, property.image];

  const typeLabels = {
    sale: t('For Sale', 'বিক্রয়ের জন্য'),
    rent: t('For Rent', 'ভাড়ার জন্য'),
    project: t('Project', 'প্রকল্প'),
  };

  const statusLabels = {
    ready: t('Ready', 'রেডি'),
    'under-construction': t('Under Construction', 'নির্মাণাধীন'),
    upcoming: t('Upcoming', 'আসছে'),
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('Message sent successfully!', 'বার্তা সফলভাবে পাঠানো হয়েছে!'));
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <Layout>
      <div className="bg-background">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/buy" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('Back to Properties', 'প্রপার্টিতে ফিরে যান')}
          </Link>
        </div>

        {/* Image Gallery */}
        <section className="container mx-auto px-4 pb-8">
          <div className="relative rounded-xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
            <img
              src={galleryImages[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />

            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm hover:bg-card"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm hover:bg-card"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-accent w-6' : 'bg-card/60'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-card/80 backdrop-blur-sm hover:bg-card"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-card/80 backdrop-blur-sm hover:bg-card"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <Badge className="bg-accent text-accent-foreground font-semibold">
                {typeLabels[property.type]}
              </Badge>
              {property.status && (
                <Badge variant="secondary" className="bg-card text-card-foreground">
                  {statusLabels[property.status]}
                </Badge>
              )}
              {property.featured && (
                <Badge className="bg-primary text-primary-foreground">
                  {t('Featured', 'বিশেষ')}
                </Badge>
              )}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {galleryImages.map((img, index) => (
              <button
                key={index}
                className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex ? 'border-accent' : 'border-transparent'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img src={img} alt="" className="w-20 h-14 md:w-24 md:h-16 object-cover" />
              </button>
            ))}
          </div>
        </section>

        {/* Property Details */}
        <section className="container mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Price */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  {t(property.title, property.titleBn)}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">{t(property.location, property.locationBn)}</span>
                </div>
                <p className="text-3xl font-bold text-accent">
                  {t(property.price, property.priceBn)}
                </p>
              </div>

              {/* Quick Stats */}
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {property.bedrooms && (
                      <div className="text-center">
                        <Bed className="h-8 w-8 mx-auto text-accent mb-2" />
                        <p className="text-2xl font-bold text-foreground">{property.bedrooms}</p>
                        <p className="text-sm text-muted-foreground">{t('Bedrooms', 'বেডরুম')}</p>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="text-center">
                        <Bath className="h-8 w-8 mx-auto text-accent mb-2" />
                        <p className="text-2xl font-bold text-foreground">{property.bathrooms}</p>
                        <p className="text-sm text-muted-foreground">{t('Bathrooms', 'বাথরুম')}</p>
                      </div>
                    )}
                    <div className="text-center">
                      <Square className="h-8 w-8 mx-auto text-accent mb-2" />
                      <p className="text-2xl font-bold text-foreground">{property.area}</p>
                      <p className="text-sm text-muted-foreground">{t('Area', 'এলাকা')}</p>
                    </div>
                    <div className="text-center">
                      <Building2 className="h-8 w-8 mx-auto text-accent mb-2" />
                      <p className="text-2xl font-bold text-foreground capitalize">
                        {property.status ? statusLabels[property.status] : '-'}
                      </p>
                      <p className="text-sm text-muted-foreground">{t('Status', 'অবস্থা')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>{t('Description', 'বিবরণ')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description || t(
                      'This stunning property offers modern living spaces with premium finishes throughout. Located in a prime area with excellent connectivity and access to amenities. The property features spacious rooms, ample natural light, and high-quality construction. Perfect for families looking for a comfortable and luxurious lifestyle.',
                      'এই অসাধারণ প্রপার্টিটি সর্বত্র প্রিমিয়াম ফিনিশ সহ আধুনিক বাসস্থান প্রদান করে। চমৎকার সংযোগ এবং সুযোগ-সুবিধাগুলিতে প্রবেশের সাথে একটি প্রাইম এলাকায় অবস্থিত। প্রপার্টিতে প্রশস্ত কক্ষ, পর্যাপ্ত প্রাকৃতিক আলো এবং উচ্চমানের নির্মাণ রয়েছে। আরামদায়ক এবং বিলাসবহুল জীবনধারা খুঁজছেন এমন পরিবারদের জন্য উপযুক্ত।'
                    )}
                  </p>
                </CardContent>
              </Card>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <Card className="border-0 shadow-card">
                  <CardHeader>
                    <CardTitle>{t('Amenities & Features', 'সুবিধা ও বৈশিষ্ট্য')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.amenities.map((amenity) => {
                        const IconComponent = amenityIcons[amenity] || Check;
                        return (
                          <div 
                            key={amenity}
                            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                          >
                            <div className="p-2 rounded-full bg-accent/10">
                              <IconComponent className="h-5 w-5 text-accent" />
                            </div>
                            <span className="text-foreground font-medium">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Location Map */}
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>{t('Location', 'অবস্থান')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg overflow-hidden aspect-video bg-secondary relative">
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(property.location)}&zoom=14`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Property Location"
                      className="absolute inset-0"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                    <MapPin className="h-5 w-5 text-accent" />
                    <span>{t(property.location, property.locationBn)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Mortgage Calculator */}
              <MortgageCalculator defaultPrice={10000000} />

              {/* Contact Form */}
              <div className="sticky top-24">
                <Card className="border-0 shadow-elevated">
                  <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
                    <CardTitle className="text-center">
                      {t('Contact Agent', 'এজেন্টের সাথে যোগাযোগ করুন')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">{t('Full Name', 'পুরো নাম')}</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={t('Enter your name', 'আপনার নাম লিখুন')}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">{t('Email', 'ইমেইল')}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder={t('Enter your email', 'আপনার ইমেইল লিখুন')}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">{t('Phone', 'ফোন')}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder={t('Enter your phone number', 'আপনার ফোন নম্বর লিখুন')}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">{t('Message', 'বার্তা')}</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder={t(
                            `I'm interested in this property...`,
                            'আমি এই প্রপার্টিতে আগ্রহী...'
                          )}
                          rows={4}
                        />
                      </div>
                      <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        {t('Send Message', 'বার্তা পাঠান')}
                      </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border space-y-3">
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <Phone className="h-5 w-5 text-accent" />
                        {t('Call: +880 1XXX-XXXXXX', 'কল করুন: +৮৮০ ১XXX-XXXXXX')}
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <Mail className="h-5 w-5 text-accent" />
                        {t('Email Agent', 'এজেন্টকে ইমেইল করুন')}
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <Calendar className="h-5 w-5 text-accent" />
                        {t('Schedule Visit', 'ভিজিট সময়সূচি করুন')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default PropertyDetails;
