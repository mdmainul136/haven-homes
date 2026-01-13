import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, MoreHorizontal, Calendar, Building2, CheckCircle2, Clock, Target, ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import ProjectImageUpload from './ProjectImageUpload';

interface DevelopmentProject {
  id: string;
  name: string;
  name_bn?: string | null;
  location: string;
  location_bn?: string | null;
  description?: string | null;
  description_bn?: string | null;
  status: string;
  progress: number;
  total_units?: number | null;
  start_date?: string | null;
  expected_completion_date?: string | null;
  actual_completion_date?: string | null;
  images?: string[] | null;
  created_at: string;
  updated_at: string;
}

interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  title_bn?: string;
  description?: string;
  target_date?: string;
  completed_date?: string;
  is_completed: boolean;
  sort_order: number;
}

type StatusFilter = 'all' | 'upcoming' | 'ongoing' | 'completed';

export default function AdminDevelopmentProjects() {
  const [projects, setProjects] = useState<DevelopmentProject[]>([]);
  const [milestones, setMilestones] = useState<Record<string, ProjectMilestone[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; project: DevelopmentProject | null }>({
    open: false,
    project: null,
  });
  const [formDialog, setFormDialog] = useState<{ open: boolean; project: DevelopmentProject | null }>({
    open: false,
    project: null,
  });
  const [milestonesDialog, setMilestonesDialog] = useState<{ open: boolean; project: DevelopmentProject | null }>({
    open: false,
    project: null,
  });
  const [imagesDialog, setImagesDialog] = useState<{ open: boolean; project: DevelopmentProject | null }>({
    open: false,
    project: null,
  });
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    name_bn: '',
    location: '',
    location_bn: '',
    description: '',
    description_bn: '',
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed',
    progress: 0,
    total_units: 0,
    start_date: '',
    expected_completion_date: '',
    actual_completion_date: '',
  });
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    title_bn: '',
    description: '',
    target_date: '',
  });

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
      setProjects(data || []);
      
      // Fetch milestones for all projects
      if (data && data.length > 0) {
        const { data: milestonesData, error: milestonesError } = await supabase
          .from('project_milestones')
          .select('*')
          .in('project_id', data.map(p => p.id))
          .order('sort_order', { ascending: true });
        
        if (!milestonesError && milestonesData) {
          const grouped: Record<string, ProjectMilestone[]> = {};
          milestonesData.forEach(m => {
            if (!grouped[m.project_id]) grouped[m.project_id] = [];
            grouped[m.project_id].push(m);
          });
          setMilestones(grouped);
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load development projects');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (project?: DevelopmentProject) => {
    if (project) {
      setFormData({
        name: project.name,
        name_bn: project.name_bn || '',
        location: project.location,
        location_bn: project.location_bn || '',
        description: project.description || '',
        description_bn: project.description_bn || '',
        status: project.status as 'upcoming' | 'ongoing' | 'completed',
        progress: project.progress,
        total_units: project.total_units || 0,
        start_date: project.start_date || '',
        expected_completion_date: project.expected_completion_date || '',
        actual_completion_date: project.actual_completion_date || '',
      });
      setFormDialog({ open: true, project });
    } else {
      setFormData({
        name: '',
        name_bn: '',
        location: '',
        location_bn: '',
        description: '',
        description_bn: '',
        status: 'upcoming',
        progress: 0,
        total_units: 0,
        start_date: '',
        expected_completion_date: '',
        actual_completion_date: '',
      });
      setFormDialog({ open: true, project: null });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.location) {
      toast.error('Name and location are required');
      return;
    }

    try {
      const projectData = {
        name: formData.name,
        name_bn: formData.name_bn || null,
        location: formData.location,
        location_bn: formData.location_bn || null,
        description: formData.description || null,
        description_bn: formData.description_bn || null,
        status: formData.status,
        progress: formData.progress,
        total_units: formData.total_units || null,
        start_date: formData.start_date || null,
        expected_completion_date: formData.expected_completion_date || null,
        actual_completion_date: formData.actual_completion_date || null,
      };

      if (formDialog.project) {
        const { error } = await supabase
          .from('development_projects')
          .update(projectData)
          .eq('id', formDialog.project.id);

        if (error) throw error;
        toast.success('Project updated successfully');
      } else {
        const { error } = await supabase
          .from('development_projects')
          .insert([projectData]);

        if (error) throw error;
        toast.success('Project created successfully');
      }

      setFormDialog({ open: false, project: null });
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.project) return;

    try {
      const { error } = await supabase
        .from('development_projects')
        .delete()
        .eq('id', deleteDialog.project.id);

      if (error) throw error;
      toast.success('Project deleted successfully');
      setDeleteDialog({ open: false, project: null });
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleAddMilestone = async () => {
    if (!milestonesDialog.project || !milestoneForm.title) {
      toast.error('Title is required');
      return;
    }

    try {
      const existingMilestones = milestones[milestonesDialog.project.id] || [];
      const { error } = await supabase
        .from('project_milestones')
        .insert([{
          project_id: milestonesDialog.project.id,
          title: milestoneForm.title,
          title_bn: milestoneForm.title_bn || null,
          description: milestoneForm.description || null,
          target_date: milestoneForm.target_date || null,
          sort_order: existingMilestones.length,
        }]);

      if (error) throw error;
      toast.success('Milestone added');
      setMilestoneForm({ title: '', title_bn: '', description: '', target_date: '' });
      fetchProjects();
    } catch (error) {
      console.error('Error adding milestone:', error);
      toast.error('Failed to add milestone');
    }
  };

  const handleToggleMilestone = async (milestone: ProjectMilestone) => {
    try {
      const { error } = await supabase
        .from('project_milestones')
        .update({
          is_completed: !milestone.is_completed,
          completed_date: !milestone.is_completed ? new Date().toISOString().split('T')[0] : null,
        })
        .eq('id', milestone.id);

      if (error) throw error;
      fetchProjects();
    } catch (error) {
      console.error('Error updating milestone:', error);
      toast.error('Failed to update milestone');
    }
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    try {
      const { error } = await supabase
        .from('project_milestones')
        .delete()
        .eq('id', milestoneId);

      if (error) throw error;
      toast.success('Milestone deleted');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting milestone:', error);
      toast.error('Failed to delete milestone');
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success/10 text-success border-0"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'ongoing':
        return <Badge className="bg-warning/10 text-warning border-0"><Clock className="h-3 w-3 mr-1" />Ongoing</Badge>;
      case 'upcoming':
        return <Badge className="bg-primary/10 text-primary border-0"><Target className="h-3 w-3 mr-1" />Upcoming</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusCount = (status: StatusFilter) => {
    if (status === 'all') return projects.length;
    return projects.filter(p => p.status === status).length;
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

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Development Projects</h1>
          <p className="mt-1 text-muted-foreground">
            Manage construction projects with progress tracking and timelines
          </p>
        </div>
        <Button onClick={() => handleOpenForm()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)} className="mb-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="gap-2">
            All
            <Badge variant="secondary" className="ml-1">{getStatusCount('all')}</Badge>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-2">
            <Target className="h-4 w-4" />
            Upcoming
            <Badge variant="secondary" className="ml-1">{getStatusCount('upcoming')}</Badge>
          </TabsTrigger>
          <TabsTrigger value="ongoing" className="gap-2">
            <Clock className="h-4 w-4" />
            Ongoing
            <Badge variant="secondary" className="ml-1">{getStatusCount('ongoing')}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Completed
            <Badge variant="secondary" className="ml-1">{getStatusCount('completed')}</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="border-border">
        <CardHeader className="border-b border-border">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Project</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No development projects found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project.id} className="border-border">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="max-w-[180px] truncate">{project.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{project.location}</TableCell>
                    <TableCell>{getStatusBadge(project.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="w-20" />
                        <span className="text-sm text-muted-foreground">{project.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{project.total_units || '-'}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {project.expected_completion_date 
                        ? format(new Date(project.expected_completion_date), 'MMM yyyy')
                        : '-'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleOpenForm(project)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setProjectImages(project.images || []);
                            setImagesDialog({ open: true, project });
                          }}>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Images
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setMilestonesDialog({ open: true, project })}>
                            <Calendar className="mr-2 h-4 w-4" />
                            Milestones
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteDialog({ open: true, project })}
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

      {/* Project Form Dialog */}
      <Dialog open={formDialog.open} onOpenChange={(open) => !open && setFormDialog({ open: false, project: null })}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{formDialog.project ? 'Edit Project' : 'Add Project'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>
              <div className="space-y-2">
                <Label>Name (Bangla)</Label>
                <Input
                  value={formData.name_bn}
                  onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
                  placeholder="প্রকল্পের নাম"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location *</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter location"
                />
              </div>
              <div className="space-y-2">
                <Label>Location (Bangla)</Label>
                <Input
                  value={formData.location_bn}
                  onChange={(e) => setFormData({ ...formData, location_bn: e.target.value })}
                  placeholder="অবস্থান"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Progress (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Total Units</Label>
                <Input
                  type="number"
                  value={formData.total_units}
                  onChange={(e) => setFormData({ ...formData, total_units: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Expected Completion</Label>
                <Input
                  type="date"
                  value={formData.expected_completion_date}
                  onChange={(e) => setFormData({ ...formData, expected_completion_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Actual Completion</Label>
                <Input
                  type="date"
                  value={formData.actual_completion_date}
                  onChange={(e) => setFormData({ ...formData, actual_completion_date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Description (Bangla)</Label>
              <Textarea
                value={formData.description_bn}
                onChange={(e) => setFormData({ ...formData, description_bn: e.target.value })}
                placeholder="প্রকল্পের বিবরণ..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setFormDialog({ open: false, project: null })}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {formDialog.project ? 'Update' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Milestones Dialog */}
      <Dialog open={milestonesDialog.open} onOpenChange={(open) => !open && setMilestonesDialog({ open: false, project: null })}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Milestones - {milestonesDialog.project?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Existing Milestones */}
            <div className="space-y-2">
              {milestonesDialog.project && milestones[milestonesDialog.project.id]?.length > 0 ? (
                milestones[milestonesDialog.project.id].map((milestone) => (
                  <div
                    key={milestone.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      milestone.is_completed ? 'bg-success/5 border-success/20' : 'bg-muted/50 border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleMilestone(milestone)}
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          milestone.is_completed
                            ? 'bg-success border-success text-success-foreground'
                            : 'border-muted-foreground'
                        }`}
                      >
                        {milestone.is_completed && <CheckCircle2 className="h-3 w-3" />}
                      </button>
                      <div>
                        <p className={`font-medium ${milestone.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                          {milestone.title}
                        </p>
                        {milestone.target_date && (
                          <p className="text-xs text-muted-foreground">
                            Target: {format(new Date(milestone.target_date), 'MMM dd, yyyy')}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteMilestone(milestone.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No milestones yet</p>
              )}
            </div>

            {/* Add Milestone Form */}
            <div className="border-t pt-4 space-y-3">
              <h4 className="font-medium">Add New Milestone</h4>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                  placeholder="Milestone title"
                />
                <Input
                  type="date"
                  value={milestoneForm.target_date}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, target_date: e.target.value })}
                />
              </div>
              <Button onClick={handleAddMilestone} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Images Dialog */}
      <Dialog open={imagesDialog.open} onOpenChange={(open) => !open && setImagesDialog({ open: false, project: null })}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Images - {imagesDialog.project?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {imagesDialog.project && (
              <ProjectImageUpload
                projectId={imagesDialog.project.id}
                images={projectImages}
                onImagesChange={async (newImages) => {
                  setProjectImages(newImages);
                  // Save to database
                  try {
                    const { error } = await supabase
                      .from('development_projects')
                      .update({ images: newImages })
                      .eq('id', imagesDialog.project!.id);
                    
                    if (error) throw error;
                    fetchProjects();
                  } catch (error) {
                    console.error('Error updating images:', error);
                    toast.error('Failed to save images');
                  }
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, project: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.project?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
