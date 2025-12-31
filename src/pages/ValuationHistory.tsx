import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { History, MapPin, Ruler, Calendar, TrendingUp, Calculator, Trash2 } from 'lucide-react';
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

const ValuationHistory = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchValuations();
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
              {t('Valuation History', 'মূল্যায়ন ইতিহাস')}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t(
                'View and manage all your saved property valuations.',
                'আপনার সব সংরক্ষিত সম্পত্তি মূল্যায়ন দেখুন এবং পরিচালনা করুন।'
              )}
            </p>
          </div>

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
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
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
    </Layout>
  );
};

export default ValuationHistory;
