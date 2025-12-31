import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Globe, Phone, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: t('Home', 'হোম') },
    { path: '/projects', label: t('Our Projects', 'আমাদের প্রকল্প') },
    { path: '/buy', label: t('Buy', 'কিনুন') },
    { path: '/rent', label: t('Rent', 'ভাড়া') },
    { path: '/search', label: t('Advanced Search', 'উন্নত অনুসন্ধান') },
    { path: '/sell', label: t('Sell Property', 'সম্পত্তি বিক্রি') },
    { path: '/development', label: t('Development', 'ডেভেলপমেন্ট') },
    { path: '/about', label: t('About Us', 'আমাদের সম্পর্কে') },
    { path: '/contact', label: t('Contact', 'যোগাযোগ') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:+8801700000000" className="flex items-center gap-1 hover:text-accent transition-colors">
              <Phone className="h-3 w-3" />
              <span>+880 1700-000000</span>
            </a>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:text-accent hover:bg-primary/80">
                <Globe className="h-4 w-4 mr-1" />
                {language === 'en' ? 'English' : 'বাংলা'}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('bn')}>বাংলা</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-xl">B</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">BanglaProperty</h1>
              <p className="text-xs text-muted-foreground">{t('Your Trusted Real Estate Partner', 'আপনার বিশ্বস্ত রিয়েল এস্টেট পার্টনার')}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-accent bg-accent/10'
                    : 'text-foreground hover:text-accent hover:bg-accent/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button & Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <User className="h-4 w-4" />
                    {user?.name || user?.email}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-muted-foreground text-xs">
                    {user?.role === 'admin' ? 'Admin Account' : user?.role === 'vendor' ? 'Vendor Account' : 'Buyer Account'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user?.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      {t('Admin Dashboard', 'অ্যাডমিন ড্যাশবোর্ড')}
                    </DropdownMenuItem>
                  )}
                  {user?.role === 'vendor' && (
                    <DropdownMenuItem onClick={() => navigate('/vendor/dashboard')}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      {t('Dashboard', 'ড্যাশবোর্ড')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('Logout', 'লগআউট')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline">
                  {t('Login', 'লগইন')}
                </Button>
              </Link>
            )}
            <Link to="/sell">
              <Button className="bg-gradient-gold text-primary hover:opacity-90 shadow-gold font-semibold">
                {t('List Your Property', 'আপনার সম্পত্তি লিস্ট করুন')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-border pt-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-accent bg-accent/10'
                      : 'text-foreground hover:text-accent hover:bg-accent/5'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full mt-2">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        {t('Admin Dashboard', 'অ্যাডমিন ড্যাশবোর্ড')}
                      </Button>
                    </Link>
                  )}
                  {user?.role === 'vendor' && (
                    <Link to="/vendor/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full mt-2">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        {t('Dashboard', 'ড্যাশবোর্ড')}
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" className="w-full mt-2" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('Logout', 'লগআউট')}
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full mt-2">
                    {t('Login / Sign Up', 'লগইন / সাইন আপ')}
                  </Button>
                </Link>
              )}
              <Link to="/sell" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full mt-2 bg-gradient-gold text-primary hover:opacity-90 shadow-gold font-semibold">
                  {t('List Your Property', 'আপনার সম্পত্তি লিস্ট করুন')}
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
