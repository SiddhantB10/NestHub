import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import HostelListing from './pages/HostelListing';
import HostelDetail from './pages/HostelDetail';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import ParentAccess from './pages/ParentAccess';
import AdminPanel from './pages/AdminPanel';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 text-gray-800">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/hostels" element={<HostelListing />} />
            <Route path="/hostels/:slug" element={<HostelDetail />} />
            <Route path="/booking/:slug" element={<Booking />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/parent-access" element={<ParentAccess />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
