import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const propertySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().optional(),
  price: z.coerce.number().min(1, 'Price must be greater than 0'),
  location: z.string().min(2, 'Location is required'),
  property_type: z.string().min(1, 'Property type is required'),
  listing_type: z.string().min(1, 'Listing type is required'),
  status: z.string().min(1, 'Status is required'),
  bedrooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  area: z.coerce.number().min(0).optional(),
  featured: z.boolean().optional(),
  is_our_project: z.boolean().optional(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  property_type: string;
  listing_type: string;
  status: string;
  vendor_id: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  description?: string;
  featured?: boolean;
  is_our_project?: boolean;
}

interface AdminPropertyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property | null;
  onSuccess: () => void;
}

export default function AdminPropertyForm({
  open,
  onOpenChange,
  property,
  onSuccess,
}: AdminPropertyFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      location: '',
      property_type: 'apartment',
      listing_type: 'sale',
      status: 'pending',
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      featured: false,
      is_our_project: false,
    },
  });

  useEffect(() => {
    if (property) {
      form.reset({
        title: property.title,
        description: property.description || '',
        price: property.price,
        location: property.location,
        property_type: property.property_type,
        listing_type: property.listing_type,
        status: property.status,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        area: property.area || 0,
        featured: property.featured || false,
        is_our_project: property.is_our_project || false,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        price: 0,
        location: '',
        property_type: 'apartment',
        listing_type: 'sale',
        status: 'approved',
        bedrooms: 0,
        bathrooms: 0,
        area: 0,
        featured: false,
        is_our_project: false,
      });
    }
  }, [property, form]);

  const onSubmit = async (values: PropertyFormValues) => {
    setLoading(true);
    try {
      if (property) {
        // Update existing property
        const { error } = await supabase
          .from('properties')
          .update(values)
          .eq('id', property.id);

        if (error) throw error;
        toast.success('Property updated successfully');
      } else {
        // Create new property
        const { error } = await supabase.from('properties').insert([{
          title: values.title,
          description: values.description || null,
          price: values.price,
          location: values.location,
          property_type: values.property_type,
          listing_type: values.listing_type,
          status: values.status,
          bedrooms: values.bedrooms || null,
          bathrooms: values.bathrooms || null,
          area: values.area || null,
          featured: values.featured || false,
          is_our_project: values.is_our_project || false,
          vendor_id: user?.id as string,
        }]);

        if (error) throw error;
        toast.success('Property created successfully');
      }

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{property ? 'Edit Property' : 'Add New Property'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Property title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Property description" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (BDT)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Dhaka, Gulshan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="property_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="listing_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select listing type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area (sq ft)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-6">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Featured Property</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_our_project"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Our Project</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : property ? 'Update Property' : 'Create Property'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
