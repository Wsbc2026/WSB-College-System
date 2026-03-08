import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck,
  GraduationCap, 
  AlertTriangle, 
  FileText, 
  Package, 
  MessageSquare, 
  Settings,
  LogOut,
  Menu,
  X,
  CreditCard,
  ClipboardList,
  Globe,
  User,
  Book
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';
import { SCHOOL_INFO } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab, onLogout }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const { language, setLanguage, t } = useLanguage();

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'students', label: t('students'), icon: Users, roles: ['admin', 'teacher'] },
    { id: 'staff', label: 'Staff Management', icon: UserCheck, roles: ['admin'] },
    { id: 'academics', label: t('academics'), icon: GraduationCap, roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'incidents', label: t('incidents'), icon: AlertTriangle, roles: ['admin', 'teacher', 'parent'] },
    { id: 'assets', label: t('assets'), icon: Package, roles: ['admin', 'teacher'] },
    { id: 'finance', label: t('finance'), icon: CreditCard, roles: ['admin'] },
    { id: 'messaging', label: t('messaging'), icon: MessageSquare, roles: ['teacher', 'parent', 'admin'] },
    { id: 'requests', label: t('requests'), icon: ClipboardList, roles: ['admin', 'teacher'] },
    { id: 'parent_portal', label: t('parent_portal'), icon: User, roles: ['admin', 'parent'] },
    { id: 'handbook', label: 'Handbook', icon: Book, roles: ['admin', 'teacher', 'student', 'parent'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 260 : 0 }}
        className="fixed left-0 top-0 h-screen bg-zinc-950 text-zinc-400 overflow-hidden z-40 lg:relative"
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-10">
            <img src={SCHOOL_INFO.logo} alt="Logo" className="w-10 h-10 rounded-full bg-white p-1" />
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="text-white font-bold text-sm leading-tight">WSB College</h1>
              <p className="text-[10px] opacity-50 uppercase tracking-wider">{role}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-white text-black font-medium' 
                    : 'hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 p-1 bg-zinc-900 rounded-xl">
              <button 
                onClick={() => setLanguage('en')}
                className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                  language === 'en' ? 'bg-zinc-800 text-white' : 'text-zinc-500'
                }`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('fr')}
                className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                  language === 'fr' ? 'bg-zinc-800 text-white' : 'text-zinc-500'
                }`}
              >
                FR
              </button>
            </div>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all"
            >
              <LogOut size={20} />
              <span className="text-sm">{t('logout')}</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
