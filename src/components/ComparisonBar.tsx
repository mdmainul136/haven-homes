import { X, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useComparison } from '@/contexts/ComparisonContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import ComparisonModal from './ComparisonModal';

const ComparisonBar = () => {
  const { comparisonList, removeFromComparison, clearComparison, maxItems } = useComparison();
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (comparisonList.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated z-50 p-4">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-accent" />
            <span className="font-medium text-foreground">
              {t('Compare Properties', 'প্রপার্টি তুলনা করুন')} ({comparisonList.length}/{maxItems})
            </span>
          </div>

          <div className="flex items-center gap-3 flex-1 overflow-x-auto">
            {comparisonList.map((property) => (
              <div
                key={property.id}
                className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 min-w-fit"
              >
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-10 h-10 rounded object-cover"
                />
                <span className="text-sm font-medium text-foreground whitespace-nowrap">
                  {property.title.length > 20 ? property.title.substring(0, 20) + '...' : property.title}
                </span>
                <button
                  onClick={() => removeFromComparison(property.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearComparison}
            >
              {t('Clear', 'মুছুন')}
            </Button>
            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              disabled={comparisonList.length < 2}
            >
              {t('Compare Now', 'এখন তুলনা করুন')}
            </Button>
          </div>
        </div>
      </div>

      <ComparisonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ComparisonBar;
