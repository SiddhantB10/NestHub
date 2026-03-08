import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function SearchBar({ onSearch, className = '' }) {
  const [query, setQuery] = useState('');
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/hostels?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t('hero.searchPlaceholder')}
          className="w-full pl-12 pr-24 sm:pr-32 py-3 sm:py-4 rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-200/50
                     focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                     text-sm sm:text-base text-gray-800 placeholder:text-gray-400 transition-all duration-200"
        />
        <button
          type="submit"
          className="absolute right-2 btn-primary !py-2 sm:!py-2.5 !px-3 sm:!px-5 !rounded-xl text-xs sm:text-sm"
        >
          Search
        </button>
      </div>
    </form>
  );
}
