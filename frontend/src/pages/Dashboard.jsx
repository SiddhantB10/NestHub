import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Wrench, CreditCard, CalendarClock, Plus, Download, ChevronDown,
  CheckCircle, Clock, AlertCircle, MapPin, Phone, ArrowRight, LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { hostels } from '../data/hostels';
import PageTransition, { FadeInSection } from '../components/ui/PageTransition';
import Modal from '../components/ui/Modal';

const maintenanceCategories = ['Plumbing', 'Electrical', 'Furniture', 'Cleaning', 'Internet', 'AC/Heating', 'Other'];
const priorityOptions = ['low', 'medium', 'high'];

const demoMaintenance = [
  { id: 1, title: 'AC not cooling properly', category: 'AC/Heating', priority: 'high', status: 'in-progress', createdAt: '2025-01-10', updatedAt: '2025-01-11' },
  { id: 2, title: 'Bathroom tap leaking', category: 'Plumbing', priority: 'medium', status: 'resolved', createdAt: '2024-12-20', updatedAt: '2025-01-02' },
  { id: 3, title: 'WiFi speed is slow on 3rd floor', category: 'Internet', priority: 'low', status: 'pending', createdAt: '2025-01-12', updatedAt: '2025-01-12' },
];

const demoPayments = [
  { id: 1, month: 'January 2025', amount: 12000, status: 'paid', paidOn: '2025-01-05', receiptId: 'RCP-2025-001' },
  { id: 2, month: 'December 2024', amount: 12000, status: 'paid', paidOn: '2024-12-03', receiptId: 'RCP-2024-012' },
  { id: 3, month: 'November 2024', amount: 12000, status: 'paid', paidOn: '2024-11-04', receiptId: 'RCP-2024-011' },
  { id: 4, month: 'October 2024', amount: 12000, status: 'paid', paidOn: '2024-10-02', receiptId: 'RCP-2024-010' },
];

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  resolved: 'bg-emerald-100 text-emerald-700',
};

