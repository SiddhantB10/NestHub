import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Clock, Shield, BarChart3, Users, Wrench, Search,
  Star, Building2, MapPin, Sparkles, CheckCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { hostels, testimonials, mumbaiMarketData } from '../data/hostels';
import PageTransition, { FadeInSection, StaggerContainer, StaggerItem } from '../components/ui/PageTransition';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import SearchBar from '../components/hostel/SearchBar';
import HostelCard from '../components/hostel/HostelCard';

export default function Landing() {
  const { t } = useLanguage();
  const featuredHostels = hostels.slice(0, 3);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-400/5 rounded-full blur-3xl" />
          <svg className="absolute bottom-0 left-0 right-0 text-surface-50" viewBox="0 0 1440 120" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,64 C360,120 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,120 L0,120 Z" />
          </svg>
        </div>

        <div className="relative section-padding py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium text-white/90">Trusted by 2,000+ NMIMS students</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
            >
              {t('hero.title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-white/75 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-xl mx-auto mb-8"
            >
              <SearchBar />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-3 text-sm text-white/60"
            >
              <span>Popular:</span>
              {['Vile Parle', 'Under ₹15k', 'Girls PG', 'Near Campus'].map(tag => (
                <Link
                  key={tag}
                  to={`/hostels?search=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-1 bg-surface-50">
        <div className="section-padding py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 2450, suffix: '+', label: t('stats.studentsHoused'), icon: Users },
              { value: 12, suffix: '+', label: t('stats.hostelsListed'), icon: Building2 },
              { value: 4.5, suffix: '', label: t('stats.avgRating'), icon: Star, isDecimal: true },
              { value: 200, suffix: '+', label: 'Mumbai Listings Analyzed', icon: MapPin },
            ].map((stat, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div className="text-center p-5 rounded-2xl bg-white shadow-sm border border-gray-100">
                  <stat.icon className="w-6 h-6 text-brand-500 mx-auto mb-3" />
                  <div className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
                    {stat.isDecimal ? (
                      <span>4.5</span>
                    ) : (
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Mumbai Market Insights Banner */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-10">
        <div className="section-padding">
          <FadeInSection>
            <div className="text-center text-white mb-6">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Data-Backed Pricing from Real Mumbai Rentals</h2>
              <p className="text-emerald-100 max-w-xl mx-auto text-sm">Our PG prices are benchmarked against {mumbaiMarketData.totalListings}+ actual apartment rental listings across Mumbai</p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: 'Avg 1BHK Near NMIMS', value: `₹${mumbaiMarketData.nmimsAreaStats.avg1BHKRent.toLocaleString('en-IN')}` },
              { label: 'PG Starting Price', value: `₹7,500` },
              { label: 'Areas Analyzed', value: `${Object.keys(mumbaiMarketData.areaRents).length}+` },
              { label: 'Save Up To', value: '68%' },
            ].map((item, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-3 py-4 border border-white/20">
                  <p className="text-xl md:text-2xl font-extrabold text-white">{item.value}</p>
                  <p className="text-xs text-emerald-100 mt-1">{item.label}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="section-padding">
          <FadeInSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{t('howItWorks.title')}</h2>
              <div className="w-16 h-1 bg-brand-500 rounded-full mx-auto" />
            </div>
          </FadeInSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto" staggerDelay={0.15}>
            {[
              { step: '01', icon: Search, title: t('howItWorks.step1'), desc: t('howItWorks.step1Desc'), color: 'from-blue-500 to-brand-600' },
              { step: '02', icon: BarChart3, title: t('howItWorks.step2'), desc: t('howItWorks.step2Desc'), color: 'from-brand-500 to-purple-600' },
              { step: '03', icon: CheckCircle, title: t('howItWorks.step3'), desc: t('howItWorks.step3Desc'), color: 'from-purple-500 to-pink-500' },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <div className="relative text-center group">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 md:right-4 w-8 h-8 rounded-full bg-accent-100 text-accent-700 text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Hostels */}
      <section className="bg-surface-50 py-20">
        <div className="section-padding">
          <FadeInSection>
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Featured Stays</h2>
                <p className="text-gray-500">Hand-picked hostels loved by current residents</p>
              </div>
              <Link
                to="/hostels"
                className="hidden sm:flex items-center gap-1.5 text-brand-600 font-semibold hover:text-brand-700 transition-colors group"
              >
                View all hostels
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHostels.map((hostel, i) => (
              <HostelCard key={hostel.id} hostel={hostel} index={i} />
            ))}
          </div>

          <div className="sm:hidden mt-6 text-center">
            <Link to="/hostels" className="btn-primary inline-flex items-center gap-2">
              View All Hostels <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="section-padding">
          <FadeInSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{t('features.title')}</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">{t('features.subtitle')}</p>
            </div>
          </FadeInSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
            {[
              { icon: Clock, title: t('features.realtime'), desc: t('features.realtimeDesc'), color: 'bg-blue-50 text-blue-600' },
              { icon: Shield, title: t('features.verified'), desc: t('features.verifiedDesc'), color: 'bg-emerald-50 text-emerald-600' },
              { icon: BarChart3, title: t('features.compare'), desc: t('features.compareDesc'), color: 'bg-purple-50 text-purple-600' },
              { icon: CheckCircle, title: t('features.secure'), desc: t('features.secureDesc'), color: 'bg-amber-50 text-amber-600' },
              { icon: Users, title: t('features.parent'), desc: t('features.parentDesc'), color: 'bg-pink-50 text-pink-600' },
              { icon: Wrench, title: t('features.maintenance'), desc: t('features.maintenanceDesc'), color: 'bg-orange-50 text-orange-600' },
            ].map((feature, i) => (
              <StaggerItem key={i}>
                <div className="p-6 rounded-2xl border border-gray-100 hover:border-brand-100 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300 group bg-white">
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative section-padding">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3">{t('testimonials.title')}</h2>
              <div className="w-16 h-1 bg-brand-400 rounded-full mx-auto" />
            </div>
          </FadeInSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
            {testimonials.slice(0, 6).map((item) => (
              <StaggerItem key={item.id}>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-purple-400 flex items-center justify-center text-sm font-bold text-white">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{item.name}</p>
                      <p className="text-xs text-white/60">{item.course}</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed mb-3">{item.text}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-white/50">at {item.hostel}</span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface-50 py-20">
        <div className="section-padding">
          <FadeInSection>
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-600 to-purple-600 p-10 md:p-16 text-center text-white">
              <div className="absolute inset-0">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
              </div>
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to find your home away from home?</h2>
                <p className="text-white/80 mb-8 max-w-xl mx-auto">Join thousands of NMIMS students who found their perfect stay through our platform. No brokers, no hidden charges.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/hostels"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-brand-700 font-bold hover:bg-gray-50 transition-colors shadow-lg"
                  >
                    {t('hero.cta')}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/parent-access"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/15 text-white font-bold hover:bg-white/25 transition-colors border border-white/20"
                  >
                    {t('nav.parents')}
                  </Link>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </PageTransition>
  );
}
