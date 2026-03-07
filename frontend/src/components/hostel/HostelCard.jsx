import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Wifi, Users, ArrowRight, TrendingDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function HostelCard({ hostel, index = 0 }) {
  const { t } = useLanguage();
  const cheapestRoom = Math.min(...hostel.roomTypes.map(r => r.price));
  const totalAvailable = hostel.roomTypes.reduce((sum, r) => sum + r.available, 0);
  const typeLabel = hostel.type === 'boys' ? 'Boys' : hostel.type === 'girls' ? 'Girls' : 'Co-ed';
  const typeColor = hostel.type === 'boys' ? 'bg-blue-100 text-blue-700' : hostel.type === 'girls' ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700';
  const savingsPercent = hostel.marketBenchmark?.avg1BHK
    ? Math.round(((hostel.marketBenchmark.avg1BHK - cheapestRoom) / hostel.marketBenchmark.avg1BHK) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
    >
      <div className="relative overflow-hidden">
        <img
          src={hostel.images[0]}
          alt={hostel.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${typeColor} backdrop-blur-sm`}>
            {typeLabel}
          </span>
          {totalAvailable === 0 && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700">
              Waitlist Only
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-sm font-semibold text-gray-800">{hostel.rating}</span>
          <span className="text-xs text-gray-500">({hostel.totalReviews})</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-brand-700 transition-colors">
          {hostel.name}
        </h3>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {hostel.distanceFromNMIMS} {t('listing.km')}
          </span>
          <span className="flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5" />
            {hostel.internetSpeed}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {hostel.facilities.slice(0, 4).map(f => (
            <span key={f} className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded-md font-medium">
              {f}
            </span>
          ))}
          {hostel.facilities.length > 4 && (
            <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-md">
              +{hostel.facilities.length - 4} more
            </span>
          )}
        </div>

        <div className="flex items-end justify-between pt-3 border-t border-gray-50">
          <div>
            <span className="text-xs text-gray-500">{t('listing.from')}</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-gray-900">₹{cheapestRoom.toLocaleString('en-IN')}</span>
              <span className="text-sm text-gray-500">{t('listing.perMonth')}</span>
            </div>
            {savingsPercent > 0 && (
              <span className="inline-flex items-center gap-0.5 text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 font-medium">
                <TrendingDown className="w-3 h-3" />
                {savingsPercent}% less than 1BHK apt
              </span>
            )}
          </div>
          <Link
            to={`/hostels/${hostel.slug}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-50 text-brand-700 text-sm font-semibold hover:bg-brand-100 transition-colors group/btn"
          >
            {t('listing.viewDetails')}
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
