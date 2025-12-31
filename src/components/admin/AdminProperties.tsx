import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/mongodb-api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Eye, MapPin, Home, Clock } from 'lucide-react';
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

interface Property {
  _id: string;
  title: string;
  price: number;
  location: string;
  type: string;
  status: string;
  images?: string[];
  createdAt: string;
  vendorId: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

const AdminProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: 'approve' | 'reject';
    propertyId: string;
    propertyTitle: string;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingProperties();
  }, []);

  const fetchPendingProperties = async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getPendingProperties();
      if (response.success && response.data) {
        setProperties(response.data as Property[]);
      }
    } catch (error) {
      console.error('Error fetching pending properties:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pending properties',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async () => {
    if (!actionDialog) return;

    const { type, propertyId } = actionDialog;
    
    try {
      const response = type === 'approve' 
        ? await adminApi.approveProperty(propertyId)
        : await adminApi.rejectProperty(propertyId);

      if (response.success) {
        toast({
          title: type === 'approve' ? 'Property Approved' : 'Property Rejected',
          description: `The property has been ${type === 'approve' ? 'approved and is now live' : 'rejected'}.`,
        });
        fetchPendingProperties();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error(`Error ${type}ing property:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${type} property`,
        variant: 'destructive',
      });
    } finally {
      setActionDialog(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Check className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Pending Properties</h3>
          <p className="text-muted-foreground text-center">
            All property submissions have been reviewed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Pending Approvals ({properties.length})</h2>
        <Button variant="outline" onClick={fetchPendingProperties}>
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {properties.map((property) => (
          <Card key={property._id}>
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Property Image */}
                <div className="w-full md:w-48 h-48 md:h-auto relative">
                  <img
                    src={property.images?.[0] || '/placeholder.svg'}
                    alt={property.title}
                    className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                  />
                  <Badge className="absolute top-2 left-2 bg-amber-500">
                    Pending Review
                  </Badge>
                </div>

                {/* Property Details */}
                <div className="flex-1 p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {property.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {property.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Home className="h-4 w-4" />
                          {property.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(property.createdAt)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {property.bedrooms && (
                          <Badge variant="secondary">{property.bedrooms} Beds</Badge>
                        )}
                        {property.bathrooms && (
                          <Badge variant="secondary">{property.bathrooms} Baths</Badge>
                        )}
                        {property.area && (
                          <Badge variant="secondary">{property.area} sqft</Badge>
                        )}
                      </div>

                      <p className="text-xl font-bold text-primary">
                        {formatPrice(property.price)}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-2"
                        onClick={() => setActionDialog({
                          open: true,
                          type: 'approve',
                          propertyId: property._id,
                          propertyTitle: property.title,
                        })}
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                        onClick={() => setActionDialog({
                          open: true,
                          type: 'reject',
                          propertyId: property._id,
                          propertyTitle: property.title,
                        })}
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog?.type === 'approve' ? 'Approve Property?' : 'Reject Property?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog?.type === 'approve'
                ? `This will approve "${actionDialog?.propertyTitle}" and make it visible on the platform.`
                : `This will reject "${actionDialog?.propertyTitle}". The vendor will be notified.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={actionDialog?.type === 'reject' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {actionDialog?.type === 'approve' ? 'Approve' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProperties;
