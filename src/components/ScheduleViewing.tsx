import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, User, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface ScheduleViewingProps {
  propertyTitle: string;
  trigger?: React.ReactNode;
}

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

const ScheduleViewing = ({ propertyTitle, trigger }: ScheduleViewingProps) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !selectedTime) {
      toast.error(t('Please select date and time', 'অনুগ্রহ করে তারিখ এবং সময় নির্বাচন করুন'));
      return;
    }

    toast.success(
      t(
        `Visit scheduled for ${format(date, 'PPP')} at ${selectedTime}`,
        `${format(date, 'PPP')} তারিখে ${selectedTime} সময়ে ভিজিট নির্ধারিত হয়েছে`
      )
    );
    
    setIsOpen(false);
    setDate(undefined);
    setSelectedTime('');
    setFormData({ name: '', email: '', phone: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full justify-start gap-3">
            <CalendarIcon className="h-5 w-5 text-accent" />
            {t('Schedule Visit', 'ভিজিট সময়সূচি করুন')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {t('Schedule a Property Visit', 'সম্পত্তি পরিদর্শন নির্ধারণ করুন')}
          </DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground mb-4 p-3 bg-muted/50 rounded-lg">
          <span className="font-medium text-foreground">{propertyTitle}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="text-foreground">
              {t('Select Date', 'তারিখ নির্বাচন করুন')}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : t("Pick a date", "একটি তারিখ বাছুন")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => 
                    date < new Date() || 
                    date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t('Select Time', 'সময় নির্বাচন করুন')}
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  className={cn(
                    "text-xs",
                    selectedTime === time && "bg-accent text-accent-foreground"
                  )}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="font-medium text-foreground">
              {t('Your Information', 'আপনার তথ্য')}
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="visit-name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {t('Full Name', 'পুরো নাম')}
              </Label>
              <Input
                id="visit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('Enter your name', 'আপনার নাম লিখুন')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visit-email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {t('Email', 'ইমেইল')}
              </Label>
              <Input
                id="visit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t('Enter your email', 'আপনার ইমেইল লিখুন')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visit-phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {t('Phone', 'ফোন')}
              </Label>
              <Input
                id="visit-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={t('Enter your phone number', 'আপনার ফোন নম্বর লিখুন')}
                required
              />
            </div>
          </div>

          {/* Summary */}
          {date && selectedTime && (
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-sm font-medium text-foreground mb-1">
                {t('Visit Summary', 'পরিদর্শন সারাংশ')}
              </p>
              <p className="text-sm text-muted-foreground">
                📅 {format(date, 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-sm text-muted-foreground">
                🕐 {selectedTime}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              {t('Cancel', 'বাতিল')}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {t('Confirm Booking', 'বুকিং নিশ্চিত করুন')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleViewing;
