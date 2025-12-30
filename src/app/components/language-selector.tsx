'use client';

import { useTranslation } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import BrazilFlagIcon from '@/components/icons/brazil-flag-icon';
import UsaFlagIcon from '@/components/icons/usa-flag-icon';

export default function LanguageSelector() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex w-full rounded-md border border-border">
      <Button
        variant={language === 'pt' ? 'default' : 'ghost'}
        className="flex-1 justify-center gap-2 rounded-r-none"
        onClick={() => setLanguage('pt')}
      >
        <BrazilFlagIcon className="h-5 w-5" />
        <span>Português</span>
      </Button>
      <div className="w-px bg-border" />
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        className="flex-1 justify-center gap-2 rounded-l-none"
        onClick={() => setLanguage('en')}
      >
        <UsaFlagIcon className="h-5 w-5" />
        <span>English</span>
      </Button>
    </div>
  );
}
