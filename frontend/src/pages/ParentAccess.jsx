import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, MapPin, Phone, Mail, Clock, Wifi, Eye, Star,
  Users, CheckCircle, Home, User, GraduationCap, LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { hostels } from '../data/hostels';
import PageTransition, { FadeInSection } from '../components/ui/PageTransition';

export default function ParentAccess() {
  const { user, loginAsParent, logout } = useAuth();
  const { t } = useLanguage();
  const [accessCode, setAccessCode] = useState('');

  const isParent = user?.role === 'parent';
  const childHostel = isParent ? hostels.find(h => h.slug === 'horizon-heights-pg') : null;

  const handleParentLogin = (e) => {
    e.preventDefault();
    loginAsParent();
  };

  if (!isParent) {
    return (
      <PageTransition>
        <div className="section-padding py-16">
          <div className="max-w-lg mx-auto">
            <FadeInSection>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-brand-600" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{t('parent.title')}</h1>
                <p className="text-gray-500">{t('parent.subtitle')}</p>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.1}>
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <form onSubmit={handleParentLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Parent Email</label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="your.email@example.com"
                      defaultValue="rajesh.mehta@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Access Code</label>
                    <input
                      type="text"
                      value={accessCode}
                      onChange={e => setAccessCode(e.target.value)}
                      className="input-field"
                      placeholder="Enter code shared by your child"
                      defaultValue="STAY2025"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">Your child can generate an access code from their dashboard</p>
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    {t('parent.login')}
                  </button>
                </form>
                <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-xs text-blue-700">
                    <strong>Demo:</strong> Click "Access Dashboard" to view the parent portal with sample data for student Arjun Mehta.
                  </p>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="section-padding py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{t('parent.title')}</h1>
            <p className="text-gray-500">Welcome, {user.name}</p>
          </div>
          <button onClick={logout} className="btn-secondary text-sm">Sign Out</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Info */}
          <FadeInSection>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-500" />
                {t('parent.childInfo')}
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user.childName || 'Arjun Mehta'}</p>
                    <p className="text-sm text-gray-500">B.Tech Computer Science, Year 2</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-500">Student ID</span>
                    <span className="font-mono text-gray-700">NMIMS2024CS089</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-500">Phone</span>
                    <span className="text-gray-700">+91 98765 43210</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-500">Email</span>
                    <span className="text-gray-700">arjun.mehta@nmims.edu</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>

          {/* Hostel Details */}
          <FadeInSection delay={0.1}>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-brand-500" />
                {t('parent.hostelDetails')}
              </h2>
              {childHostel ? (
                <div>
                  <img
                    src={childHostel.images[0]}
                    alt={childHostel.name}
                    className="w-full h-32 rounded-xl object-cover mb-3"
                  />
                  <h3 className="font-bold text-gray-800">{childHostel.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {childHostel.address}
                  </p>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-500">Room Type</span>
                      <span className="text-gray-700">Double Sharing</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-500">Monthly Rent</span>
                      <span className="font-semibold text-gray-700">₹12,000</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-500">Distance from NMIMS</span>
                      <span className="text-gray-700">{childHostel.distanceFromNMIMS} km</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-gray-500">Rating</span>
                      <span className="flex items-center gap-1 text-gray-700">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {childHostel.rating}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {childHostel.facilities.slice(0, 6).map((f, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-gray-50 text-xs text-gray-600">{f}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No hostel booking found.</p>
              )}
            </div>
          </FadeInSection>

          {/* Safety Info & Status */}
          <div className="space-y-6">
            <FadeInSection delay={0.15}>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  {t('parent.safety')}
                </h2>
                {childHostel && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50">
                      <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-emerald-800">24/7 Security</p>
                        <p className="text-xs text-emerald-600">CCTV surveillance and security guards</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                      <Clock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Curfew: {childHostel.curfewTime}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                      <Eye className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Visitor Policy</p>
                        <p className="text-xs text-gray-500">{childHostel.visitorPolicy}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                      <Wifi className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Internet: {childHostel.internetSpeed}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  {t('parent.status')}
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-soft" />
                    <span className="text-sm font-medium text-emerald-800">Currently residing at hostel</span>
                  </div>
                  <p className="text-sm text-emerald-600">
                    Lease active until May 31, 2026 · All payments up to date
                  </p>
                  <div className="mt-3 pt-3 border-t border-emerald-200">
                    <p className="text-sm text-emerald-700">
                      <span className="font-semibold">Resident Satisfaction:</span> {childHostel?.residentSatisfaction}% positive
                    </p>
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.25}>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Emergency Contact</h3>
                {childHostel && (
                  <div className="space-y-2">
                    <a href={`tel:${childHostel.contactPhone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-600">
                      <Phone className="w-4 h-4" /> {childHostel.contactPhone}
                    </a>
                    <a href={`mailto:${childHostel.contactEmail}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-600">
                      <Mail className="w-4 h-4" /> {childHostel.contactEmail}
                    </a>
                  </div>
                )}
              </div>
            </FadeInSection>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
