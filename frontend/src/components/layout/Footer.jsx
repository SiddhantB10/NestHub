import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, Building2, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Stay<span className="text-brand-400">NMIMS</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4 text-brand-400" />
              Vile Parle West, Mumbai 400056
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/hostels', label: t('nav.hostels') },
                { to: '/dashboard', label: t('nav.dashboard') },
                { to: '/parent-access', label: t('nav.parents') },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 group">
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.support')}</h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">{t('footer.faq')}</span></li>
              <li><span className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">{t('footer.terms')}</span></li>
              <li><span className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">{t('footer.privacy')}</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                support@staynmims.com
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                +91 22 2610 XXXX
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <Building2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <span>{t('footer.helpline')}: Mon–Sat, 9 AM – 7 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} StayNMIMS. Built for students, by students.
          </p>
          <p className="text-xs text-gray-600">
            Not officially affiliated with SVKM's NMIMS University.
          </p>
        </div>
      </div>
    </footer>
  );
}
