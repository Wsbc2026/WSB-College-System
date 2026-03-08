import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Plus, 
  Filter,
  MoreHorizontal,
  ShieldAlert,
  History,
  Clock,
  Printer,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Incident, Student } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { YEAR_10A_STUDENTS } from '../mockData';

const IncidentTracking: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const { t } = useLanguage();

  // Mock data
  const students: Student[] = [
    { 
      id: 's1', 
      surname: 'Robert', 
      firstName: 'Katherine', 
      dob: '2012-05-15', 
      studentId: '83684', 
      birthReg: 'BR-12345', 
      classId: '7A', 
      stream: 'A',
      language: 'Anglophone',
      parentId: 'p1', 
      gender: 'female', 
      level: 'Junior', 
      year: 7,
      category: 'boarder'
    },
    { 
      id: 's2', 
      surname: 'Lini', 
      firstName: 'Jean', 
      dob: '2011-08-22', 
      studentId: '83685', 
      birthReg: 'BR-12346', 
      classId: '8B', 
      stream: 'B',
      language: 'Anglophone',
      parentId: 'p2', 
      gender: 'male', 
      level: 'Junior', 
      year: 8,
      category: 'day_boarder'
    },
    ...YEAR_10A_STUDENTS
  ];

  const [incidents, setIncidents] = useState<Incident[]>([
    { id: 'i1', studentId: 's1', teacherId: 't1', description: 'Repeatedly late to class.', date: '2024-03-01', type: 'warning', count: 3, absentCount: 3, classId: '7A', stream: 'English', language: 'English' },
    { id: 'i2', studentId: 's2', teacherId: 't2', description: 'Disruptive behavior in lab.', date: '2024-03-05', type: 'punishment', count: 1, absentCount: 1, classId: '8B', stream: 'French', language: 'French' },
    { id: 'i3', studentId: 's1', teacherId: 't1', description: 'Unfinished homework.', date: '2024-02-28', type: 'warning', count: 2, absentCount: 2, classId: '7A', stream: 'English', language: 'English' },
  ]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter(incident => {
      const matchesType = filterType === 'all' || incident.type === filterType;
      const matchesDate = (!dateRange.start || incident.date >= dateRange.start) && 
                          (!dateRange.end || incident.date <= dateRange.end);
      return matchesType && matchesDate;
    });
  }, [incidents, filterType, dateRange]);

  const printIndividualReport = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    const studentIncidents = incidents.filter(i => i.studentId === studentId);
    if (!student) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <html>
        <head>
          <title>Incident Report - ${student.firstName} ${student.surname}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #000; padding-bottom: 20px; }
            .student-info { margin-bottom: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Individual Incident Report</h1>
            <p>White Sands Bilingual College</p>
          </div>
          <div class="student-info">
            <div><strong>Name:</strong> ${student.surname} ${student.firstName}</div>
            <div><strong>Student ID:</strong> ${student.studentId}</div>
            <div><strong>Class:</strong> ${student.classId}</div>
            <div><strong>Category:</strong> ${student.category}</div>
          </div>
          <table>
            <thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Class</th><th>Stream</th></tr></thead>
            <tbody>
              ${studentIncidents.map(i => `<tr><td>${i.date}</td><td>${i.type}</td><td>${i.description}</td><td>${i.classId}</td><td>${i.stream}</td></tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  const printSummaryReport = (period: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <html>
        <head>
          <title>${period} Incident Summary Report</title>
          <style>
            body { font-family: sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 40px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${period} Incident Summary Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead><tr><th>Date</th><th>Student</th><th>Class</th><th>Type</th><th>Description</th></tr></thead>
            <tbody>
              ${filteredIncidents.map(i => {
                const s = students.find(st => st.id === i.studentId);
                return `<tr><td>${i.date}</td><td>${s?.surname} ${s?.firstName}</td><td>${i.classId}</td><td>${i.type}</td><td>${i.description}</td></tr>`;
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incident Records</h1>
          <p className="text-zinc-500">Monitor student behavior and disciplinary actions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="dropdown relative group">
            <button className="flex items-center gap-2 bg-zinc-100 text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all">
              <Printer size={18} />
              Print Reports
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
              <button onClick={() => printSummaryReport('Weekly')} className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-50 font-medium">Weekly Report</button>
              <button onClick={() => printSummaryReport('Monthly')} className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-50 font-medium">Monthly Report</button>
              <button onClick={() => printSummaryReport('Quarterly')} className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-50 font-medium">Quarterly Report</button>
              <button onClick={() => printSummaryReport('Yearly')} className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-50 font-medium">Yearly Report</button>
            </div>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
          >
            <Plus size={18} />
            Record Incident
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-sm space-y-6">
            <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-400">Filters</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500">Incident Type</label>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-2 text-sm focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="warning">Warning</option>
                <option value="detention">Detention</option>
                <option value="punishment">Punishment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500">Start Date</label>
              <input 
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-2 text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500">End Date</label>
              <input 
                type="date" 
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-2 text-sm focus:outline-none"
              />
            </div>

            <button 
              onClick={() => { setFilterType('all'); setDateRange({ start: '', end: '' }); }}
              className="w-full py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Main List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search records..." 
                  className="w-full pl-10 pr-4 py-2 bg-zinc-100 rounded-xl text-sm focus:outline-none"
                />
              </div>
            </div>
            
            <div className="divide-y divide-zinc-100">
              {filteredIncidents.map((incident) => {
                const student = students.find(s => s.id === incident.studentId);
                const isCritical = (incident.absentCount || 0) >= 3;

                return (
                  <div key={incident.id} className="p-6 hover:bg-zinc-50/50 transition-all flex items-start gap-4 group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isCritical ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {isCritical ? <ShieldAlert size={20} /> : <AlertTriangle size={20} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h4 className="font-bold text-sm">{student?.surname}, {student?.firstName}</h4>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                            {incident.classId} • {incident.stream} • {incident.language}
                          </p>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">{incident.date}</span>
                      </div>
                      <p className="text-xs text-zinc-500 mb-3">{incident.description}</p>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          incident.type === 'punishment' || incident.type === 'detention' ? 'bg-red-600 text-white' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          {incident.type}
                        </span>
                        <span className={`text-[10px] font-bold ${isCritical ? 'text-red-600' : 'text-zinc-400'}`}>
                          Occurrence: {incident.absentCount || 0}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => printIndividualReport(incident.studentId)}
                        className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-black transition-all" 
                        title="Print Student Report"
                      >
                        <Printer size={18} />
                      </button>
                      <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-black transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Incident Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white p-8 rounded-[40px] max-w-2xl w-full space-y-6 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-2xl">Record Student Incident</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Student</label>
                    <select className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none">
                      {students.map(s => <option key={s.id} value={s.id}>{s.surname}, {s.firstName}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Incident Type</label>
                      <select className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none">
                        <option value="warning">Warning</option>
                        <option value="detention">Detention</option>
                        <option value="punishment">Punishment</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Date</label>
                      <input type="date" className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Description</label>
                    <textarea className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none h-32" placeholder="Details of the incident..."></textarea>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Class</label>
                    <input type="text" className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" placeholder="e.g. 7A" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Stream</label>
                    <select className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none">
                      <option value="English">English</option>
                      <option value="French">French</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Language</label>
                    <input type="text" className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" placeholder="e.g. English, French, Bislama" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 bg-zinc-100 text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setIncidents(prev => [...prev, {
                      id: `i${Date.now()}`,
                      studentId: 's1',
                      teacherId: 't1',
                      description: 'New incident recorded',
                      date: new Date().toISOString().split('T')[0],
                      type: 'warning',
                      count: 1,
                      absentCount: 1,
                      classId: '7A',
                      stream: 'English',
                      language: 'English'
                    }]);
                    setIsAdding(false);
                  }}
                  className="flex-1 bg-zinc-950 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all"
                >
                  Save Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IncidentTracking;
