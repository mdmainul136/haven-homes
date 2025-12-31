import { X, MapPin, Bed, Bath, Square, Check, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useComparison } from '@/contexts/ComparisonContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComparisonModal = ({ isOpen, onClose }: ComparisonModalProps) => {
  const { comparisonList, removeFromComparison } = useComparison();
  const { t } = useLanguage();

  const allAmenities = [...new Set(comparisonList.flatMap(p => p.amenities || []))];

  const ComparisonRow = ({ label, labelBn, children }: { label: string; labelBn: string; children: React.ReactNode }) => (
    <tr className="border-b border-border">
      <td className="py-3 px-4 font-medium text-foreground bg-muted/50 w-40">
        {t(label, labelBn)}
      </td>
      {children}
    </tr>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {t('Property Comparison', 'প্রপার্টি তুলনা')}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left bg-muted/50"></th>
                {comparisonList.map((property) => (
                  <th key={property.id} className="py-3 px-4 min-w-[200px]">
                    <div className="relative">
                      <button
                        onClick={() => removeFromComparison(property.id)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <Link
                        to={`/property/${property.id}`}
                        className="font-semibold text-foreground hover:text-accent transition-colors block"
                        onClick={onClose}
                      >
                        {t(property.title, property.titleBn)}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <ComparisonRow label="Price" labelBn="মূল্য">
                {comparisonList.map((property) => (
                  <td key={property.id} className="py-3 px-4 text-center">
                    <span className="text-lg font-bold text-accent">
                      {t(property.price, property.priceBn)}
                    </span>
                  </td>
                ))}
              </ComparisonRow>

              <ComparisonRow label="Location" labelBn="অবস্থান">
                {comparisonList.map((property) => (
                  <td key={property.id} className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{t(property.location, property.locationBn)}</span>
                    </div>
                  </td>
                ))}
              </ComparisonRow>

              <ComparisonRow label="Area" labelBn="আয়তন">
                {comparisonList.map((property) => (
                  <td key={property.id} className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Square className="h-4 w-4" />
                      <span>{property.area}</span>
                    </div>
                  </td>
                ))}
              </ComparisonRow>

              <ComparisonRow label="Bedrooms" labelBn="শয়নকক্ষ">
                {comparisonList.map((property) => (
                  <td key={property.id} className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Bed className="h-4 w-4" />
                      <span>{property.bedrooms || '-'}</span>
                    </div>
                  </td>
                ))}
              </ComparisonRow>

              <ComparisonRow label="Bathrooms" labelBn="বাথরুম">
                {comparisonList.map((property) => (
                  <td key={property.id} className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Bath className="h-4 w-4" />
                      <span>{property.bathrooms || '-'}</span>
                    </div>
                  </td>
                ))}
              </ComparisonRow>

              <ComparisonRow label="Status" labelBn="অবস্থা">
                {comparisonList.map((property) => (
                  <td key={property.id} className="py-3 px-4 text-center">
                    <span className="capitalize text-muted-foreground">
                      {property.status?.replace('-', ' ') || '-'}
                    </span>
                  </td>
                ))}
              </ComparisonRow>

              <ComparisonRow label="Type" labelBn="ধরণ">
                {comparisonList.map((property) => (
                  <td key={property.id} className="py-3 px-4 text-center">
                    <span className="capitalize text-muted-foreground">
                      {property.type === 'sale' ? t('For Sale', 'বিক্রয়ের জন্য') : 
                       property.type === 'rent' ? t('For Rent', 'ভাড়ার জন্য') : 
                       t('Project', 'প্রকল্প')}
                    </span>
                  </td>
                ))}
              </ComparisonRow>

              {/* Amenities Section */}
              <tr className="border-b border-border bg-muted/30">
                <td colSpan={comparisonList.length + 1} className="py-3 px-4">
                  <span className="font-semibold text-foreground">
                    {t('Amenities', 'সুবিধাসমূহ')}
                  </span>
                </td>
              </tr>

              {allAmenities.map((amenity) => (
                <tr key={amenity} className="border-b border-border">
                  <td className="py-2 px-4 text-sm text-muted-foreground bg-muted/50">
                    {amenity}
                  </td>
                  {comparisonList.map((property) => (
                    <td key={property.id} className="py-2 px-4 text-center">
                      {property.amenities?.includes(amenity) ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <Minus className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button onClick={onClose}>
            {t('Close', 'বন্ধ করুন')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComparisonModal;
