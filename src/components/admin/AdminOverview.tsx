import { useEffect, useState } from 'react';
import { Building2, Users, Eye, Clock, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  totalProperties: number;
  totalUsers: number;
  totalViews: number;
  pendingApprovals: number;
  approvedProperties: number;
  rejectedProperties: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    totalUsers: 0,
    totalViews: 0,
    pendingApprovals: 0,
    approvedProperties: 0,
    rejectedProperties: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch properties
      const { data: properties } = await supabase
        .from('properties')
        .select('status, views');

      // Fetch users count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const totalProperties = properties?.length || 0;
      const totalViews = properties?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;
      const pendingApprovals = properties?.filter(p => p.status === 'pending').length || 0;
      const approvedProperties = properties?.filter(p => p.status === 'approved').length || 0;
      const rejectedProperties = properties?.filter(p => p.status === 'rejected').length || 0;

      setStats({
        totalProperties,
        totalUsers: userCount || 0,
        totalViews,
        pendingApprovals,
        approvedProperties,
        rejectedProperties,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: Building2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Approved',
      value: stats.approvedProperties,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Rejected',
      value: stats.rejectedProperties,
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-muted"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 rounded-lg bg-muted"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome to the admin dashboard. Here's a summary of your platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer border-border transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-primary/10 p-3">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Manage Properties</h3>
                <p className="text-sm text-muted-foreground">View, edit, or delete listings</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer border-border transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-accent/10 p-3">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Manage Users</h3>
                <p className="text-sm text-muted-foreground">View and manage user accounts</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer border-border transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-success/10 p-3">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">View Analytics</h3>
                <p className="text-sm text-muted-foreground">Platform performance insights</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
