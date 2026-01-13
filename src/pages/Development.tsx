import { useState, useEffect } from 'react';
import { Building2, Clock, CheckCircle, MapPin, ArrowUpRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface DevelopmentProject {
  id: string;
  name: string;
  name_bn: string | null;
  location: string;
  location_bn: string | null;
  status: 'ongoing' | 'upcoming' | 'completed';
  progress: number;
  total_units: number | null;
  images: string[] | null;
  expected_completion_date: string | null;
  actual_completion_date: string | null;
  description: string | null;
  description_bn: string | null;
}

const Development = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<DevelopmentProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('development_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects((data || []) as DevelopmentProject[]);
    } catch (error) {
      console.error('Error fetching development projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    ongoing: 'bg-warning text-foreground',
    upcoming: 'bg-primary text-primary-foreground',
    completed: 'bg-success text-primary-foreground',
  };

  const statusLabels: Record<string, string> = {
    ongoing: t('Ongoing', 'চলমান'),
    upcoming: t('Upcoming', 'আসছে'),
    completed: t('Completed', 'সম্পন্ন'),
  };

  const getProjectImage = (project: DevelopmentProject) => {
    if (project.images && project.images.length > 0) {
      return project.images[0];
    }
    return '/placeholder.svg';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const ongoingProjects = projects.filter(p => p.status === 'ongoing');
  const upcomingProjects = projects.filter(p => p.status === 'upcoming');
  const completedProjects = projects.filter(p => p.status === 'completed');

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            {t('Development Projects', 'উন্নয়ন প্রকল্পসমূহ')}
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl">
            {t(
              'Track the progress of our ongoing developments and explore upcoming projects. Invest early for the best opportunities.',
              'আমাদের চলমান উন্নয়নের অগ্রগতি ট্র্যাক করুন এবং আসন্ন প্রকল্পগুলি অন্বেষণ করুন। সেরা সুযোগের জন্য আগেই বিনিয়োগ করুন।'
            )}
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container">
          {/* Ongoing Projects */}
          {ongoingProjects.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {t('Ongoing Projects', 'চলমান প্রকল্প')}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ongoingProjects.map((project) => (
                  <Card key={project.id} className="overflow-hidden border-0 shadow-card hover:shadow-elevated transition-all">
                    <div className="relative aspect-video">
                      <img src={getProjectImage(project)} alt={project.name} className="w-full h-full object-cover" />
                      <Badge className={`absolute top-4 left-4 ${statusColors[project.status]}`}>
                        {statusLabels[project.status]}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {t(project.name, project.name_bn || project.name)}
                      </h3>
                      <div className="flex items-center gap-1 text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{t(project.location, project.location_bn || project.location)}</span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('Progress', 'অগ্রগতি')}</span>
                          <span className="font-semibold text-accent">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{t('Units', 'ইউনিট')}: {project.total_units || 'N/A'}</span>
                        <span>{t('Completion', 'সমাপ্তি')}: {formatDate(project.expected_completion_date)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Projects */}
          {upcomingProjects.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {t('Upcoming Projects', 'আসন্ন প্রকল্প')}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingProjects.map((project) => (
                  <Card key={project.id} className="overflow-hidden border-0 shadow-card hover:shadow-elevated transition-all">
                    <div className="relative aspect-video">
                      <img src={getProjectImage(project)} alt={project.name} className="w-full h-full object-cover" />
                      <Badge className={`absolute top-4 left-4 ${statusColors[project.status]}`}>
                        {statusLabels[project.status]}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {t(project.name, project.name_bn || project.name)}
                      </h3>
                      <div className="flex items-center gap-1 text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{t(project.location, project.location_bn || project.location)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{t('Units', 'ইউনিট')}: {project.total_units || 'N/A'}</span>
                        <span>{t('Expected', 'প্রত্যাশিত')}: {formatDate(project.expected_completion_date)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completed Projects */}
          {completedProjects.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {t('Completed Projects', 'সম্পন্ন প্রকল্প')}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {completedProjects.map((project) => (
                  <Card key={project.id} className="overflow-hidden border-0 shadow-card hover:shadow-elevated transition-all">
                    <div className="relative aspect-video">
                      <img src={getProjectImage(project)} alt={project.name} className="w-full h-full object-cover" />
                      <Badge className={`absolute top-4 left-4 ${statusColors[project.status]}`}>
                        {statusLabels[project.status]}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {t(project.name, project.name_bn || project.name)}
                      </h3>
                      <div className="flex items-center gap-1 text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{t(project.location, project.location_bn || project.location)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{t('Units', 'ইউনিট')}: {project.total_units || 'N/A'}</span>
                        <span>{t('Completed', 'সম্পন্ন')}: {formatDate(project.actual_completion_date)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {projects.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {t('No Projects Available', 'কোনো প্রকল্প নেই')}
              </h3>
              <p className="text-muted-foreground">
                {t('Check back later for new development projects.', 'নতুন উন্নয়ন প্রকল্পের জন্য পরে দেখুন।')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-gold">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
            {t('Invest in Our Projects', 'আমাদের প্রকল্পে বিনিয়োগ করুন')}
          </h2>
          <p className="text-primary/80 mb-6 max-w-xl mx-auto">
            {t(
              'Get early access to our upcoming developments and secure the best units at pre-launch prices.',
              'আমাদের আসন্ন উন্নয়নে প্রাথমিক অ্যাক্সেস পান এবং প্রি-লঞ্চ মূল্যে সেরা ইউনিট সুরক্ষিত করুন।'
            )}
          </p>
          <Link to="/contact">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              {t('Contact Sales Team', 'সেলস টিমের সাথে যোগাযোগ করুন')}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Development;
