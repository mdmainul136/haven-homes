import { useState, useEffect } from 'react';
import { inquiriesApi } from '@/lib/mongodb-api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquare, Mail, Phone, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Inquiry {
  _id: string;
  propertyId: string;
  propertyTitle?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  createdAt: string;
}

interface VendorInquiriesProps {
  vendorId: string;
}

export default function VendorInquiries({ vendorId }: VendorInquiriesProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    setIsLoading(true);
    const response = await inquiriesApi.getVendorInquiries(vendorId);
    if (response.success && response.data) {
      setInquiries(response.data as Inquiry[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, [vendorId]);

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    setUpdatingId(inquiryId);
    const response = await inquiriesApi.updateStatus(inquiryId, newStatus);
    setUpdatingId(null);

    if (response.success) {
      setInquiries(inquiries.map(inq => 
        inq._id === inquiryId ? { ...inq, status: newStatus } : inq
      ));
      toast.success('Status updated');
    } else {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20"><Clock className="h-3 w-3 mr-1" />New</Badge>;
      case 'contacted':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"><MessageSquare className="h-3 w-3 mr-1" />Contacted</Badge>;
      case 'closed':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="h-3 w-3 mr-1" />Closed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Property Inquiries</h2>
        <Badge variant="secondary">{inquiries.length} Total</Badge>
      </div>

      {inquiries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No inquiries yet</h3>
            <p className="text-muted-foreground">
              When buyers inquire about your properties, they'll appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <Card key={inquiry._id}>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold">{inquiry.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {inquiry.propertyTitle || `Property ID: ${inquiry.propertyId}`}
                        </p>
                      </div>
                      {getStatusBadge(inquiry.status)}
                    </div>
                    
                    <p className="text-sm text-foreground mb-3 bg-muted/50 p-3 rounded-lg">
                      "{inquiry.message}"
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <a 
                        href={`mailto:${inquiry.email}`}
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Mail className="h-4 w-4" />
                        {inquiry.email}
                      </a>
                      {inquiry.phone && (
                        <a 
                          href={`tel:${inquiry.phone}`}
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <Phone className="h-4 w-4" />
                          {inquiry.phone}
                        </a>
                      )}
                      <span className="text-muted-foreground">
                        {formatDate(inquiry.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                    <Select
                      value={inquiry.status}
                      onValueChange={(value) => handleStatusChange(inquiry._id, value)}
                      disabled={updatingId === inquiry._id}
                    >
                      <SelectTrigger className="w-[140px]">
                        {updatingId === inquiry._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <SelectValue />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
