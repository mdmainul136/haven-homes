import { useState, useEffect } from 'react';
import { analyticsApi } from '@/lib/mongodb-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, Building2, MessageSquare, TrendingUp } from 'lucide-react';

interface Analytics {
  totalProperties: number;
  totalViews: number;
  totalInquiries: number;
  propertiesByStatus: {
    approved: number;
    pending: number;
    rejected: number;
  };
  recentViews: Array<{ date: string; views: number }>;
}

interface VendorAnalyticsProps {
  vendorId: string;
}

export default function VendorAnalytics({ vendorId }: VendorAnalyticsProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      const response = await analyticsApi.getVendorAnalytics(vendorId);
      if (response.success && response.data) {
        setAnalytics(response.data as Analytics);
      }
      setIsLoading(false);
    };

    fetchAnalytics();
  }, [vendorId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No analytics data</h3>
          <p className="text-muted-foreground">
            Start adding properties to see your analytics
          </p>
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    {
      title: 'Total Properties',
      value: analytics.totalProperties || 0,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Views',
      value: analytics.totalViews || 0,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total Inquiries',
      value: analytics.totalInquiries || 0,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Conversion Rate',
      value: analytics.totalViews > 0 
        ? `${((analytics.totalInquiries / analytics.totalViews) * 100).toFixed(1)}%`
        : '0%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Analytics Overview</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Properties by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Approved</span>
                </div>
                <span className="font-medium">{analytics.propertiesByStatus?.approved || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span>Pending</span>
                </div>
                <span className="font-medium">{analytics.propertiesByStatus?.pending || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Rejected</span>
                </div>
                <span className="font-medium">{analytics.propertiesByStatus?.rejected || 0}</span>
              </div>
            </div>

            {analytics.totalProperties > 0 && (
              <div className="mt-6">
                <div className="h-4 rounded-full overflow-hidden bg-muted flex">
                  {analytics.propertiesByStatus?.approved > 0 && (
                    <div 
                      className="bg-green-500 h-full"
                      style={{ 
                        width: `${(analytics.propertiesByStatus.approved / analytics.totalProperties) * 100}%` 
                      }}
                    />
                  )}
                  {analytics.propertiesByStatus?.pending > 0 && (
                    <div 
                      className="bg-yellow-500 h-full"
                      style={{ 
                        width: `${(analytics.propertiesByStatus.pending / analytics.totalProperties) * 100}%` 
                      }}
                    />
                  )}
                  {analytics.propertiesByStatus?.rejected > 0 && (
                    <div 
                      className="bg-red-500 h-full"
                      style={{ 
                        width: `${(analytics.propertiesByStatus.rejected / analytics.totalProperties) * 100}%` 
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Add high-quality images to increase property views
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Respond to inquiries within 24 hours for best results
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Keep property details accurate and up-to-date
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Use descriptive titles with location for better visibility
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
