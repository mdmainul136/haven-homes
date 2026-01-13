import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Check, X, MoreHorizontal, Star, Building2, Home, Key } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import AdminPropertyForm from './AdminPropertyForm';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  property_type: string;
  listing_type: string;
  status: string;
  views: number;
  created_at: string;
  vendor_id: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
  description?: string;
  amenities?: string[];
  featured?: boolean;
  is_our_project?: boolean;
}

type CategoryFilter = 'all' | 'our_projects' | 'sale' | 'rent' | 'featured';

export default function AdminPropertyManagement() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; property: Property | null }>({
    open: false,
    property: null,
  });
  const [formDialog, setFormDialog] = useState<{ open: boolean; property: Property | null }>({
    open: false,
    property: null,
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (propertyId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', propertyId);

      if (error) throw error;

      setProperties(prev =>
        prev.map(p => (p.id === propertyId ? { ...p, status: newStatus } : p))
      );
      toast.success(`Property ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.property) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', deleteDialog.property.id);

      if (error) throw error;

      setProperties(prev => prev.filter(p => p.id !== deleteDialog.property!.id));
      toast.success('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    } finally {
      setDeleteDialog({ open: false, property: null });
    }
  };

  const handleToggleFeatured = async (propertyId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ featured: !currentValue })
        .eq('id', propertyId);

      if (error) throw error;

      setProperties(prev =>
        prev.map(p => (p.id === propertyId ? { ...p, featured: !currentValue } : p))
      );
      toast.success(`Property ${!currentValue ? 'marked as featured' : 'removed from featured'}`);
    } catch (error) {
      console.error('Error updating featured:', error);
      toast.error('Failed to update featured status');
    }
  };

  const handleToggleOurProject = async (propertyId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ is_our_project: !currentValue })
        .eq('id', propertyId);

      if (error) throw error;

      setProperties(prev =>
        prev.map(p => (p.id === propertyId ? { ...p, is_our_project: !currentValue } : p))
      );
      toast.success(`Property ${!currentValue ? 'marked as Our Project' : 'removed from Our Projects'}`);
    } catch (error) {
      console.error('Error updating our project:', error);
      toast.error('Failed to update');
    }
  };

  const handleChangeListingType = async (propertyId: string, newType: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ listing_type: newType })
        .eq('id', propertyId);

      if (error) throw error;

      setProperties(prev =>
        prev.map(p => (p.id === propertyId ? { ...p, listing_type: newType } : p))
      );
      toast.success(`Property changed to ${newType === 'sale' ? 'For Sale' : 'For Rent'}`);
    } catch (error) {
      console.error('Error updating listing type:', error);
      toast.error('Failed to update listing type');
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    
    let matchesCategory = true;
    switch (categoryFilter) {
      case 'our_projects':
        matchesCategory = property.is_our_project === true;
        break;
      case 'sale':
        matchesCategory = property.listing_type === 'sale';
        break;
      case 'rent':
        matchesCategory = property.listing_type === 'rent';
        break;
      case 'featured':
        matchesCategory = property.featured === true;
        break;
    }
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success/10 text-success border-0">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-warning/10 text-warning border-0">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive/10 text-destructive border-0">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted"></div>
          <div className="h-96 rounded-lg bg-muted"></div>
        </div>
      </div>
    );
  }

  const getCategoryCount = (category: CategoryFilter) => {
    switch (category) {
      case 'our_projects':
        return properties.filter(p => p.is_our_project).length;
      case 'sale':
        return properties.filter(p => p.listing_type === 'sale').length;
      case 'rent':
        return properties.filter(p => p.listing_type === 'rent').length;
      case 'featured':
        return properties.filter(p => p.featured).length;
      default:
        return properties.length;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Property Management</h1>
          <p className="mt-1 text-muted-foreground">
            Manage all property listings on the platform
          </p>
        </div>
        <Button onClick={() => setFormDialog({ open: true, property: null })} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Property
        </Button>
      </div>

      {/* Category Tabs */}
      <Tabs value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CategoryFilter)} className="mb-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="gap-2">
            All
            <Badge variant="secondary" className="ml-1">{getCategoryCount('all')}</Badge>
          </TabsTrigger>
          <TabsTrigger value="our_projects" className="gap-2">
            <Building2 className="h-4 w-4" />
            Our Projects
            <Badge variant="secondary" className="ml-1">{getCategoryCount('our_projects')}</Badge>
          </TabsTrigger>
          <TabsTrigger value="sale" className="gap-2">
            <Home className="h-4 w-4" />
            For Sale
            <Badge variant="secondary" className="ml-1">{getCategoryCount('sale')}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rent" className="gap-2">
            <Key className="h-4 w-4" />
            For Rent
            <Badge variant="secondary" className="ml-1">{getCategoryCount('rent')}</Badge>
          </TabsTrigger>
          <TabsTrigger value="featured" className="gap-2">
            <Star className="h-4 w-4" />
            Featured
            <Badge variant="secondary" className="ml-1">{getCategoryCount('featured')}</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="border-border">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Property</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No properties found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProperties.map((property) => (
                  <TableRow key={property.id} className="border-border">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="max-w-[180px] truncate">{property.title}</div>
                        {property.featured && (
                          <Star className="h-4 w-4 fill-warning text-warning" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{property.location}</TableCell>
                    <TableCell>{formatPrice(property.price)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="capitalize">
                          {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                        </Badge>
                        {property.is_our_project && (
                          <Badge className="bg-primary/10 text-primary border-0">
                            Our Project
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(property.status)}</TableCell>
                    <TableCell className="text-center">{property.views || 0}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => setFormDialog({ open: true, property })}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          {/* Status Actions */}
                          {property.status === 'pending' && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(property.id, 'approved')}
                              >
                                <Check className="mr-2 h-4 w-4 text-success" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(property.id, 'rejected')}
                              >
                                <X className="mr-2 h-4 w-4 text-destructive" />
                                Reject
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          
                          {/* Category Actions */}
                          <DropdownMenuItem
                            onClick={() => handleToggleFeatured(property.id, property.featured || false)}
                          >
                            <Star className={`mr-2 h-4 w-4 ${property.featured ? 'fill-warning text-warning' : ''}`} />
                            {property.featured ? 'Remove Featured' : 'Mark Featured'}
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => handleToggleOurProject(property.id, property.is_our_project || false)}
                          >
                            <Building2 className={`mr-2 h-4 w-4 ${property.is_our_project ? 'text-primary' : ''}`} />
                            {property.is_our_project ? 'Remove from Our Projects' : 'Add to Our Projects'}
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          {/* Listing Type Actions */}
                          <DropdownMenuItem
                            onClick={() => handleChangeListingType(property.id, property.listing_type === 'sale' ? 'rent' : 'sale')}
                          >
                            {property.listing_type === 'sale' ? (
                              <>
                                <Key className="mr-2 h-4 w-4" />
                                Change to For Rent
                              </>
                            ) : (
                              <>
                                <Home className="mr-2 h-4 w-4" />
                                Change to For Sale
                              </>
                            )}
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteDialog({ open: true, property })}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, property: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.property?.title}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Property Form Dialog */}
      <AdminPropertyForm
        open={formDialog.open}
        onOpenChange={(open) => setFormDialog({ open, property: null })}
        property={formDialog.property}
        onSuccess={fetchProperties}
      />
    </div>
  );
}
