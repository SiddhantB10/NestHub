import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star, MapPin, Wifi, Clock, Eye, ShieldCheck, Users, Phone, Mail,
  UtensilsCrossed, ArrowLeft, CheckCircle, AlertCircle, Navigation,
  Bus, Car, Footprints, Train, TrendingDown, BarChart3
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { hostels, getMarketComparison, calculateSavingsVsRent } from '../data/hostels';
import { calculateTravelCost } from '../utils/travelCost';
import PageTransition, { FadeInSection } from '../components/ui/PageTransition';
import ImageGallery from '../components/hostel/ImageGallery';
import { SkeletonDetail } from '../components/ui/Skeleton';

export default function HostelDetail() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const hostel = hostels.find(h => h.slug === slug);

  if (!hostel) {
    return (
      <PageTransition>
        <div className="section-padding py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hostel not found</h2>
          <Link to="/hostels" className="btn-primary">Back to Hostels</Link>
        </div>
      </PageTransition>
    );
  }

  const travel = calculateTravelCost(hostel.location.lat, hostel.location.lng);
  const totalAvailable = hostel.roomTypes.reduce((sum, r) => sum + r.available, 0);
  const typeLabel = hostel.type === 'boys' ? 'Boys Only' : hostel.type === 'girls' ? 'Girls Only' : 'Co-ed';
  const marketData = getMarketComparison(hostel.area);
  const cheapestRoom = Math.min(...hostel.roomTypes.map(r => r.price));
  const savings = calculateSavingsVsRent(cheapestRoom, hostel.area);

  return (
    <PageTransition>
      <div className="section-padding py-6">
        <Link to="/hostels" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to all hostels
        </Link>

        <ImageGallery images={hostel.images} name={hostel.name} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <FadeInSection>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    hostel.type === 'boys' ? 'bg-blue-100 text-blue-700' : hostel.type === 'girls' ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {typeLabel}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-gray-800">{hostel.rating}</span>
                    <span className="text-gray-400 text-sm">({hostel.totalReviews} reviews)</span>
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{hostel.name}</h1>
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{hostel.address}</span>
                  <span className="text-brand-600 font-medium">• {hostel.distanceFromNMIMS} km from NMIMS</span>
                </div>
                <p className="text-gray-600 leading-relaxed">{hostel.description}</p>
              </div>
            </FadeInSection>

            {/* Room Availability */}
            <FadeInSection delay={0.1}>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-brand-500" />
                  {t('detail.availability')}
                </h2>
                <div className="space-y-3">
                  {hostel.roomTypes.map((room, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-semibold text-gray-800">{room.type}</p>
                        <p className="text-sm text-gray-500">{room.available} {t('detail.available')} {t('detail.outOf')} {room.total} {t('detail.rooms')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">₹{room.price.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-500">{t('listing.perMonth')}</p>
                      </div>
                      <div className="ml-4">
                        {room.available > 0 ? (
                          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse-soft" title="Available" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-red-400" title="Full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInSection>

            {/* Market Rent Comparison */}
            {marketData && savings && (
              <FadeInSection delay={0.12}>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                    Market Rent Comparison
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Based on real rental data from {hostel.area}, Mumbai (200+ listings analyzed)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white/80 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">1BHK Apt Rent</p>
                      <p className="text-2xl font-bold text-gray-800">
                        ₹{(marketData.avg1BHK || marketData.minRent || 0).toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-gray-400">avg. in {hostel.area}</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">PG Starting At</p>
                      <p className="text-2xl font-bold text-emerald-700">
                        ₹{cheapestRoom.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-gray-400">per month</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">You Save</p>
                      <p className="text-2xl font-bold text-emerald-600 flex items-center justify-center gap-1">
                        <TrendingDown className="w-5 h-5" />
                        {savings.savingsPercent}%
                      </p>
                      <p className="text-xs text-gray-400">₹{savings.savings.toLocaleString('en-IN')}/mo vs apartment</p>
                    </div>
                  </div>
                  {marketData.note && (
                    <p className="text-xs text-teal-600 bg-teal-50 rounded-lg px-3 py-2 mt-2">
                      Note: {marketData.note}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700"
                        style={{ width: `${100 - savings.savingsPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">PG vs Apt rent</span>
                  </div>
                </div>
              </FadeInSection>
            )}

            {/* Food Menu */}
            <FadeInSection delay={0.15}>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-amber-500" />
                  {t('detail.foodMenu')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: t('detail.breakfast'), items: hostel.foodMenu.breakfast, emoji: '🌅' },
                    { label: t('detail.lunch'), items: hostel.foodMenu.lunch, emoji: '☀️' },
                    { label: t('detail.dinner'), items: hostel.foodMenu.dinner, emoji: '🌙' },
                  ].map((meal, i) => (
                    <div key={i} className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span>{meal.emoji}</span> {meal.label}
                      </h3>
                      <ul className="space-y-1">
                        {meal.items.map((item, j) => (
                          <li key={j} className="text-sm text-gray-600 flex items-start gap-1.5">
                            <span className="text-amber-400 mt-0.5">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInSection>

            {/* Facilities */}
            <FadeInSection delay={0.2}>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('detail.facilities')}</h2>
                <div className="flex flex-wrap gap-2">
                  {hostel.facilities.map((f, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 text-sm font-medium border border-brand-100">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </FadeInSection>

            {/* Policies */}
            <FadeInSection delay={0.25}>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('detail.policies')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
                    <Eye className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{t('detail.visitorPolicy')}</p>
                      <p className="text-sm text-gray-500 mt-1">{hostel.visitorPolicy}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
                    <Clock className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{t('detail.curfew')}</p>
                      <p className="text-sm text-gray-500 mt-1">{hostel.curfewTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
                    <Wifi className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{t('detail.internet')}</p>
                      <p className="text-sm text-gray-500 mt-1">{hostel.internetSpeed}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
                    <ShieldCheck className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{t('detail.satisfaction')}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${hostel.residentSatisfaction}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full rounded-full bg-emerald-500"
                          />
                        </div>
                        <span className="text-sm font-bold text-emerald-600">{hostel.residentSatisfaction}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>

            {/* House Rules */}
            <FadeInSection delay={0.3}>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('detail.rules')}</h2>
                <ul className="space-y-2">
                  {hostel.rules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeInSection>

            {/* Travel Cost Estimator */}
            <FadeInSection delay={0.35}>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-brand-500" />
                  {t('detail.travelCost')}
                </h2>
                <p className="text-sm text-gray-500 mb-4">Estimated travel cost & time from this hostel to NMIMS campus ({travel.distance} km)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-center">
                    <Car className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                    <p className="font-bold text-gray-800">₹{travel.auto.fare}</p>
                    <p className="text-xs text-gray-500">{travel.auto.time} min · Auto</p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-center">
                    <Bus className="w-5 h-5 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-gray-800">₹{travel.bus.fare}</p>
                    <p className="text-xs text-gray-500">{travel.bus.time} min · Bus</p>
                  </div>
                  {travel.metro && (
                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-center">
                      <Train className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                      <p className="font-bold text-gray-800">₹{travel.metro.fare}</p>
                      <p className="text-xs text-gray-500">{travel.metro.time} min · Metro</p>
                    </div>
                  )}
                  {travel.walking && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-center">
                      <Footprints className="w-5 h-5 text-amber-600 mx-auto mb-2" />
                      <p className="font-bold text-gray-800">Free</p>
                      <p className="text-xs text-gray-500">{travel.walking.time} min · Walk</p>
                    </div>
                  )}
                </div>
              </div>
            </FadeInSection>

            {/* Map Placeholder */}
            <FadeInSection delay={0.4}>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-500" />
                  {t('detail.location')}
                </h2>
                <div className="rounded-xl overflow-hidden bg-gray-100 h-64 flex items-center justify-center relative">
                  <iframe
                    title="Hostel Location"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${hostel.location.lat},${hostel.location.lng}&zoom=15`}
                    allowFullScreen
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3">{hostel.address} · {hostel.distanceFromNMIMS} km from NMIMS CIS</p>
              </div>
            </FadeInSection>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-5">
              <FadeInSection>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Starting from</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-gray-900">
                        ₹{Math.min(...hostel.roomTypes.map(r => r.price)).toLocaleString('en-IN')}
                      </span>
                      <span className="text-gray-500">/month</span>
                    </div>
                  </div>

                  {totalAvailable > 0 ? (
                    <Link
                      to={`/booking/${hostel.slug}`}
                      className="btn-primary w-full text-center block mb-3"
                    >
                      {t('detail.bookNow')}
                    </Link>
                  ) : (
                    <Link
                      to={`/booking/${hostel.slug}`}
                      className="w-full text-center block px-6 py-3 rounded-xl font-semibold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors mb-3"
                    >
                      {t('detail.joinWaitlist')}
                    </Link>
                  )}

                  <p className="text-xs text-gray-400 text-center">No payment required to book</p>
                </div>
              </FadeInSection>

              <FadeInSection delay={0.1}>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3">{t('detail.leaseOptions')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {hostel.leaseOptions.map(opt => (
                      <span key={opt} className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 text-sm font-medium border border-gray-100">
                        {opt} months
                      </span>
                    ))}
                  </div>
                </div>
              </FadeInSection>

              <FadeInSection delay={0.15}>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3">{t('detail.contact')}</h3>
                  <div className="space-y-3">
                    <a href={`tel:${hostel.contactPhone}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-brand-600 transition-colors">
                      <Phone className="w-4 h-4" />
                      {hostel.contactPhone}
                    </a>
                    <a href={`mailto:${hostel.contactEmail}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-brand-600 transition-colors">
                      <Mail className="w-4 h-4" />
                      {hostel.contactEmail}
                    </a>
                  </div>
                </div>
              </FadeInSection>

              <FadeInSection delay={0.2}>
                <div className="bg-gradient-to-br from-brand-50 to-purple-50 rounded-2xl border border-brand-100 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-5 h-5 text-brand-600" />
                    <h3 className="font-semibold text-brand-900">{t('detail.satisfaction')}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-4xl font-extrabold text-brand-700">{hostel.residentSatisfaction}%</div>
                    <p className="text-sm text-brand-600">of residents recommend this hostel</p>
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
