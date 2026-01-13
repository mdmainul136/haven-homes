import { useEffect, useState } from 'react';
import { Shield, Users, UserCog, User, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface RoleStats {
  role: string;
  count: number;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export default function AdminRoleManagement() {
  const [roleStats, setRoleStats] = useState<RoleStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoleStats();
  }, []);

  const fetchRoleStats = async () => {
    try {
      const { data: roles, error } = await supabase.from('user_roles').select('role');

      if (error) throw error;

      const adminCount = roles?.filter((r) => r.role === 'admin').length || 0;
      const vendorCount = roles?.filter((r) => r.role === 'vendor').length || 0;
      const userCount = roles?.filter((r) => r.role === 'user').length || 0;

      setRoleStats([
        {
          role: 'Admin',
          count: adminCount,
          description: 'Full access to all platform features including user management and property approvals.',
          icon: Shield,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
        },
        {
          role: 'Vendor',
          count: vendorCount,
          description: 'Can list properties, manage listings, view inquiries, and track analytics.',
          icon: UserCog,
          color: 'text-accent',
          bgColor: 'bg-accent/10',
        },
        {
          role: 'User',
          count: userCount,
          description: 'Can browse properties, save favorites, make inquiries, and use valuation tools.',
          icon: User,
          color: 'text-primary',
          bgColor: 'bg-primary/10',
        },
      ]);
    } catch (error) {
      console.error('Error fetching role stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted"></div>
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 rounded-lg bg-muted"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Role Management</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of user roles and their permissions
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {roleStats.map((stat) => (
          <Card key={stat.role} className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <Badge variant="outline" className="text-lg font-bold">
                  {stat.count}
                </Badge>
              </div>
              <CardTitle className="mt-4">{stat.role}</CardTitle>
              <CardDescription>{stat.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Permissions Matrix */}
      <Card className="mt-8 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Role Permissions
          </CardTitle>
          <CardDescription>Detailed breakdown of what each role can do</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left font-medium text-muted-foreground">Permission</th>
                  <th className="pb-3 text-center font-medium text-muted-foreground">User</th>
                  <th className="pb-3 text-center font-medium text-muted-foreground">Vendor</th>
                  <th className="pb-3 text-center font-medium text-muted-foreground">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { permission: 'Browse Properties', user: true, vendor: true, admin: true },
                  { permission: 'Save Favorites', user: true, vendor: true, admin: true },
                  { permission: 'Make Inquiries', user: true, vendor: true, admin: true },
                  { permission: 'Property Valuation', user: true, vendor: true, admin: true },
                  { permission: 'List Properties', user: false, vendor: true, admin: true },
                  { permission: 'Manage Own Listings', user: false, vendor: true, admin: true },
                  { permission: 'View Inquiries', user: false, vendor: true, admin: true },
                  { permission: 'View Analytics', user: false, vendor: true, admin: true },
                  { permission: 'Approve Properties', user: false, vendor: false, admin: true },
                  { permission: 'Manage All Users', user: false, vendor: false, admin: true },
                  { permission: 'Change User Roles', user: false, vendor: false, admin: true },
                  { permission: 'Delete Any Property', user: false, vendor: false, admin: true },
                ].map((row) => (
                  <tr key={row.permission}>
                    <td className="py-3 text-foreground">{row.permission}</td>
                    <td className="py-3 text-center">
                      {row.user ? (
                        <Badge className="bg-success/10 text-success border-0">✓</Badge>
                      ) : (
                        <Badge className="bg-muted text-muted-foreground border-0">✗</Badge>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {row.vendor ? (
                        <Badge className="bg-success/10 text-success border-0">✓</Badge>
                      ) : (
                        <Badge className="bg-muted text-muted-foreground border-0">✗</Badge>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {row.admin ? (
                        <Badge className="bg-success/10 text-success border-0">✓</Badge>
                      ) : (
                        <Badge className="bg-muted text-muted-foreground border-0">✗</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="mt-6 border-border bg-primary/5">
        <CardContent className="flex items-start gap-4 p-6">
          <div className="rounded-lg bg-primary/10 p-2">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Managing User Roles</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              To change a user's role, go to the Users section and click on the actions menu for any
              user. Roles take effect immediately after being changed. Be careful when assigning
              admin roles as they have full platform access.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
