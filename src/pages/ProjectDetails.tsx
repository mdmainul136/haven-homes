import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, MapPin, Calendar, Users, ArrowLeft, CheckCircle, 
  Clock, ChevronLeft, ChevronRight, X, Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import ProjectInquiryForm from '@/components/ProjectInquiryForm';

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
  start_date: string | null;
  expected_completion_date: string | null;
  actual_completion_date: string | null;
  description: string | null;
  description_bn: string | null;
}

interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  title_bn: string | null;
  description: string | null;
  target_date: string | null;
  completed_date: string | null;
  is_completed: boolean;
  sort_order: number;
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [project, setProject] = useState<DevelopmentProject | null>(null);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      // Fetch project details
      const { data: projectData, error: projectError } = await supabase
        .from('development_projects')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (projectError) throw projectError;
      if (projectData) {
        setProject(projectData as DevelopmentProject);
      }

      // Fetch milestones
      const { data: milestonesData, error: milestonesError } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', id)
        .order('sort_order', { ascending: true });

      if (milestonesError) throw milestonesError;
      setMilestones((milestonesData || []) as ProjectMilestone[]);
    } catch (error) {
      console.error('Error fetching project details:', error);
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatShortDate = (dateString: string | null) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const nextImage = () => {
    if (project?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images!.length);
    }
  };

  const prevImage = () => {
    if (project?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images!.length) % project.images!.length);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {t('Project Not Found', 'প্রকল্প পাওয়া যায়নি')}
          </h2>
          <Link to="/development">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('Back to Projects', 'প্রকল্পে ফিরে যান')}
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const images = project.images && project.images.length > 0 ? project.images : ['/placeholder.svg'];
  const completedMilestones = milestones.filter(m => m.is_completed).length;

  return (
    <Layout>
      {/* Back Navigation */}
      <div className="bg-muted/50 py-4">
        <div className="container">
          <Link to="/development" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('Back to Development Projects', 'উন্নয়ন প্রকল্পে ফিরে যান')}
          </Link>
        </div>
      </div>

      {/* Image Gallery */}
      <section className="bg-background">
        <div className="container py-6">
          <div className="relative">
            {/* Main Image */}
            <div 
              className="relative aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden cursor-pointer"
              onClick={() => setIsGalleryOpen(true)}
            >
              <img 
                src={images[currentImageIndex]} 
                alt={project.name} 
                className="w-full h-full object-cover"
              />
              <Badge className={`absolute top-4 left-4 ${statusColors[project.status]}`}>
                {statusLabels[project.status]}
              </Badge>
              {images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-primary' : 'bg-background/60'
                        }`}
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-8 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Location */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  {t(project.name, project.name_bn || project.name)}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">{t(project.location, project.location_bn || project.location)}</span>
                </div>
              </div>

              {/* Description */}
              {project.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('About This Project', 'এই প্রকল্প সম্পর্কে')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {t(project.description, project.description_bn || project.description)}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Milestones */}
              {milestones.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{t('Project Milestones', 'প্রকল্পের মাইলফলক')}</span>
                      <Badge variant="secondary">
                        {completedMilestones}/{milestones.length} {t('Completed', 'সম্পন্ন')}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {milestones.map((milestone, index) => (
                        <div key={milestone.id} className="relative">
                          {index < milestones.length - 1 && (
                            <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-border" />
                          )}
                          <div className="flex gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              milestone.is_completed 
                                ? 'bg-success text-primary-foreground' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {milestone.is_completed ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <Clock className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h4 className="font-semibold text-foreground">
                                    {t(milestone.title, milestone.title_bn || milestone.title)}
                                  </h4>
                                  {milestone.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {milestone.description}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right text-sm">
                                  {milestone.is_completed ? (
                                    <span className="text-success">
                                      {formatShortDate(milestone.completed_date)}
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground">
                                      {t('Target', 'লক্ষ্য')}: {formatShortDate(milestone.target_date)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress Card */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('Project Progress', 'প্রকল্পের অগ্রগতি')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">{t('Overall Progress', 'সামগ্রিক অগ্রগতি')}</span>
                      <span className="font-bold text-primary">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-3" />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('Total Units', 'মোট ইউনিট')}</p>
                        <p className="font-semibold text-foreground">{project.total_units || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('Start Date', 'শুরুর তারিখ')}</p>
                        <p className="font-semibold text-foreground">{formatDate(project.start_date)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {project.status === 'completed' 
                            ? t('Completed On', 'সম্পন্ন হয়েছে') 
                            : t('Expected Completion', 'প্রত্যাশিত সমাপ্তি')}
                        </p>
                        <p className="font-semibold text-foreground">
                          {formatDate(project.status === 'completed' 
                            ? project.actual_completion_date 
                            : project.expected_completion_date)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inquiry Form */}
              <ProjectInquiryForm 
                projectId={project.id} 
                projectName={t(project.name, project.name_bn || project.name)} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={() => setIsGalleryOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2"
            onClick={prevImage}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          
          <img 
            src={images[currentImageIndex]} 
            alt={project.name} 
            className="max-w-[90vw] max-h-[85vh] object-contain"
          />
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2"
            onClick={nextImage}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-primary' : 'bg-muted-foreground/40'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProjectDetails;
