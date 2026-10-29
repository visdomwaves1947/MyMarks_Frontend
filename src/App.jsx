import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import VideoDemoModal from './components/VideoDemoModal';
import AuthModal from './components/AuthModal';
import ExamPlannerModal from './components/exam-planner/ExamPlannerModal';
import MathsPage from './pages/MathsPage';
import DemoPage from './pages/DemoPage';
import English from './pages/English';
import Botany from './pages/Botany';
import Zoology from './pages/Zoology';
import Physics from './pages/Physics';
import Chemistry from './pages/Chemistry';
import Sanskrit from './pages/Sanskrit';
import Telugu from './pages/Telugu';
import Hindi from './pages/Hindi';
import Urdu from './pages/Urdu';
import French from './pages/French';
import Commerce from './pages/Commerce';
import Economics from './pages/Economics';
import Civics from './pages/Civics';
import History from './pages/History';
import ProfilePage from './pages/ProfilePage';
import AboutUsPage from './pages/AboutUs';
import ContactUsPage from './pages/ContactUs';
import LabPracticalsPage from './pages/LabPracticalsPage';
import SitePrivacyGate from './components/SitePrivacyGate';
import AdminPage from './pages/AdminPage';

// Automatic scroll-to-top on route changes unless an anchor hash exists
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('mla_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } catch {
      return 'light';
    }
  });

  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState('');
  const [videoDemoOpen, setVideoDemoOpen] = useState(false);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  const location = useLocation();
  const path = location.pathname.toLowerCase();
  
  const isAuthRoute = ['/signin', '/signup'].includes(path);
  const authMode = isAuthRoute ? path.substring(1) : 'signin'; 

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mla_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    const isAdmin = user && (user.role === 'admin' || user.email === 'md@visdomwaves.com');
    try {
      localStorage.setItem('mla_user', JSON.stringify(user));
      if (isAdmin) {
        localStorage.setItem('mymarks_admin_auth', 'true');
        sessionStorage.setItem('mymarks_admin_auth', 'true');
        if (user.token) {
          localStorage.setItem('mymarks_admin_token', user.token);
          sessionStorage.setItem('mymarks_admin_token', user.token);
        }
      }
    } catch (e) {
      console.warn(e);
    }

    if (isAdmin) {
      navigate('/admin');
      return;
    }

    const from = location.state?.from || '/demo';
    navigate(from);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('mla_user');
      localStorage.removeItem('mymarks_admin_auth');
      sessionStorage.removeItem('mymarks_admin_auth');
      localStorage.removeItem('mymarks_admin_token');
      sessionStorage.removeItem('mymarks_admin_token');
    } catch (e) {
      console.warn(e);
    }
    const from = location.state?.from || '/demo';
    navigate(from);
  };

  const handleOpenSignIn = () => {
    if (currentUser && (currentUser.role === 'admin' || currentUser.email === 'md@visdomwaves.com')) {
      navigate('/admin');
      return;
    }
    navigate(currentUser ? '/portal' : '/signin', { state: { from: location.pathname !== '/signin' && location.pathname !== '/signup' && location.pathname !== '/portal' ? location.pathname : (location.state?.from || '/demo') } });
  };

  const handleOpenSignUp = () => {
    navigate('/signup', { state: { from: location.pathname !== '/signin' && location.pathname !== '/signup' && location.pathname !== '/portal' ? location.pathname : (location.state?.from || '/demo') } });
  };
  
  const handleCloseAuth = () => {
    const from = location.state?.from || '/demo';
    navigate(from);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    try {
      localStorage.setItem('mla_theme', theme);
    } catch (e) {
      console.warn('LocalStorage not available', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleOpenBooking = (track = '') => {
    setSelectedTrack(typeof track === 'string' ? track : '');
    setBookingOpen(true);
  };

  const handleSelectRoadmap = (plan) => {
    setSelectedRoadmap(plan);
    setIsPlannerOpen(true);
  };

  // Site-wide Privacy Protection Gate
  const [isSiteAccessGranted, setIsSiteAccessGranted] = useState(() => {
    try {
      return (
        localStorage.getItem('site_privacy_access') === 'granted' ||
        sessionStorage.getItem('site_privacy_access') === 'granted'
      );
    } catch {
      return false;
    }
  });

  const handleLockSite = () => {
    try {
      localStorage.removeItem('site_privacy_access');
      sessionStorage.removeItem('site_privacy_access');
    } catch (e) {
      console.warn(e);
    }
    setIsSiteAccessGranted(false);
  };

  const isAdminRoute = path === '/admin' || path.startsWith('/admin/') || path === '/mymarks/admin' || path.startsWith('/mymarks/admin/');

  // Dedicated Full-Screen Administrator Workspace
  if (isAdminRoute) {
    return (
      <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${theme === 'dark' ? 'bg-[#070B14] text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<AdminPage currentUser={currentUser} onLogout={handleLogout} onOpenSignIn={handleOpenSignIn} theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/admin/*" element={<AdminPage currentUser={currentUser} onLogout={handleLogout} onOpenSignIn={handleOpenSignIn} theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/Admin" element={<Navigate to="/admin" replace />} />
          <Route path="/mymarks/admin" element={<Navigate to="/admin" replace />} />
          <Route path="/mymarks/admin/*" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    );
  }

  // Block the entire website until authenticated with md@visdomwaves.com / md@1947
  if (!isSiteAccessGranted) {
    return <SitePrivacyGate onUnlock={() => setIsSiteAccessGranted(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#E6F0FA] text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      <ScrollToTop />

      {/* Shared Navigation Header */}
      <Navbar 
        onOpenBooking={() => handleOpenBooking()} 
        onOpenPortal={handleOpenSignIn}
        onOpenSignIn={handleOpenSignIn}
        onOpenSignUp={handleOpenSignUp}
        currentUser={currentUser}
        theme={theme}
        toggleTheme={toggleTheme}
        onLockSite={handleLockSite}
      />

      {/* Routed Main Content */}
      <main className="grow">
        <Routes>
          {/* Main Maths Academy Curriculum */}
          <Route 
            path="/maths" 
            element={
              <MathsPage 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
                currentUser={currentUser}
              />
            } 
          />
          <Route 
            path="/Maths" 
            element={
              <MathsPage 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
                currentUser={currentUser}
              />
            } 
          />
          <Route 
            path="/math" 
            element={
              <MathsPage 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
                currentUser={currentUser}
              />
            } 
          />

          {/* Demo Page: Keeps Navbar, Footer, and displays "Demo" on Hero section */}
          <Route 
            path="/demo" 
            element={
              <DemoPage 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                currentUser={currentUser}
                onOpenSignIn={handleOpenSignIn}
                onOpenSignUp={handleOpenSignUp}
              />
            } 
          />

          {/* English Page */}
          <Route 
            path="/english" 
            element={
              <English 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/English" 
            element={
              <English 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/eng" 
            element={
              <English 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />

          {/* Botany Page */}
          <Route 
            path="/botany" 
            element={
              <Botany 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/Botany" 
            element={
              <Botany 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/bot" 
            element={
              <Botany 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />

          {/* Zoology Page */}
          <Route 
            path="/zoology" 
            element={
              <Zoology 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/Zoology" 
            element={
              <Zoology 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/zoo" 
            element={
              <Zoology 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />

          {/* Physics Page */}
          <Route 
            path="/physics" 
            element={
              <Physics 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/Physics" 
            element={
              <Physics 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/phy" 
            element={
              <Physics 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />

          {/* Chemistry Page */}
          <Route 
            path="/chemistry" 
            element={
              <Chemistry 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/Chemistry" 
            element={
              <Chemistry 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/chem" 
            element={
              <Chemistry 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />

          {/* Sanskrit Page */}
          <Route 
            path="/sanskrit" 
            element={
              <Sanskrit 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/Sanskrit" 
            element={
              <Sanskrit 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/san" 
            element={
              <Sanskrit 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />

          {/* Telugu Page */}
          <Route 
            path="/telugu" 
            element={
              <Telugu 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/Telugu" 
            element={
              <Telugu 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/tel" 
            element={
              <Telugu 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />

          {/* Hindi Page */}
          <Route 
            path="/hindi" 
            element={
              <Hindi 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/Hindi" 
            element={
              <Hindi 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/hin" 
            element={
              <Hindi 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />

          {/* Urdu Page */}
          <Route 
            path="/urdu" 
            element={
              <Urdu 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/Urdu" 
            element={
              <Urdu 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/urd" 
            element={
              <Urdu 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />

          {/* French Page */}
          <Route 
            path="/french" 
            element={
              <French 
                currentUser={currentUser}
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/French" 
            element={
              <French 
                currentUser={currentUser}
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route 
            path="/fre" 
            element={
              <French 
                currentUser={currentUser}
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />

          {/* Commerce / Accountancy Page (CEC & MEC) */}
          <Route 
            path="/commerce" 
            element={
              <Commerce 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route path="/Commerce" element={<Navigate to="/commerce" replace />} />
          <Route path="/com" element={<Navigate to="/commerce" replace />} />
          <Route path="/accountancy" element={<Navigate to="/commerce" replace />} />

          {/* Economics Page (CEC, MEC & HEC) */}
          <Route 
            path="/economics" 
            element={
              <Economics 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route path="/Economics" element={<Navigate to="/economics" replace />} />
          <Route path="/eco" element={<Navigate to="/economics" replace />} />

          {/* Civics / Political Science Page (CEC & HEC) */}
          <Route 
            path="/civics" 
            element={
              <Civics 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route path="/Civics" element={<Navigate to="/civics" replace />} />
          <Route path="/civ" element={<Navigate to="/civics" replace />} />
          <Route path="/political-science" element={<Navigate to="/civics" replace />} />

          {/* History Page (HEC) */}
          <Route 
            path="/history" 
            element={
              <History 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                onSelectRoadmap={handleSelectRoadmap}
              />
            } 
          />
          <Route path="/History" element={<Navigate to="/history" replace />} />
          <Route path="/his" element={<Navigate to="/history" replace />} />

          {/* Intermediate Stream Direct Group Routes */}
          <Route path="/mpc" element={<Navigate to="/demo?group=mpc#courses" replace />} />
          <Route path="/bipc" element={<Navigate to="/demo?group=bipc#courses" replace />} />
          <Route path="/cec" element={<Navigate to="/demo?group=cec#courses" replace />} />
          <Route path="/mec" element={<Navigate to="/demo?group=mec#courses" replace />} />
          <Route path="/hec" element={<Navigate to="/demo?group=hec#courses" replace />} />
          <Route path="/languages" element={<Navigate to="/demo?group=languages#courses" replace />} />

          {/* Auth Routes: Render DemoPage in the background so the modal overlays it nicely */}
          <Route 
            path="/signin" 
            element={
              <DemoPage 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                currentUser={currentUser}
                onOpenSignIn={handleOpenSignIn}
                onOpenSignUp={handleOpenSignUp}
              />
            } 
          />
          <Route 
            path="/signup" 
            element={
              <DemoPage 
                onOpenBooking={handleOpenBooking}
                onOpenVideoDemo={() => setVideoDemoOpen(true)}
                currentUser={currentUser}
                onOpenSignIn={handleOpenSignIn}
                onOpenSignUp={handleOpenSignUp}
              />
            } 
          />
          {/* Lab & Practicals Routes (Physics, Chemistry, Botany, Zoology, CS, Electronics, Geography) */}
          <Route 
            path="/practicals" 
            element={
              <LabPracticalsPage 
                onOpenBooking={handleOpenBooking}
              />
            } 
          />
          <Route path="/labs" element={<Navigate to="/practicals" replace />} />
          <Route path="/lab-practical" element={<Navigate to="/practicals" replace />} />
          <Route path="/lab-practicals" element={<Navigate to="/practicals" replace />} />
          <Route path="/computer-science" element={<Navigate to="/practicals?subject=cs" replace />} />
          <Route path="/cs" element={<Navigate to="/practicals?subject=cs" replace />} />
          <Route path="/electronics" element={<Navigate to="/practicals?subject=elec" replace />} />
          <Route path="/elec" element={<Navigate to="/practicals?subject=elec" replace />} />
          <Route path="/geography" element={<Navigate to="/practicals?subject=geo" replace />} />
          <Route path="/geo" element={<Navigate to="/practicals?subject=geo" replace />} />

          {/* Profile Route: Dedicated student profile page */}
          <Route 
            path="/profile" 
            element={
              <ProfilePage 
                currentUser={currentUser}
                onLogout={handleLogout}
                onOpenBooking={handleOpenBooking}
                onOpenSignIn={handleOpenSignIn}
                onOpenSignUp={handleOpenSignUp}
              />
            } 
          />
          <Route path="/Profile" element={<Navigate to="/profile" replace />} />
          <Route path="/portal" element={<Navigate to="/profile" replace />} />
          <Route path="/Portal" element={<Navigate to="/profile" replace />} />

          {/* Backward compatibility redirects for /mymarks/* */}
          <Route path="/mymarks/maths" element={<Navigate to="/maths" replace />} />
          <Route path="/mymarks/Maths" element={<Navigate to="/maths" replace />} />
          <Route path="/mymarks/math" element={<Navigate to="/maths" replace />} />
          <Route path="/mymarks/demo" element={<Navigate to="/demo" replace />} />
          <Route path="/mymarks/english" element={<Navigate to="/english" replace />} />
          <Route path="/mymarks/English" element={<Navigate to="/english" replace />} />
          <Route path="/mymarks/eng" element={<Navigate to="/english" replace />} />
          <Route path="/mymarks/botany" element={<Navigate to="/botany" replace />} />
          <Route path="/mymarks/Botany" element={<Navigate to="/botany" replace />} />
          <Route path="/mymarks/bot" element={<Navigate to="/botany" replace />} />
          <Route path="/mymarks/zoology" element={<Navigate to="/zoology" replace />} />
          <Route path="/mymarks/Zoology" element={<Navigate to="/zoology" replace />} />
          <Route path="/mymarks/zoo" element={<Navigate to="/zoology" replace />} />
          <Route path="/mymarks/physics" element={<Navigate to="/physics" replace />} />
          <Route path="/mymarks/Physics" element={<Navigate to="/physics" replace />} />
          <Route path="/mymarks/phy" element={<Navigate to="/physics" replace />} />
          <Route path="/mymarks/chemistry" element={<Navigate to="/chemistry" replace />} />
          <Route path="/mymarks/Chemistry" element={<Navigate to="/chemistry" replace />} />
          <Route path="/mymarks/chem" element={<Navigate to="/chemistry" replace />} />
          <Route path="/mymarks/sanskrit" element={<Navigate to="/sanskrit" replace />} />
          <Route path="/mymarks/Sanskrit" element={<Navigate to="/sanskrit" replace />} />
          <Route path="/mymarks/san" element={<Navigate to="/sanskrit" replace />} />
          <Route path="/mymarks/commerce" element={<Navigate to="/commerce" replace />} />
          <Route path="/mymarks/Commerce" element={<Navigate to="/commerce" replace />} />
          <Route path="/mymarks/economics" element={<Navigate to="/economics" replace />} />
          <Route path="/mymarks/Economics" element={<Navigate to="/economics" replace />} />
          <Route path="/mymarks/civics" element={<Navigate to="/civics" replace />} />
          <Route path="/mymarks/Civics" element={<Navigate to="/civics" replace />} />
          <Route path="/mymarks/history" element={<Navigate to="/history" replace />} />
          <Route path="/mymarks/History" element={<Navigate to="/history" replace />} />
          <Route path="/mymarks/*" element={<Navigate to="/demo" replace />} />

          {/* Standalone About Us Page Routes */}
          <Route path="/aboutus" element={<AboutUsPage />} />
          <Route path="/AboutUs" element={<AboutUsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/About" element={<AboutUsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />

          {/* Standalone Contact Us Page Routes */}
          <Route path="/contactus" element={<ContactUsPage onOpenBooking={handleOpenBooking} />} />
          <Route path="/ContactUs" element={<ContactUsPage onOpenBooking={handleOpenBooking} />} />
          <Route path="/contact" element={<ContactUsPage onOpenBooking={handleOpenBooking} />} />
          <Route path="/Contact" element={<ContactUsPage onOpenBooking={handleOpenBooking} />} />
          <Route path="/contact-us" element={<ContactUsPage onOpenBooking={handleOpenBooking} />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminPage currentUser={currentUser} onLogout={handleLogout} onOpenSignIn={handleOpenSignIn} theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/admin/*" element={<AdminPage currentUser={currentUser} onLogout={handleLogout} onOpenSignIn={handleOpenSignIn} theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/Admin" element={<Navigate to="/admin" replace />} />
          <Route path="/mymarks/admin" element={<Navigate to="/admin" replace />} />

          {/* Root & Fallback: Show demo first instead of maths */}
          <Route path="/" element={<Navigate to="/demo" replace />} />
          <Route path="*" element={<Navigate to="/demo" replace />} />
        </Routes>
      </main>

      {/* Shared Footer */}
      <Footer 
        onOpenBooking={() => handleOpenBooking()} 
      />

      {/* Shared Interactive Modals */}
      <BookingModal 
        isOpen={bookingOpen} 
        onClose={() => setBookingOpen(false)}
        preselectedTrack={selectedTrack}
      />

      <AuthModal 
        isOpen={isAuthRoute} 
        onClose={handleCloseAuth}
        initialMode={authMode}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
      />

      <VideoDemoModal 
        isOpen={videoDemoOpen} 
        onClose={() => setVideoDemoOpen(false)}
        onOpenBooking={() => handleOpenBooking('Classroom Experience')}
      /> 

      <ExamPlannerModal 
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        selectedRoadmap={selectedRoadmap}
      />
    </div>
  );
}
