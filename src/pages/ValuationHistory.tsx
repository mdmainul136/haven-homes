import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { History, MapPin, Ruler, Calendar, TrendingUp, Calculator, Trash2, Bell, BellOff, Percent } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface Valuation {
  id: string;
  property_type: string;
  location: string;
  area: number;
  bedrooms: string | null;
  bathrooms: string | null;
  age: number | null;
  condition: string;
  amenities: string[];
  estimated_value: number;
  low_estimate: number;
  high_estimate: number;
  price_per_sqft: number;
  created_at: string;
}

interface Subscription {
  id: string;
  location: string;
  email: string;
  threshold_percentage: number;
  created_at: string;
  last_notified_at: string | null;
}

const ValuationHistory = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteSubscriptionId, setDeleteSubscriptionId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchValuations();
      fetchSubscriptions();
    }
  }, [isAuthenticated, user]);

  const fetchValuations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('valuations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setValuations(data || []);
    } catch (error) {
      console.error('Error fetching valuations:', error);
      toast({
        title: t('Error', 'ত্রুটি'),
        description: t('Failed to load valuation history', 'মূল্যায়ন ইতিহাস লোড করতে ব্যর্থ'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    if (!user) return;
    
    setIsLoadingSubscriptions(true);
    try {
      const { data, error } = await supabase
        .from('valuation_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data as Subscription[] || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setIsLoadingSubscriptions(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('valuations')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;
      
      setValuations(prev => prev.filter(v => v.id !== deleteId));
      toast({
        title: t('Deleted', 'মুছে ফেলা হয়েছে'),
        description: t('Valuation has been removed', 'মূল্যায়ন সরানো হয়েছে'),
      });
    } catch (error) {
      console.error('Error deleting valuation:', error);
      toast({
        title: t('Error', 'ত্রুটি'),
        description: t('Failed to delete valuation', 'মূল্যায়ন মুছতে ব্যর্থ'),
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleDeleteSubscription = async () => {
    if (!deleteSubscriptionId) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('valuation_subscriptions')
        .delete()
        .eq('id', deleteSubscriptionId);

      if (error) throw error;
      
      setSubscriptions(prev => prev.filter(s => s.id !== deleteSubscriptionId));
      toast({
        title: t('Unsubscribed', 'আনসাবস্ক্রাইব করা হয়েছে'),
        description: t('You will no longer receive alerts for this location', 'আপনি এই অবস্থানের জন্য আর সতর্কতা পাবেন না'),
      });
    } catch (error) {
      console.error('Error deleting subscription:', error);
      toast({
        title: t('Error', 'ত্রুটি'),
        description: t('Failed to unsubscribe', 'আনসাবস্ক্রাইব করতে ব্যর্থ'),
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteSubscriptionId(null);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `৳${(price / 10000000).toFixed(2)} ${t('Crore', 'কোটি')}`;
    } else if (price >= 100000) {
      return `৳${(price / 100000).toFixed(2)} ${t('Lakh', 'লাখ')}`;
    }
    return `৳${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background py-12">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4">
              <History className="h-4 w-4" />
              <span className="text-sm font-medium">{t('Your Valuations', 'আপনার মূল্যায়ন')}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {t('Valuation History & Alerts', 'মূল্যায়ন ইতিহাস ও সতর্কতা')}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t(
                'View your saved valuations and manage your price alert subscriptions.',
                'আপনার সংরক্ষিত মূল্যায়ন দেখুন এবং মূল্য সতর্কতা সাবস্ক্রিপশন পরিচালনা করুন।'
              )}
            </p>
          </div>

          <Tabs defaultValue="valuations" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="valuations" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                {t('Valuations', 'মূল্যায়ন')} ({valuations.length})
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                {t('Price Alerts', 'মূল্য সতর্কতা')} ({subscriptions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="valuations">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : valuations.length === 0 ? (
                <Card className="shadow-card">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Calculator className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {t('No Valuations Yet', 'এখনো কোনো মূল্যায়ন নেই')}
                    </h3>
                    <p className="text-muted-foreground text-center mb-6 max-w-md">
                      {t(
                        'You haven\'t saved any property valuations yet. Start by getting a free valuation for your property.',
                        'আপনি এখনো কোনো সম্পত্তি মূল্যায়ন সংরক্ষণ করেননি। আপনার সম্পত্তির জন্য একটি বিনামূল্যে মূল্যায়ন নিয়ে শুরু করুন।'
                      )}
                    </p>
                    <Button 
                      onClick={() => navigate('/valuation')}
                      className="bg-gradient-gold text-primary hover:opacity-90"
                    >
                      {t('Get Property Valuation', 'সম্পত্তি মূল্যায়ন পান')}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {valuations.map((valuation) => (
                    <Card key={valuation.id} className="shadow-card hover:shadow-elevated transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="capitalize">
                                {valuation.property_type}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {valuation.condition}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2 text-foreground mb-1">
                              <MapPin className="h-4 w-4 text-accent" />
                              <span className="font-medium">{valuation.location}</span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Ruler className="h-3.5 w-3.5" />
                                <span>{valuation.area} sq ft</span>
                              </div>
                              {valuation.bedrooms && (
                                <span>{valuation.bedrooms} {t('Beds', 'বেড')}</span>
                              )}
                              {valuation.bathrooms && (
                                <span>{valuation.bathrooms} {t('Baths', 'বাথ')}</span>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{formatDate(valuation.created_at)}</span>
                              </div>
                            </div>

                            {valuation.amenities && valuation.amenities.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {valuation.amenities.slice(0, 4).map((amenity) => (
                                  <Badge key={amenity} variant="outline" className="text-xs capitalize">
                                    {amenity}
                                  </Badge>
                                ))}
                                {valuation.amenities.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{valuation.amenities.length - 4}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                {formatPrice(valuation.estimated_value)}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                                <TrendingUp className="h-3 w-3" />
                                ৳{valuation.price_per_sqft.toLocaleString()}/sq ft
                              </div>
                            </div>
                            
                            <div className="text-xs text-muted-foreground text-right">
                              <div>{t('Range', 'পরিসীমা')}: {formatPrice(valuation.low_estimate)} - {formatPrice(valuation.high_estimate)}</div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteId(valuation.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <div className="flex justify-center pt-6">
                    <Button 
                      onClick={() => navigate('/valuation')}
                      className="bg-gradient-gold text-primary hover:opacity-90"
                    >
                      {t('Get New Valuation', 'নতুন মূল্যায়ন পান')}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="alerts">
              {isLoadingSubscriptions ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : subscriptions.length === 0 ? (
                <Card className="shadow-card">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <BellOff className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {t('No Price Alerts', 'কোনো মূল্য সতর্কতা নেই')}
                    </h3>
                    <p className="text-muted-foreground text-center mb-6 max-w-md">
                      {t(
                        'You haven\'t set up any price alerts yet. Subscribe to alerts on the valuation page to get notified when property values change significantly.',
                        'আপনি এখনো কোনো মূল্য সতর্কতা সেট করেননি। সম্পত্তির মান উল্লেখযোগ্যভাবে পরিবর্তন হলে বিজ্ঞপ্তি পেতে মূল্যায়ন পৃষ্ঠায় সতর্কতায় সাবস্ক্রাইব করুন।'
                      )}
                    </p>
                    <Button 
                      onClick={() => navigate('/valuation')}
                      className="bg-gradient-gold text-primary hover:opacity-90"
                    >
                      {t('Set Up Price Alerts', 'মূল্য সতর্কতা সেট করুন')}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((subscription) => (
                    <Card key={subscription.id} className="shadow-card hover:shadow-elevated transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Bell className="h-5 w-5 text-accent" />
                              <span className="font-semibold text-lg text-foreground">{subscription.location}</span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Percent className="h-3.5 w-3.5" />
                                <span>{t('Alert when price changes by', 'মূল্য পরিবর্তন হলে সতর্কতা')} {subscription.threshold_percentage}%+</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{t('Subscribed', 'সাবস্ক্রাইব করা হয়েছে')}: {formatDate(subscription.created_at)}</span>
                              </div>
                            </div>

                            <div className="mt-2 text-sm text-muted-foreground">
                              {t('Email', 'ইমেইল')}: {subscription.email}
                            </div>

                            {subscription.last_notified_at && (
                              <div className="mt-1 text-xs text-muted-foreground">
                                {t('Last alert sent', 'শেষ সতর্কতা পাঠানো হয়েছে')}: {formatDate(subscription.last_notified_at)}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteSubscriptionId(subscription.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t('Unsubscribe', 'আনসাবস্ক্রাইব')}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <div className="flex justify-center pt-6">
                    <Button 
                      onClick={() => navigate('/valuation')}
                      className="bg-gradient-gold text-primary hover:opacity-90"
                    >
                      {t('Add More Alerts', 'আরো সতর্কতা যোগ করুন')}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete Valuation Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Delete Valuation', 'মূল্যায়ন মুছুন')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                'Are you sure you want to delete this valuation? This action cannot be undone.',
                'আপনি কি নিশ্চিত যে আপনি এই মূল্যায়ন মুছে ফেলতে চান? এই ক্রিয়া পূর্বাবস্থায় ফেরানো যাবে না।'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t('Cancel', 'বাতিল')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t('Deleting...', 'মুছে ফেলা হচ্ছে...') : t('Delete', 'মুছুন')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Subscription Confirmation Dialog */}
      <AlertDialog open={!!deleteSubscriptionId} onOpenChange={() => setDeleteSubscriptionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Unsubscribe from Alerts', 'সতর্কতা থেকে আনসাবস্ক্রাইব করুন')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                'Are you sure you want to unsubscribe from price alerts for this location? You will no longer receive notifications.',
                'আপনি কি নিশ্চিত যে আপনি এই অবস্থানের মূল্য সতর্কতা থেকে আনসাবস্ক্রাইব করতে চান? আপনি আর বিজ্ঞপ্তি পাবেন না।'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t('Cancel', 'বাতিল')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSubscription}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t('Unsubscribing...', 'আনসাবস্ক্রাইব করা হচ্ছে...') : t('Unsubscribe', 'আনসাবস্ক্রাইব')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default ValuationHistory;
