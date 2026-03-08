import React from 'react';
import { 
  Users, 
  GraduationCap, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

const data = [
  { name: 'Mon', incidents: 4, attendance: 95 },
  { name: 'Tue', incidents: 1, attendance: 98 },
  { name: 'Wed', incidents: 7, attendance: 92 },
  { name: 'Thu', incidents: 2, attendance: 96 },
  { name: 'Fri', incidents: 5, attendance: 94 },
];

const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard')}</h1>
          <p className="text-zinc-500">{t('welcome')}</p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-xl">
          {['daily', 'weekly', 'monthly', 'quarterly', 'yearly'].map((period) => (
            <button 
              key={period}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                period === 'weekly' ? 'bg-white shadow-sm text-black' : 'text-zinc-500 hover:text-black'
              }`}
            >
              {t(period)}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t('students'), value: '1,284', icon: Users, color: 'blue' },
          { label: 'Avg Attendance', value: '94.2%', icon: GraduationCap, color: 'emerald' },
          { label: t('incidents'), value: '12', icon: AlertTriangle, color: 'orange' },
          { label: 'Academic Avg', value: '78%', icon: TrendingUp, color: 'violet' },
        ].map((stat, i) => (stat && (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-${stat.color}-50 text-${stat.color}-600`}>
              <stat.icon size={24} />
            </div>
            <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </motion.div>
        )))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg">Class Timetable</h3>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase">Anglophone</span>
              <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">Francophone</span>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { time: '08:00 - 08:45', subject: 'Mathematics', class: '7A', lang: 'EN', color: 'emerald' },
              { time: '08:45 - 09:30', subject: 'French Language', class: '8B', lang: 'FR', color: 'blue' },
              { time: '09:30 - 10:15', subject: 'Basic Science', class: '9A', lang: 'EN', color: 'emerald' },
              { time: '10:15 - 10:30', subject: 'Break', class: '-', lang: '-', color: 'zinc' },
            ].map((slot, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div className="w-24 text-xs font-bold text-zinc-400">{slot.time}</div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{slot.subject}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Class {slot.class}</p>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold bg-${slot.color}-100 text-${slot.color}-700`}>
                  {slot.lang}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 border border-zinc-100 rounded-xl text-xs font-bold hover:bg-zinc-50 transition-all">
            View Full Timetable
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg">Attendance Rate</h3>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              Daily Average
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} domain={[80, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 text-white p-8 rounded-3xl overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">School Announcements</h3>
          <p className="text-zinc-400 text-sm max-w-md mb-6">
            The annual science fair is scheduled for next Friday. All departments must submit their material requests by Wednesday.
          </p>
          <button className="bg-white text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all">
            View All Announcements
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[100px] -mr-32 -mt-32"></div>
      </div>
    </div>
  );
};

export default Dashboard;
