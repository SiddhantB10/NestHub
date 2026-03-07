import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { hostels } from '../data/hostels';
import PageTransition, { FadeInSection } from '../components/ui/PageTransition';
import SearchBar from '../components/hostel/SearchBar';
import FilterPanel from '../components/hostel/FilterPanel';
import HostelCard from '../components/hostel/HostelCard';
import { SkeletonCard } from '../components/ui/Skeleton';

const defaultFilters = {
  gender: 'all',
  budget: null,
  maxDistance: 10,
  lease: null,
  moveInDate: '',
};

export default function HostelListing() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState('rating');
  const [loading, setLoading] = useState(false);

  const filteredHostels = useMemo(() => {
    setLoading(true);
    let result = [...hostels];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.area.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q) ||
        h.facilities.some(f => f.toLowerCase().includes(q))
      );
    }

    if (filters.gender !== 'all') {
      result = result.filter(h => h.type === filters.gender || h.type === 'unisex');
    }

    if (filters.budget) {
      result = result.filter(h => {
        const cheapest = Math.min(...h.roomTypes.map(r => r.price));
        return cheapest >= filters.budget.min && cheapest <= filters.budget.max;
      });
    }

    if (filters.maxDistance < 10) {
      result = result.filter(h => h.distanceFromNMIMS <= filters.maxDistance);
    }

    if (filters.lease) {
      result = result.filter(h => h.leaseOptions.includes(filters.lease));
    }

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'priceLow':
        result.sort((a, b) => Math.min(...a.roomTypes.map(r => r.price)) - Math.min(...b.roomTypes.map(r => r.price)));
        break;
      case 'priceHigh':
        result.sort((a, b) => Math.min(...b.roomTypes.map(r => r.price)) - Math.min(...a.roomTypes.map(r => r.price)));
        break;
      case 'nearest':
        result.sort((a, b) => a.distanceFromNMIMS - b.distanceFromNMIMS);
        break;
    }

    setTimeout(() => setLoading(false), 300);
    return result;
  }, [search, filters, sortBy]);

  return (
    <PageTransition>
      <section className="bg-gradient-to-b from-brand-50 to-surface-50 py-10">
        <div className="section-padding">
          <FadeInSection>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{t('listing.title')}</h1>
            <p className="text-gray-500 mb-6">{t('listing.subtitle')}</p>
            <SearchBar onSearch={setSearch} className="max-w-2xl mb-4" />
          </FadeInSection>
        </div>
      </section>

      <section className="section-padding py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-72 flex-shrink-0">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters(defaultFilters)}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{filteredHostels.length}</span>{' '}
                {t('listing.results')}
              </p>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="rating">{t('listing.rating')}</option>
                  <option value="priceLow">{t('listing.priceLow')}</option>
                  <option value="priceHigh">{t('listing.priceHigh')}</option>
                  <option value="nearest">{t('listing.nearest')}</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : filteredHostels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHostels.map((hostel, i) => (
                  <HostelCard key={hostel.id} hostel={hostel} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏠</span>
                </div>
                <p className="text-gray-500 mb-4">{t('listing.noResults')}</p>
                <button
                  onClick={() => { setFilters(defaultFilters); setSearch(''); }}
                  className="btn-secondary text-sm"
                >
                  {t('listing.clearFilters')}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
