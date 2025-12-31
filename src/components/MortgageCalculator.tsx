import { useState, useMemo } from 'react';
import { Calculator, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

interface MortgageCalculatorProps {
  defaultPrice?: number;
}

const MortgageCalculator = ({ defaultPrice = 10000000 }: MortgageCalculatorProps) => {
  const { t } = useLanguage();

  const [propertyPrice, setPropertyPrice] = useState(defaultPrice);
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(9);
  const [loanTerm, setLoanTerm] = useState(20);

  const calculations = useMemo(() => {
    const principal = propertyPrice * (1 - downPayment / 100);
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
      monthlyPayment = principal / numberOfPayments;
    }

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    return {
      principal,
      monthlyPayment,
      totalPayment,
      totalInterest,
      downPaymentAmount: propertyPrice * (downPayment / 100),
    };
  }, [propertyPrice, downPayment, interestRate, loanTerm]);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `৳ ${(amount / 10000000).toFixed(2)} ${t('Crore', 'কোটি')}`;
    } else if (amount >= 100000) {
      return `৳ ${(amount / 100000).toFixed(2)} ${t('Lakh', 'লাখ')}`;
    }
    return `৳ ${amount.toLocaleString()}`;
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Calculator className="h-5 w-5 text-accent" />
          {t('Mortgage Calculator', 'মর্টগেজ ক্যালকুলেটর')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Price */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-foreground">
              {t('Property Price', 'সম্পত্তির মূল্য')}
            </Label>
            <span className="text-sm font-medium text-accent">
              {formatCurrency(propertyPrice)}
            </span>
          </div>
          <Input
            type="number"
            value={propertyPrice}
            onChange={(e) => setPropertyPrice(Number(e.target.value))}
            className="mb-2"
          />
          <Slider
            value={[propertyPrice / 1000000]}
            onValueChange={(value) => setPropertyPrice(value[0] * 1000000)}
            max={500}
            min={1}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>৳ 10 {t('Lakh', 'লাখ')}</span>
            <span>৳ 50 {t('Crore', 'কোটি')}</span>
          </div>
        </div>

        {/* Down Payment */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Label className="text-foreground">
                {t('Down Payment', 'ডাউন পেমেন্ট')}
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('Initial payment made upfront', 'প্রথমে প্রদত্ত অগ্রিম পেমেন্ট')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="text-sm font-medium text-accent">
              {downPayment}% ({formatCurrency(calculations.downPaymentAmount)})
            </span>
          </div>
          <Slider
            value={[downPayment]}
            onValueChange={(value) => setDownPayment(value[0])}
            max={80}
            min={5}
            step={5}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5%</span>
            <span>80%</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Label className="text-foreground">
                {t('Interest Rate', 'সুদের হার')}
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('Annual interest rate', 'বার্ষিক সুদের হার')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="text-sm font-medium text-accent">{interestRate}%</span>
          </div>
          <Slider
            value={[interestRate]}
            onValueChange={(value) => setInterestRate(value[0])}
            max={20}
            min={5}
            step={0.25}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5%</span>
            <span>20%</span>
          </div>
        </div>

        {/* Loan Term */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-foreground">
              {t('Loan Term', 'ঋণের মেয়াদ')}
            </Label>
            <span className="text-sm font-medium text-accent">
              {loanTerm} {t('Years', 'বছর')}
            </span>
          </div>
          <Slider
            value={[loanTerm]}
            onValueChange={(value) => setLoanTerm(value[0])}
            max={30}
            min={5}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5 {t('Years', 'বছর')}</span>
            <span>30 {t('Years', 'বছর')}</span>
          </div>
        </div>

        {/* Results */}
        <div className="pt-4 border-t border-border space-y-4">
          <div className="bg-accent/10 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              {t('Estimated Monthly Payment', 'আনুমানিক মাসিক পেমেন্ট')}
            </p>
            <p className="text-3xl font-bold text-accent">
              ৳ {calculations.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">
                {t('Loan Amount', 'ঋণের পরিমাণ')}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {formatCurrency(calculations.principal)}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">
                {t('Total Interest', 'মোট সুদ')}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {formatCurrency(calculations.totalInterest)}
              </p>
            </div>
          </div>

          <div className="bg-primary/5 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">
              {t('Total Payment', 'মোট পেমেন্ট')}
            </p>
            <p className="text-lg font-bold text-primary">
              {formatCurrency(calculations.totalPayment)}
            </p>
          </div>
        </div>

        <Button className="w-full" variant="outline">
          {t('Apply for Home Loan', 'হোম লোনের জন্য আবেদন করুন')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MortgageCalculator;
