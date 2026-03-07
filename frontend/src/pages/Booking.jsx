import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Upload, CheckCircle, FileText, Camera, CreditCard,
  Calendar, Clock, AlertTriangle, PartyPopper
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { hostels } from '../data/hostels';
import PageTransition, { FadeInSection } from '../components/ui/PageTransition';
import Modal from '../components/ui/Modal';

const requiredDocs = [
  { key: 'aadhar', icon: CreditCard },
  { key: 'photo', icon: Camera },
  { key: 'collegeId', icon: FileText },
  { key: 'parentId', icon: FileText },
  { key: 'addressProof', icon: FileText },
  { key: 'medicalCert', icon: FileText },
];

export default function Booking() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addToast } = useToast();
  const hostel = hostels.find(h => h.slug === slug);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [moveInDate, setMoveInDate] = useState('');
  const [leaseDuration, setLeaseDuration] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  const allDocsUploaded = useMemo(() =>
    requiredDocs.every(d => uploadedDocs[d.key]),
    [uploadedDocs]
  );

  const isValid = selectedRoom && moveInDate && leaseDuration && allDocsUploaded;

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

  if (!user) {
    return (
      <PageTransition>
        <div className="section-padding py-20 text-center max-w-md mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sign In Required</h2>
            <p className="text-gray-500 mb-6">You need to be signed in to book a hostel room.</p>
            <p className="text-sm text-gray-400 mb-4">Use any email to sign in with our demo system</p>
            <Link to="/hostels" className="btn-primary">Back to Hostels</Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const room = hostel.roomTypes.find(r => r.type === selectedRoom);
  const isWaitlist = room && room.available === 0;

  const handleDocUpload = (docKey) => {
    setUploadedDocs(prev => ({ ...prev, [docKey]: true }));
    addToast(`Document uploaded successfully`, 'success');
  };

  const handleSubmit = () => {
    if (!isValid) return;
    setShowConfirm(true);
  };

  const confirmBooking = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setShowConfirm(false);
      setBookingResult({
        id: 'BK' + Date.now().toString(36).toUpperCase(),
        hostel: hostel.name,
        room: selectedRoom,
        moveIn: moveInDate,
        lease: leaseDuration,
        isWaitlist,
      });
    }, 1500);
  };

  if (bookingResult) {
    return (
      <PageTransition>
        <div className="section-padding py-20 max-w-lg mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm"
          >
            <div className={`w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center ${
              bookingResult.isWaitlist ? 'bg-amber-100' : 'bg-emerald-100'
            }`}>
              {bookingResult.isWaitlist ? (
                <Clock className="w-8 h-8 text-amber-600" />
              ) : (
                <PartyPopper className="w-8 h-8 text-emerald-600" />
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              {bookingResult.isWaitlist ? t('booking.waitlistSuccess') : t('booking.success')}
            </h2>
            <p className="text-gray-500 mb-6">
              {bookingResult.isWaitlist
                ? `You've been added to the waitlist for ${bookingResult.hostel}. We'll notify you when a room becomes available.`
                : `Your room at ${bookingResult.hostel} is confirmed! Check your dashboard for details.`
              }
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Booking ID</span>
                <span className="font-mono font-semibold text-gray-800">{bookingResult.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Room Type</span>
                <span className="text-gray-800">{bookingResult.room}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Move-in Date</span>
                <span className="text-gray-800">{new Date(bookingResult.moveIn).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Lease Duration</span>
                <span className="text-gray-800">{bookingResult.lease} months</span>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
              <Link to="/hostels" className="btn-secondary">Browse More</Link>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="section-padding py-6">
        <Link to={`/hostel/${hostel.slug}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to {hostel.name}
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{t('booking.title')}</h1>
          <p className="text-gray-500">Booking at <span className="font-semibold text-gray-700">{hostel.name}</span> · {hostel.area}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Room Selection */}
            <FadeInSection>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">{t('booking.selectRoom')}</h2>
                <div className="space-y-3">
                  {hostel.roomTypes.map((room) => (
                    <label
                      key={room.type}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedRoom === room.type
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="roomType"
                          value={room.type}
                          checked={selectedRoom === room.type}
                          onChange={() => setSelectedRoom(room.type)}
                          className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">{room.type}</p>
                          <p className="text-sm text-gray-500">
                            {room.available > 0
                              ? <span className="text-emerald-600">{room.available} rooms available</span>
                              : <span className="text-amber-600">Waitlist only</span>
                            }
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{room.price.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-500">/month</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </FadeInSection>

            {/* Date & Duration */}
            <FadeInSection delay={0.1}>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                      {t('booking.moveInDate')}
                    </label>
                    <input
                      type="date"
                      value={moveInDate}
                      onChange={e => setMoveInDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                      {t('booking.leaseDuration')}
                    </label>
                    <select
                      value={leaseDuration}
                      onChange={e => setLeaseDuration(e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select duration...</option>
                      {hostel.leaseOptions.map(opt => (
                        <option key={opt} value={opt}>{opt} months</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </FadeInSection>

            {/* Document Upload */}
            <FadeInSection delay={0.15}>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-1">{t('booking.docChecklist')}</h2>
                <p className="text-sm text-gray-500 mb-4">Upload scanned copies or photos of the following documents</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {requiredDocs.map(({ key, icon: Icon }) => {
                    const uploaded = uploadedDocs[key];
                    return (
                      <div
                        key={key}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                          uploaded ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-gray-50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          uploaded ? 'bg-emerald-100' : 'bg-gray-200'
                        }`}>
                          {uploaded ? (
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Icon className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{t(`booking.${key}`)}</p>
                          {uploaded && <p className="text-xs text-emerald-600">Uploaded</p>}
                        </div>
                        {!uploaded && (
                          <button
                            onClick={() => handleDocUpload(key)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            Upload
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeInSection>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <FadeInSection>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Booking Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Hostel</span>
                      <span className="font-medium text-gray-800">{hostel.name}</span>
                    </div>
                    {selectedRoom && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Room Type</span>
                        <span className="font-medium text-gray-800">{selectedRoom}</span>
                      </div>
                    )}
                    {moveInDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Move-in</span>
                        <span className="font-medium text-gray-800">{new Date(moveInDate).toLocaleDateString('en-IN')}</span>
                      </div>
                    )}
                    {leaseDuration && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duration</span>
                        <span className="font-medium text-gray-800">{leaseDuration} months</span>
                      </div>
                    )}
                    {selectedRoom && (
                      <>
                        <div className="pt-3 border-t border-gray-100">
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-700">Monthly Rent</span>
                            <span className="text-xl font-extrabold text-gray-900">
                              ₹{hostel.roomTypes.find(r => r.type === selectedRoom)?.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                          {leaseDuration && (
                            <div className="flex justify-between mt-1">
                              <span className="text-sm text-gray-500">Total ({leaseDuration} months)</span>
                              <span className="text-sm font-semibold text-gray-700">
                                ₹{(hostel.roomTypes.find(r => r.type === selectedRoom)?.price * Number(leaseDuration)).toLocaleString('en-IN')}
                              </span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <span className="text-gray-500">Documents</span>
                      <span className="font-medium text-gray-800">
                        {Object.keys(uploadedDocs).length}/{requiredDocs.length}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-brand-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(Object.keys(uploadedDocs).length / requiredDocs.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {isWaitlist && selectedRoom && (
                    <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>No rooms currently available for this type. You'll be added to the waitlist.</span>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!isValid}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      isValid
                        ? isWaitlist
                          ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20'
                          : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/20'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isWaitlist ? t('booking.waitlist') : t('booking.confirm')}
                  </button>

                  {!isValid && (
                    <p className="text-xs text-gray-400 mt-2 text-center">
                      Complete all fields and upload documents to proceed
                    </p>
                  )}
                </div>
              </FadeInSection>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirm} onClose={() => !submitting && setShowConfirm(false)} title="Confirm Booking" size="md">
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            {isWaitlist
              ? `You're about to join the waitlist for a ${selectedRoom} room at ${hostel.name}.`
              : `You're about to book a ${selectedRoom} room at ${hostel.name}.`
            }
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Monthly Rent</span>
              <span className="font-semibold">₹{room?.price.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Move-in</span>
              <span>{new Date(moveInDate).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Duration</span>
              <span>{leaseDuration} months</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={submitting}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={confirmBooking}
              disabled={submitting}
              className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all ${
                isWaitlist ? 'bg-amber-500 hover:bg-amber-600' : 'bg-brand-600 hover:bg-brand-700'
              } ${submitting ? 'opacity-60 cursor-wait' : ''}`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Processing...
                </span>
              ) : 'Confirm'}
            </button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
