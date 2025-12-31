import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

const Contact = () => {
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: t('Message Sent!', 'বার্তা পাঠানো হয়েছে!'), description: t('We will contact you soon.', 'শীঘ্রই যোগাযোগ করব।') });
  };

  return (
    <Layout>
      <section className="bg-primary py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            {t('Contact Us', 'যোগাযোগ করুন')}
          </h1>
          <p className="text-primary-foreground/80">{t("We'd love to hear from you.", 'আপনার কথা শুনতে আমরা আগ্রহী।')}</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-card">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold mb-6">{t('Send a Message', 'বার্তা পাঠান')}</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><Label>{t('Name', 'নাম')}</Label><Input placeholder={t('Your name', 'আপনার নাম')} required /></div>
                      <div><Label>{t('Email', 'ইমেইল')}</Label><Input type="email" placeholder="you@example.com" required /></div>
                    </div>
                    <div><Label>{t('Phone', 'ফোন')}</Label><Input placeholder="+880 1XXX-XXXXXX" /></div>
                    <div><Label>{t('Message', 'বার্তা')}</Label><Textarea rows={5} placeholder={t('Your message...', 'আপনার বার্তা...')} required /></div>
                    <Button type="submit" className="bg-gradient-gold text-primary hover:opacity-90 shadow-gold font-semibold">
                      {t('Send Message', 'বার্তা পাঠান')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              {[
                { icon: MapPin, title: t('Address', 'ঠিকানা'), text: 'House 123, Gulshan-1, Dhaka 1212' },
                { icon: Phone, title: t('Phone', 'ফোন'), text: '+880 1700-000000' },
                { icon: Mail, title: t('Email', 'ইমেইল'), text: 'info@banglaproperty.com' },
                { icon: Clock, title: t('Hours', 'সময়'), text: 'Sat-Thu: 9AM - 6PM' },
              ].map((item, i) => (
                <Card key={i} className="border-0 shadow-card">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div><h3 className="font-semibold">{item.title}</h3><p className="text-muted-foreground text-sm">{item.text}</p></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
