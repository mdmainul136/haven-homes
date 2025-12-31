import Layout from '@/components/layout/Layout';
import PropertyCard from '@/components/PropertyCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { properties } from '@/data/properties';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Projects = () => {
  const { t } = useLanguage();

  const ourProjects = properties.filter(p => p.isOurProject);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container">
          <Badge className="bg-accent text-accent-foreground mb-4">
            {t('Premium Quality', 'প্রিমিয়াম মান')}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            {t('Our Developed Projects', 'আমাদের উন্নত প্রকল্পসমূহ')}
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl">
            {t(
              'Explore our premium residential and commercial developments. Each project is crafted with attention to detail, quality materials, and modern design.',
              'আমাদের প্রিমিয়াম আবাসিক এবং বাণিজ্যিক উন্নয়ন অন্বেষণ করুন। প্রতিটি প্রকল্প বিস্তারিত মনোযোগ, মানসম্পন্ন উপকরণ এবং আধুনিক ডিজাইন দিয়ে তৈরি।'
            )}
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container">
          {/* Project Categories */}
          <div className="flex flex-wrap gap-3 mb-12">
            <Badge variant="outline" className="cursor-pointer bg-accent text-accent-foreground px-4 py-2 text-sm">
              {t('All Projects', 'সব প্রকল্প')}
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm">
              {t('Ready', 'রেডি')}
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm">
              {t('Under Construction', 'নির্মাণাধীন')}
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm">
              {t('Upcoming', 'আসছে')}
            </Badge>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ourProjects.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>

          {ourProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                {t('No projects available at the moment.', 'এই মুহূর্তে কোন প্রকল্প পাওয়া যাচ্ছে না।')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary/30">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            {t('Interested in Our Projects?', 'আমাদের প্রকল্পে আগ্রহী?')}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            {t(
              'Contact us today to learn more about our developments and book a site visit.',
              'আমাদের উন্নয়ন সম্পর্কে আরও জানতে এবং সাইট ভিজিট বুক করতে আজই যোগাযোগ করুন।'
            )}
          </p>
          <Link to="/contact">
            <Button className="bg-gradient-gold text-primary hover:opacity-90 shadow-gold font-semibold">
              {t('Book a Visit', 'ভিজিট বুক করুন')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
