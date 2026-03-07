import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200"
      title={lang === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
    >
      <Globe className="w-4 h-4" />
      <span>{t('nav.language')}</span>
    </button>
  );
}
