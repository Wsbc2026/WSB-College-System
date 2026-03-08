import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Messaging from './components/Messaging';
import AcademicRecords from './components/AcademicRecords';
import AssetManagement from './components/AssetManagement';
import IncidentTracking from './components/IncidentTracking';
import StaffRequests from './components/StaffRequests';
import Finance from './components/Finance';
import StudentManagement from './components/StudentManagement';
import StaffManagement from './components/StaffManagement';
import StudentHandbook from './components/StudentHandbook';
import ParentPortal from './components/ParentPortal';
import { UserProfile, UserRole } from './types';
import { SCHOOL_INFO } from './constants';
import { LogIn, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginRole, setLoginRole] = useState<UserRole>('admin');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // admin@wsb.edu.vu is always an admin
    const isAdmin = loginEmail === 'admin@wsb.edu.vu';
    const effectiveRole = isAdmin ? 'admin' : loginRole;

    // Mock login
    setUser({
      uid: 'u1',
      email: loginEmail || 'admin@wsb.edu.vu',
      name: loginEmail.split('@')[0] || 'Admin User',
      role: effectiveRole,
      studentId: effectiveRole === 'parent' ? 's1' : undefined
    });
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[48px] shadow-2xl border border-zinc-100 w-full max-w-md"
        >
          <div className="text-center mb-10">
            <img src={SCHOOL_INFO.logo} alt="Logo" className="w-20 h-20 mx-auto rounded-full mb-6 shadow-lg" />
            <h1 className="text-2xl font-bold tracking-tight">{SCHOOL_INFO.name}</h1>
            <p className="text-zinc-500 text-sm mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@wsb.edu.vu"
                className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-black/5 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Select Role</label>
              <div className="grid grid-cols-2 gap-2">
                {(['admin', 'teacher', 'student', 'parent'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setLoginRole(role)}
                    className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      loginRole === role ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-zinc-950 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl shadow-black/10"
            >
              <LogIn size={20} />
              Sign In
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-zinc-100 flex items-center justify-center gap-2 text-zinc-400">
            <ShieldCheck size={16} />
            <p className="text-[10px] font-medium uppercase tracking-widest">Secure Portal Access</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 overflow-x-hidden">
      <Sidebar 
        role={user.role} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'messaging' && <Messaging currentUser={user} />}
            {activeTab === 'academics' && <AcademicRecords />}
            {activeTab === 'assets' && <AssetManagement />}
            {activeTab === 'incidents' && <IncidentTracking />}
            {activeTab === 'requests' && <StaffRequests />}
            {activeTab === 'finance' && <Finance />}
            {activeTab === 'students' && <StudentManagement />}
            {activeTab === 'staff' && <StaffManagement />}
            {activeTab === 'handbook' && <StudentHandbook />}
            {activeTab === 'parent_portal' && <ParentPortal />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
