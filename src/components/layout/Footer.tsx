import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-xl">B</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">BanglaProperty</h3>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              {t(
                'Your trusted partner in real estate. We develop premium properties and connect buyers with the best opportunities in Bangladesh.',
                'রিয়েল এস্টেটে আপনার বিশ্বস্ত সঙ্গী। আমরা প্রিমিয়াম সম্পত্তি তৈরি করি এবং ক্রেতাদের বাংলাদেশের সেরা সুযোগের সাথে সংযুক্ত করি।'
              )}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-primary flex items-center justify-center transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-primary flex items-center justify-center transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-primary flex items-center justify-center transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-primary flex items-center justify-center transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-primary flex items-center justify-center transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t('Quick Links', 'দ্রুত লিংক')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/projects" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  {t('Our Projects', 'আমাদের প্রকল্প')}
                </Link>
              </li>
              <li>
                <Link to="/buy" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  {t('Buy Property', 'সম্পত্তি কিনুন')}
                </Link>
              </li>
              <li>
                <Link to="/rent" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  {t('Rent Property', 'সম্পত্তি ভাড়া')}
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  {t('Sell Property', 'সম্পত্তি বিক্রি')}
                </Link>
              </li>
              <li>
                <Link to="/development" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  {t('Development Projects', 'উন্নয়ন প্রকল্প')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t('Services', 'সেবাসমূহ')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  {t('About Us', 'আমাদের সম্পর্কে')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  {t('Contact Us', 'যোগাযোগ করুন')}
                </Link>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  {t('Property Valuation', 'সম্পত্তি মূল্যায়ন')}
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  {t('Investment Guide', 'বিনিয়োগ গাইড')}
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  {t('Legal Support', 'আইনি সহায়তা')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t('Contact Us', 'যোগাযোগ করুন')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  {t(
                    'House 123, Road 5, Block A, Gulshan-1, Dhaka 1212, Bangladesh',
                    'বাড়ি ১২৩, রোড ৫, ব্লক এ, গুলশান-১, ঢাকা ১২১২, বাংলাদেশ'
                  )}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <a href="tel:+8801700000000" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <a href="mailto:info@banglaproperty.com" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  info@banglaproperty.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © 2024 BanglaProperty. {t('All rights reserved.', 'সর্বস্বত্ব সংরক্ষিত।')}
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
              {t('Privacy Policy', 'গোপনীয়তা নীতি')}
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
              {t('Terms of Service', 'সেবার শর্তাবলী')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
