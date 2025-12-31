import { Award, Users, Target, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import property1 from '@/assets/property-1.jpg';

const About = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <section className="bg-primary py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            {t('About BanglaProperty', 'বাংলাপ্রপার্টি সম্পর্কে')}
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl">
            {t('Your trusted partner in real estate since 2009.', '২০০৯ সাল থেকে রিয়েল এস্টেটে আপনার বিশ্বস্ত সঙ্গী।')}
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-2xl font-bold mb-4">{t('Our Mission', 'আমাদের মিশন')}</h2>
              <p className="text-muted-foreground mb-6">
                {t('To make property transactions transparent, secure, and accessible for everyone in Bangladesh.', 'বাংলাদেশে সবার জন্য সম্পত্তি লেনদেন স্বচ্ছ, নিরাপদ এবং সহজলভ্য করা।')}
              </p>
              <h2 className="text-2xl font-bold mb-4">{t('Our Vision', 'আমাদের ভিশন')}</h2>
              <p className="text-muted-foreground">
                {t('To be the most trusted real estate platform in South Asia.', 'দক্ষিণ এশিয়ার সবচেয়ে বিশ্বস্ত রিয়েল এস্টেট প্ল্যাটফর্ম হওয়া।')}
              </p>
            </div>
            <img src={property1} alt="About" className="rounded-xl shadow-elevated" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Building2, value: '50+', label: t('Projects Completed', 'সম্পন্ন প্রকল্প') },
              { icon: Users, value: '10K+', label: t('Happy Clients', 'সন্তুষ্ট গ্রাহক') },
              { icon: Target, value: '15+', label: t('Years Experience', 'বছরের অভিজ্ঞতা') },
              { icon: Award, value: '25+', label: t('Awards Won', 'পুরস্কার') },
            ].map((stat, i) => (
              <Card key={i} className="text-center border-0 shadow-card">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 text-accent mx-auto mb-3" />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
