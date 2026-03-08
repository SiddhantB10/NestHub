import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Building2, Wrench, Users, Plus, Edit, Trash2,
  CheckCircle, Clock, AlertCircle, Eye, LogIn, X, Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { hostels as allHostels } from '../data/hostels';
import PageTransition, { FadeInSection } from '../components/ui/PageTransition';
import Modal from '../components/ui/Modal';

const demoBookings = [
  { id: 1, student: 'Arjun Mehta', hostel: 'Horizon Heights PG', room: 'Double Sharing', status: 'confirmed', moveIn: '2025-07-15' },
  { id: 2, student: 'Priya Sharma', hostel: 'Serenity Women\'s Hostel', room: 'Single', status: 'confirmed', moveIn: '2025-08-01' },
  { id: 3, student: 'Rahul Patel', hostel: 'Urban Nest Student Living', room: 'Triple Sharing', status: 'waitlisted', moveIn: '2025-07-20' },
  { id: 4, student: 'Sneha Iyer', hostel: 'Comfort Zone PG', room: 'Double Sharing', status: 'pending', moveIn: '2025-09-01' },
  { id: 5, student: 'Karan Singh', hostel: 'Sai Krupa Hostel', room: 'Single', status: 'confirmed', moveIn: '2025-07-15' },
];

const demoMaintenanceRequests = [
  { id: 1, student: 'Arjun Mehta', hostel: 'Horizon Heights PG', title: 'AC not cooling', priority: 'high', status: 'in-progress', date: '2025-01-10' },
  { id: 2, student: 'Priya Sharma', hostel: 'Serenity Women\'s Hostel', title: 'Window latch broken', priority: 'medium', status: 'pending', date: '2025-01-12' },
  { id: 3, student: 'Rahul Patel', hostel: 'Urban Nest Student Living', title: 'WiFi connectivity issues', priority: 'low', status: 'resolved', date: '2025-01-08' },
  { id: 4, student: 'Sneha Iyer', hostel: 'Comfort Zone PG', title: 'Hot water not working', priority: 'high', status: 'pending', date: '2025-01-13' },
];

const statusBadge = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  waitlisted: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  resolved: 'bg-emerald-100 text-emerald-700',
};

