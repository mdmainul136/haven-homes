import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart, GitCompare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useComparison } from '@/contexts/ComparisonContext';
import { properties } from '@/data/properties';
import { toast } from 'sonner';

interface PropertyCardProps {
  id: string;
  image: string;
  title: string;
  titleBn?: string;
  location: string;
  locationBn?: string;
  price: string;
  priceBn?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  type: 'sale' | 'rent' | 'project';
  status?: 'ready' | 'under-construction' | 'upcoming';
  featured?: boolean;
}

const PropertyCard = ({
  id,
  image,
  title,
  titleBn,
  location,
  locationBn,
  price,
  priceBn,
  bedrooms,
  bathrooms,
  area,
  type,
  status,
  featured,
}: PropertyCardProps) => {
  const { t } = useLanguage();
  const { addToComparison, removeFromComparison, isInComparison, comparisonList, maxItems } = useComparison();

  const inComparison = isInComparison(id);

  const handleCompareClick = () => {
    if (inComparison) {
      removeFromComparison(id);
      toast.success(t('Removed from comparison', 'তুলনা থেকে সরানো হয়েছে'));
    } else {
      if (comparisonList.length >= maxItems) {
        toast.error(t(`Maximum ${maxItems} properties can be compared`, `সর্বোচ্চ ${maxItems}টি প্রপার্টি তুলনা করা যাবে`));
        return;
      }
      const property = properties.find(p => p.id === id);
      if (property) {
        addToComparison(property);
        toast.success(t('Added to comparison', 'তুলনায় যোগ করা হয়েছে'));
      }
    }
  };

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

  return (
    <Card className="group overflow-hidden border-0 shadow-card hover:shadow-elevated transition-all duration-300">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <Badge className="bg-accent text-accent-foreground font-semibold">
            {typeLabels[type]}
          </Badge>
          {status && (
            <Badge variant="secondary" className="bg-card text-card-foreground">
              {statusLabels[status]}
            </Badge>
          )}
          {featured && (
            <Badge className="bg-primary text-primary-foreground">
              {t('Featured', 'বিশেষ')}
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-card/80 backdrop-blur-sm hover:bg-card text-muted-foreground hover:text-destructive"
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCompareClick}
            className={`bg-card/80 backdrop-blur-sm hover:bg-card transition-colors ${
              inComparison 
                ? 'text-accent bg-accent/20' 
                : 'text-muted-foreground hover:text-accent'
            }`}
          >
            <GitCompare className="h-5 w-5" />
          </Button>
        </div>

        {/* Price */}
        <div className="absolute bottom-4 left-4">
          <p className="text-2xl font-bold text-primary-foreground drop-shadow-lg">
            {t(price, priceBn || price)}
          </p>
        </div>
      </div>

      <CardContent className="p-5">
        <Link to={`/property/${id}`}>
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-accent transition-colors">
            {t(title, titleBn || title)}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-muted-foreground mb-4">
          <MapPin className="h-4 w-4" />
          <span className="text-sm line-clamp-1">{t(location, locationBn || location)}</span>
        </div>

        {(bedrooms || bathrooms || area) && (
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            {bedrooms && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Bed className="h-4 w-4" />
                <span className="text-sm">{bedrooms}</span>
              </div>
            )}
            {bathrooms && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Bath className="h-4 w-4" />
                <span className="text-sm">{bathrooms}</span>
              </div>
            )}
            {area && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Square className="h-4 w-4" />
                <span className="text-sm">{area}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
