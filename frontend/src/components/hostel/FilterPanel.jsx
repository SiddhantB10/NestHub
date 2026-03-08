import { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const budgetRanges = [
  { label: 'Under ₹10,000', min: 0, max: 10000 },
  { label: '₹10,000 - ₹15,000', min: 10000, max: 15000 },
  { label: '₹15,000 - ₹20,000', min: 15000, max: 20000 },
  { label: '₹20,000 - ₹30,000', min: 20000, max: 30000 },
  { label: '₹30,000+', min: 30000, max: 100000 },
];

const distanceOptions = [
  { label: 'Under 0.5 km', value: 0.5 },
  { label: 'Under 1 km', value: 1 },
  { label: 'Under 2 km', value: 2 },
  { label: 'Under 3 km', value: 3 },
  { label: 'Any distance', value: 10 },
];

const leaseOptions = [
  { label: '3 months', value: 3 },
  { label: '6 months', value: 6 },
  { label: '11 months', value: 11 },
  { label: '12 months', value: 12 },
];

export default function FilterPanel({ filters, onChange, onClear }) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasActiveFilters = filters.gender !== 'all' || filters.budget || filters.maxDistance !== 10 || filters.lease || filters.moveInDate;

  const FilterContent = () => (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">{t('listing.gender')}</label>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { value: 'all', label: t('listing.all') },
            { value: 'boys', label: t('listing.boys') },
            { value: 'girls', label: t('listing.girls') },
            { value: 'unisex', label: t('listing.unisex') },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filters, gender: opt.value })}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                filters.gender === opt.value
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">{t('listing.budget')}</label>
        <div className="space-y-1.5">
          {budgetRanges.map(range => (
            <button
              key={range.label}
              onClick={() => onChange({ ...filters, budget: filters.budget?.max === range.max ? null : range })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                filters.budget?.max === range.max
                  ? 'bg-brand-50 text-brand-700 font-medium ring-1 ring-brand-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">{t('listing.distance')}</label>
        <div className="space-y-1.5">
          {distanceOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filters, maxDistance: opt.value })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                filters.maxDistance === opt.value
                  ? 'bg-brand-50 text-brand-700 font-medium ring-1 ring-brand-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">{t('listing.lease')}</label>
        <div className="grid grid-cols-2 gap-1.5">
          {leaseOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filters, lease: filters.lease === opt.value ? null : opt.value })}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                filters.lease === opt.value
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {opt.value} {t('listing.months')}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">{t('listing.moveIn')}</label>
        <input
          type="date"
          value={filters.moveInDate || ''}
          onChange={e => onChange({ ...filters, moveInDate: e.target.value })}
          className="input-field text-sm"
        />
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
          {t('listing.clearFilters')}
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="hidden lg:block">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-600" />
              <span className="font-semibold text-gray-900">{t('listing.filters')}</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-brand-500" />
              )}
            </div>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 border-t border-gray-50 pt-4">
                  <FilterContent />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t('listing.filters')}
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-brand-500" />}
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-80 bg-white p-5 overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-lg">{t('listing.filters')}</h3>
                  <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-gray-100">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterContent />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