export default function AdminPanel() {
  const { user, login } = useAuth();
  const { t } = useLanguage();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [hostels, setHostels] = useState(allHostels);
  const [maintenanceList, setMaintenanceList] = useState(demoMaintenanceRequests);
  const [bookings, setBookings] = useState(demoBookings);
  const [editingHostel, setEditingHostel] = useState(null);
  const [showHostelForm, setShowHostelForm] = useState(false);
  const [hostelForm, setHostelForm] = useState({
    name: '', type: 'unisex', area: '', description: '',
  });

  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return (
      <PageTransition>
        <div className="section-padding py-20 text-center max-w-md mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <LogIn className="w-12 h-12 text-brand-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
            <p className="text-gray-500 mb-6">Sign in with admin credentials to access the panel.</p>
            <button
              onClick={() => login('admin@nesthub.com', 'admin')}
              className="btn-primary"
            >
              Sign In as Admin
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const stats = {
    totalHostels: hostels.length,
    totalRooms: hostels.reduce((sum, h) => sum + h.roomTypes.reduce((s, r) => s + r.total, 0), 0),
    availableRooms: hostels.reduce((sum, h) => sum + h.roomTypes.reduce((s, r) => s + r.available, 0), 0),
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    pendingMaintenance: maintenanceList.filter(m => m.status === 'pending').length,
    occupancyRate: Math.round((1 - hostels.reduce((sum, h) => sum + h.roomTypes.reduce((s, r) => s + r.available, 0), 0) / hostels.reduce((sum, h) => sum + h.roomTypes.reduce((s, r) => s + r.total, 0), 0)) * 100),
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'hostels', label: 'Hostels', icon: Building2 },
    { key: 'bookings', label: 'Bookings', icon: Users },
    { key: 'maintenance', label: 'Maintenance', icon: Wrench },
  ];

  const handleMaintenanceStatusUpdate = (id, newStatus) => {
    setMaintenanceList(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
    addToast(`Request updated to ${newStatus}`, 'success');
  };

  const handleBookingStatusUpdate = (id, newStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    addToast(`Booking ${newStatus}`, 'success');
  };

  const handleSaveHostel = () => {
    if (!hostelForm.name || !hostelForm.area) {
      addToast('Please fill required fields', 'error');
      return;
    }
    if (editingHostel) {
      setHostels(prev => prev.map(h => h.id === editingHostel.id ? { ...h, ...hostelForm } : h));
      addToast('Hostel updated', 'success');
    } else {
      addToast('Hostel added (demo)', 'success');
    }
    setShowHostelForm(false);
    setEditingHostel(null);
    setHostelForm({ name: '', type: 'unisex', area: '', description: '' });
  };

  const openEditHostel = (hostel) => {
    setEditingHostel(hostel);
    setHostelForm({ name: hostel.name, type: hostel.type, area: hostel.area, description: hostel.description });
    setShowHostelForm(true);
  };

  return (
    <PageTransition>
      <div className="section-padding py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Admin Panel</h1>
            <p className="text-gray-500">Manage hostels, bookings, and maintenance</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Overview */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
                {[
                  { label: 'Total Hostels', value: stats.totalHostels, color: 'bg-brand-50 text-brand-700' },
                  { label: 'Total Rooms', value: stats.totalRooms, color: 'bg-blue-50 text-blue-700' },
                  { label: 'Available', value: stats.availableRooms, color: 'bg-emerald-50 text-emerald-700' },
                  { label: 'Occupancy', value: `${stats.occupancyRate}%`, color: 'bg-purple-50 text-purple-700' },
                  { label: 'Pending Bookings', value: stats.pendingBookings, color: 'bg-amber-50 text-amber-700' },
                  { label: 'Open Tickets', value: stats.pendingMaintenance, color: 'bg-red-50 text-red-700' },
                ].map((stat, i) => (
                  <div key={i} className={`rounded-2xl p-4 ${stat.color}`}>
                    <p className="text-2xl font-extrabold">{stat.value}</p>
                    <p className="text-xs font-medium opacity-80 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Recent Bookings</h3>
                  <div className="space-y-3">
                    {bookings.slice(0, 4).map(b => (
                      <div key={b.id} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium text-gray-800">{b.student}</p>
                          <p className="text-xs text-gray-500">{b.hostel}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-medium capitalize ${statusBadge[b.status]}`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Open Maintenance</h3>
                  <div className="space-y-3">
                    {maintenanceList.filter(m => m.status !== 'resolved').slice(0, 4).map(m => (
                      <div key={m.id} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium text-gray-800">{m.title}</p>
                          <p className="text-xs text-gray-500">{m.hostel} · {m.student}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          m.priority === 'high' ? 'text-red-600' : m.priority === 'medium' ? 'text-amber-600' : 'text-gray-500'
                        }`}>
                          {m.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Hostels Management */}
          {activeTab === 'hostels' && (
            <motion.div key="hostels" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">All Hostels ({hostels.length})</h2>
                <button
                  onClick={() => { setEditingHostel(null); setHostelForm({ name: '', type: 'unisex', area: '', description: '' }); setShowHostelForm(true); }}
                  className="btn-primary text-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Hostel
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Area</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Rooms</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Available</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Rating</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {hostels.map(h => {
                        const total = h.roomTypes.reduce((s, r) => s + r.total, 0);
                        const available = h.roomTypes.reduce((s, r) => s + r.available, 0);
                        return (
                          <tr key={h.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{h.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{h.area}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                                h.type === 'boys' ? 'bg-blue-100 text-blue-700' : h.type === 'girls' ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700'
                              }`}>{h.type}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">{total}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className={available > 0 ? 'text-emerald-600 font-medium' : 'text-red-500'}>{available}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">{h.rating}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button onClick={() => openEditHostel(h)} className="p-1.5 rounded-lg hover:bg-gray-100">
                                  <Edit className="w-4 h-4 text-gray-500" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <Modal isOpen={showHostelForm} onClose={() => setShowHostelForm(false)} title={editingHostel ? 'Edit Hostel' : 'Add New Hostel'} size="md">
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name *</label>
                    <input
                      type="text"
                      value={hostelForm.name}
                      onChange={e => setHostelForm(f => ({ ...f, name: e.target.value }))}
                      className="input-field"
                      placeholder="e.g. Sunrise Student PG"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                      <select
                        value={hostelForm.type}
                        onChange={e => setHostelForm(f => ({ ...f, type: e.target.value }))}
                        className="input-field"
                      >
                        <option value="boys">Boys</option>
                        <option value="girls">Girls</option>
                        <option value="unisex">Co-ed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
                      <input
                        type="text"
                        value={hostelForm.area}
                        onChange={e => setHostelForm(f => ({ ...f, area: e.target.value }))}
                        className="input-field"
                        placeholder="e.g. Vile Parle West"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={hostelForm.description}
                      onChange={e => setHostelForm(f => ({ ...f, description: e.target.value }))}
                      rows={3}
                      className="input-field resize-none"
                      placeholder="Brief description of the hostel..."
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowHostelForm(false)} className="btn-secondary flex-1">Cancel</button>
                    <button onClick={handleSaveHostel} className="btn-primary flex-1 flex items-center justify-center gap-1.5">
                      <Save className="w-4 h-4" /> {editingHostel ? 'Update' : 'Add Hostel'}
                    </button>
                  </div>
                </div>
              </Modal>
            </motion.div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <motion.div key="bookings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h2 className="text-lg font-bold text-gray-900 mb-4">All Bookings ({bookings.length})</h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Hostel</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Room</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Move-in</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {bookings.map(b => (
                        <tr key={b.id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">{b.student}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{b.hostel}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{b.room}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{new Date(b.moveIn).toLocaleDateString('en-IN')}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${statusBadge[b.status]}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              {b.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleBookingStatusUpdate(b.id, 'confirmed')}
                                    className="px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => handleBookingStatusUpdate(b.id, 'cancelled')}
                                    className="px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {b.status === 'waitlisted' && (
                                <button
                                  onClick={() => handleBookingStatusUpdate(b.id, 'confirmed')}
                                  className="px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                >
                                  Confirm
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <motion.div key="maintenance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Maintenance Requests ({maintenanceList.length})</h2>
              <div className="space-y-3">
                {maintenanceList.map(m => (
                  <div key={m.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          m.status === 'resolved' ? 'bg-emerald-100' : m.status === 'in-progress' ? 'bg-blue-100' : 'bg-amber-100'
                        }`}>
                          {m.status === 'resolved' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> :
                           m.status === 'in-progress' ? <Clock className="w-5 h-5 text-blue-600" /> :
                           <AlertCircle className="w-5 h-5 text-amber-600" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{m.title}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{m.hostel} · {m.student} · {m.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          m.priority === 'high' ? 'text-red-600 bg-red-50' : m.priority === 'medium' ? 'text-amber-600 bg-amber-50' : 'text-gray-500 bg-gray-50'
                        }`}>{m.priority}</span>
                        {m.status === 'pending' && (
                          <button
                            onClick={() => handleMaintenanceStatusUpdate(m.id, 'in-progress')}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            Start
                          </button>
                        )}
                        {m.status === 'in-progress' && (
                          <button
                            onClick={() => handleMaintenanceStatusUpdate(m.id, 'resolved')}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