export default function Dashboard() {
  const { user, login } = useAuth();
  const { t } = useLanguage();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('hostel');
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [requests, setRequests] = useState(demoMaintenance);
  const [requestForm, setRequestForm] = useState({ title: '', category: '', priority: 'medium', description: '' });

  const currentHostel = useMemo(() => {
    if (!user?.currentHostel) return null;
    return hostels.find(h => h.slug === user.currentHostel);
  }, [user]);

  if (!user || user.role === 'parent') {
    return (
      <PageTransition>
        <div className="section-padding py-20 text-center max-w-md mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <LogIn className="w-12 h-12 text-brand-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t('dashboard.title')}</h2>
            <p className="text-gray-500 mb-6">Sign in to access your student dashboard</p>
            <button
              onClick={() => login('arjun@nmims.edu', 'demo')}
              className="btn-primary"
            >
              Sign In as Demo Student
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const leaseEnd = user.leaseEndDate ? new Date(user.leaseEndDate) : null;
  const daysRemaining = leaseEnd ? Math.max(0, Math.ceil((leaseEnd - new Date()) / (1000 * 60 * 60 * 24))) : null;

  const tabs = [
    { key: 'hostel', label: t('dashboard.currentHostel'), icon: Home },
    { key: 'maintenance', label: t('dashboard.maintenance'), icon: Wrench },
    { key: 'payments', label: t('dashboard.payments'), icon: CreditCard },
  ];

  const handleNewRequest = () => {
    if (!requestForm.title || !requestForm.category) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    const newReq = {
      id: Date.now(),
      ...requestForm,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setRequests(prev => [newReq, ...prev]);
    setRequestForm({ title: '', category: '', priority: 'medium', description: '' });
    setShowNewRequest(false);
    addToast('Maintenance request submitted!', 'success');
  };

  const handleDownloadReceipt = (receiptId) => {
    addToast(`Downloading receipt ${receiptId}...`, 'info');
  };

  return (
    <PageTransition>
      <div className="section-padding py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{t('dashboard.title')}</h1>
          <p className="text-gray-500">Welcome back, {user.name}</p>
        </div>

        {/* Move-out Reminder */}
        {daysRemaining !== null && daysRemaining <= 60 && (
          <FadeInSection>
            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
              daysRemaining <= 14 ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'
            }`}>
              <CalendarClock className={`w-6 h-6 flex-shrink-0 ${daysRemaining <= 14 ? 'text-red-500' : 'text-amber-500'}`} />
              <div>
                <p className={`font-semibold text-sm ${daysRemaining <= 14 ? 'text-red-800' : 'text-amber-800'}`}>
                  {t('dashboard.moveOutReminder')}
                </p>
                <p className={`text-sm ${daysRemaining <= 14 ? 'text-red-600' : 'text-amber-600'}`}>
                  <span className="font-bold">{daysRemaining}</span> {t('dashboard.daysRemaining')}
                  {leaseEnd && ` (${leaseEnd.toLocaleDateString('en-IN')})`}
                </p>
              </div>
            </div>
          </FadeInSection>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-full sm:w-fit overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Current Hostel Tab */}
          {activeTab === 'hostel' && (
            <motion.div key="hostel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {currentHostel ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={currentHostel.images[0]}
                        alt={currentHostel.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900">{currentHostel.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {currentHostel.area}
                        </p>
                        <p className="text-sm text-brand-600 mt-1">{currentHostel.distanceFromNMIMS} km from NMIMS</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray-500">Room Type</span>
                        <span className="font-medium text-gray-800">Double Sharing</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray-500">Monthly Rent</span>
                        <span className="font-medium text-gray-800">₹12,000</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray-500">Move-in Date</span>
                        <span className="font-medium text-gray-800">{user.moveInDate ? new Date(user.moveInDate).toLocaleDateString('en-IN') : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500">Lease End</span>
                        <span className="font-medium text-gray-800">{user.leaseEndDate ? new Date(user.leaseEndDate).toLocaleDateString('en-IN') : 'N/A'}</span>
                      </div>
                    </div>
                    <Link
                      to={`/hostel/${currentHostel.slug}`}
                      className="mt-4 flex items-center gap-1 text-sm text-brand-600 font-medium hover:text-brand-700"
                    >
                      View Full Details <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Quick Contact</h3>
                    <div className="space-y-3">
                      <a href={`tel:${currentHostel.contactPhone}`} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">Hostel Manager</p>
                          <p className="text-xs text-gray-500">{currentHostel.contactPhone}</p>
                        </div>
                      </a>
                    </div>
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Today's Menu</h4>
                      <div className="space-y-2">
                        {[
                          { label: 'Breakfast', items: currentHostel.foodMenu.breakfast.slice(0, 2) },
                          { label: 'Lunch', items: currentHostel.foodMenu.lunch.slice(0, 2) },
                          { label: 'Dinner', items: currentHostel.foodMenu.dinner.slice(0, 2) },
                        ].map(meal => (
                          <div key={meal.label} className="text-sm">
                            <span className="text-gray-500">{meal.label}:</span>{' '}
                            <span className="text-gray-700">{meal.items.join(', ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 shadow-sm text-center">
                  <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No Active Booking</h3>
                  <p className="text-gray-500 mb-4">{t('dashboard.noHostel')}</p>
                  <Link to="/hostels" className="btn-primary">Browse Hostels</Link>
                </div>
              )}
            </motion.div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <motion.div key="maintenance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">{t('dashboard.maintenance')}</h2>
                <button
                  onClick={() => setShowNewRequest(true)}
                  className="btn-primary text-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> {t('dashboard.newRequest')}
                </button>
              </div>
              <div className="space-y-3">
                {requests.map(req => (
                  <div key={req.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${
                      req.status === 'resolved' ? 'bg-emerald-100' : req.status === 'in-progress' ? 'bg-blue-100' : 'bg-amber-100'
                    }`}>
                      {req.status === 'resolved' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> :
                       req.status === 'in-progress' ? <Clock className="w-5 h-5 text-blue-600" /> :
                       <AlertCircle className="w-5 h-5 text-amber-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{req.title}</p>
                      <p className="text-xs text-gray-500">
                        {req.category} · Reported {req.createdAt}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${statusColors[req.status]}`}>
                        {req.status}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        req.priority === 'high' ? 'text-red-600' : req.priority === 'medium' ? 'text-amber-600' : 'text-gray-500'
                      }`}>
                        {req.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* New Request Modal */}
              <Modal isOpen={showNewRequest} onClose={() => setShowNewRequest(false)} title="New Maintenance Request" size="md">
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title *</label>
                    <input
                      type="text"
                      value={requestForm.title}
                      onChange={e => setRequestForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. AC not working"
                      className="input-field"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        value={requestForm.category}
                        onChange={e => setRequestForm(f => ({ ...f, category: e.target.value }))}
                        className="input-field"
                      >
                        <option value="">Select...</option>
                        {maintenanceCategories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        value={requestForm.priority}
                        onChange={e => setRequestForm(f => ({ ...f, priority: e.target.value }))}
                        className="input-field"
                      >
                        {priorityOptions.map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={requestForm.description}
                      onChange={e => setRequestForm(f => ({ ...f, description: e.target.value }))}
                      rows={3}
                      placeholder="Describe the issue in detail..."
                      className="input-field resize-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowNewRequest(false)} className="btn-secondary flex-1">Cancel</button>
                    <button onClick={handleNewRequest} className="btn-primary flex-1">Submit Request</button>
                  </div>
                </div>
              </Modal>
            </motion.div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <motion.div key="payments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h2 className="text-lg font-bold text-gray-900 mb-4">{t('dashboard.payments')}</h2>
              {/* Mobile: Card view */}
              <div className="md:hidden space-y-3">
                {demoPayments.map(payment => (
                  <div key={payment.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800 text-sm">{payment.month}</span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700 capitalize">{payment.status}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">₹{payment.amount.toLocaleString('en-IN')}</span>
                      <span className="text-gray-400 text-xs">{new Date(payment.paidOn).toLocaleDateString('en-IN')}</span>
                    </div>
                    <button
                      onClick={() => handleDownloadReceipt(payment.receiptId)}
                      className="mt-2 flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium"
                    >
                      <Download className="w-4 h-4" /> {t('dashboard.downloadReceipt')}
                    </button>
                  </div>
                ))}
              </div>
              {/* Desktop: Table view */}
              <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Month</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paid On</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {demoPayments.map(payment => (
                        <tr key={payment.id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">{payment.month}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">₹{payment.amount.toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700 capitalize">
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{new Date(payment.paidOn).toLocaleDateString('en-IN')}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDownloadReceipt(payment.receiptId)}
                              className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium"
                            >
                              <Download className="w-4 h-4" /> {t('dashboard.downloadReceipt')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
