import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProjectInquiryFormProps {
  projectId: string;
  projectName: string;
}

export default function ProjectInquiryForm({ projectId, projectName }: ProjectInquiryFormProps) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error(t('Please fill in all required fields', 'অনুগ্রহ করে সব প্রয়োজনীয় ক্ষেত্র পূরণ করুন'));
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('project_inquiries')
        .insert([{
          project_id: projectId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
        }]);

      if (error) throw error;

      setIsSubmitted(true);
      toast.success(t('Inquiry submitted successfully!', 'অনুসন্ধান সফলভাবে জমা দেওয়া হয়েছে!'));
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error(t('Failed to submit inquiry. Please try again.', 'অনুসন্ধান জমা দিতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Send className="h-8 w-8 text-success" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {t('Thank You!', 'ধন্যবাদ!')}
          </h3>
          <p className="text-muted-foreground text-sm">
            {t(
              'Your inquiry has been submitted. Our team will contact you shortly.',
              'আপনার অনুসন্ধান জমা দেওয়া হয়েছে। আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।'
            )}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t('Inquire About This Project', 'এই প্রকল্প সম্পর্কে জিজ্ঞাসা করুন')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('Name', 'নাম')} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('Your full name', 'আপনার পুরো নাম')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('Email', 'ইমেইল')} *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={t('your@email.com', 'your@email.com')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('Phone', 'ফোন')}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={t('+880 1XXX-XXXXXX', '+880 1XXX-XXXXXX')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{t('Message', 'বার্তা')} *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={t(
                `I'm interested in ${projectName}. Please provide more details about...`,
                `আমি ${projectName} এ আগ্রহী। অনুগ্রহ করে আরও বিস্তারিত জানান...`
              )}
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('Submitting...', 'জমা দেওয়া হচ্ছে...')}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t('Send Inquiry', 'অনুসন্ধান পাঠান')}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
