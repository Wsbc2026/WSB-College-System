import React, { useState } from 'react';
import { 
  Plus, 
  UserPlus, 
  Search, 
  Trash2, 
  Edit2, 
  Calendar, 
  BookOpen, 
  Printer,
  UserCheck,
  Briefcase,
  Clock
} from 'lucide-react';
import { UserProfile, TimetableEntry } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { MOCK_CLASSES } from '../mockData';

const StaffManagement: React.FC = () => {
  const [view, setView] = useState<'staff' | 'timetable'>('staff');
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [isAddingTimetable, setIsAddingTimetable] = useState(false);
  const { t } = useLanguage();

  // Mock staff data
  const [staff, setStaff] = useState<UserProfile[]>([
    { uid: 't1', name: 'Mr. John Smith', email: 'john@wsb.edu.vu', role: 'teacher', department: 'Maths', subjects: ['Mathematics'], responsibility: 'HOD Maths', assignedClasses: ['7A', '8A'] },
    { uid: 't2', name: 'Ms. Emily Brown', email: 'emily@wsb.edu.vu', role: 'teacher', department: 'Arts', subjects: ['Arts'], responsibility: 'Cultural Coordinator', assignedClasses: ['7B', '9A'] },
    { uid: 's1', name: 'Mr. David Lini', email: 'david@wsb.edu.vu', role: 'admin', responsibility: 'Bursar' },
    { uid: 'sup1', name: 'Mrs. Mary Vatu', email: 'mary@wsb.edu.vu', role: 'teacher', responsibility: 'Support Staff / Librarian' },
  ]);

  // Mock timetable data
  const [timetable, setTimetable] = useState<TimetableEntry[]>([
    { id: 'tt1', day: 'Monday', period: 1, startTime: '08:00', endTime: '08:45', subject: 'Mathematics', classId: '7A', teacherId: 't1', language: 'Anglophone', stream: 'A' },
    { id: 'tt2', day: 'Monday', period: 2, startTime: '08:45', endTime: '09:30', subject: 'Arts', classId: '7B', teacherId: 't2', language: 'Francophone', stream: 'B' },
  ]);

  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    email: '',
    role: 'teacher' as any,
    department: '',
    responsibility: '',
    subjects: '',
    assignedClasses: ''
  });

  const [newTimetableForm, setNewTimetableForm] = useState({
    day: 'Monday' as any,
    period: 1,
    startTime: '08:00',
    endTime: '08:45',
    subject: 'Mathematics',
    classId: '7A',
    teacherId: 't1',
    language: 'Anglophone' as any,
    stream: 'A'
  });

  const handleAddStaff = () => {
    const newMember: UserProfile = {
      uid: `staff-${Date.now()}`,
      name: newStaffForm.name,
      email: newStaffForm.email,
      role: newStaffForm.role,
      department: newStaffForm.department,
      responsibility: newStaffForm.responsibility,
      subjects: newStaffForm.subjects.split(',').map(s => s.trim()),
      assignedClasses: newStaffForm.assignedClasses.split(',').map(c => c.trim())
    };
    setStaff([...staff, newMember]);
    setIsAddingStaff(false);
    setNewStaffForm({ name: '', email: '', role: 'teacher', department: '', responsibility: '', subjects: '', assignedClasses: '' });
  };

  const handleAddTimetable = () => {
    const newEntry: TimetableEntry = {
      id: `tt-${Date.now()}`,
      ...newTimetableForm
    };
    setTimetable([...timetable, newEntry]);
    setIsAddingTimetable(false);
  };

  const handleDeleteStaff = (uid: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      setStaff(staff.filter(s => s.uid !== uid));
    }
  };

  const handleDeleteTimetable = (id: string) => {
    if (confirm('Are you sure you want to delete this timetable entry?')) {
      setTimetable(timetable.filter(t => t.id !== id));
    }
  };

  const printRecords = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const content = `
      <html>
        <head>
          <title>Staff Records</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            h1 { text-align: center; }
          </style>
        </head>
        <body>
          <h1>Staff Records - WSB College</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Responsibility</th>
                <th>Department</th>
                <th>Subjects</th>
                <th>Classes</th>
              </tr>
            </thead>
            <tbody>
              ${staff.map(s => `
                <tr>
                  <td>${s.name}</td>
                  <td>${s.role}</td>
                  <td>${s.responsibility || '-'}</td>
                  <td>${s.department || '-'}</td>
                  <td>${s.subjects?.join(', ') || '-'}</td>
                  <td>${s.assignedClasses?.join(', ') || '-'}</td>
                </tr>
              `).join('')}
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
          <h1 className="text-3xl font-bold tracking-tight">Staff & Timetable Management</h1>
          <p className="text-zinc-500">Enroll staff, assign responsibilities, and manage class schedules.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={printRecords}
            className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-50 transition-all"
          >
            <Printer size={18} />
            Print Records
          </button>
          <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-xl">
            <button 
              onClick={() => setView('staff')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                view === 'staff' ? 'bg-white shadow-sm text-black' : 'text-zinc-500'
              }`}
            >
              Staff
            </button>
            <button 
              onClick={() => setView('timetable')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                view === 'timetable' ? 'bg-white shadow-sm text-black' : 'text-zinc-500'
              }`}
            >
              Timetable
            </button>
          </div>
          <button 
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.csv';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const text = event.target?.result as string;
                    const lines = text.split('\n').slice(1); // Skip header
                    const newEntries: TimetableEntry[] = lines.filter(l => l.trim()).map(line => {
                      const [day, period, start, end, subject, classId, teacherId, lang, stream] = line.split(',');
                      return {
                        id: `tt-${Date.now()}-${Math.random()}`,
                        day: day.trim() as any,
                        period: parseInt(period.trim()),
                        startTime: start.trim(),
                        endTime: end.trim(),
                        subject: subject.trim(),
                        classId: classId.trim(),
                        teacherId: teacherId.trim(),
                        language: lang.trim() as any,
                        stream: stream.trim()
                      };
                    });
                    setTimetable([...timetable, ...newEntries]);
                    alert('Timetable uploaded successfully!');
                  };
                  reader.readAsText(file);
                }
              };
              input.click();
            }}
            className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-50 transition-all"
          >
            <Plus size={18} />
            Upload Timetable (CSV)
          </button>
          <button 
            onClick={() => view === 'staff' ? setIsAddingStaff(true) : setIsAddingTimetable(true)}
            className="flex items-center gap-2 bg-zinc-950 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all"
          >
            <Plus size={18} />
            Add {view === 'staff' ? 'Staff' : 'Entry'}
          </button>
        </div>
      </header>

      {view === 'staff' ? (
        <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Name</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Role / Responsibility</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Department</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Subjects / Classes</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {staff.map((member) => (
                <tr key={member.uid} className="hover:bg-zinc-50/50 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-zinc-500">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{member.name}</p>
                        <p className="text-xs text-zinc-400">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold capitalize">{member.role}</span>
                      <span className="text-xs text-zinc-500">{member.responsibility || 'No specific responsibility'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium">{member.department || 'N/A'}</td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      {member.subjects && member.subjects.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {member.subjects.map(s => <span key={s} className="px-2 py-0.5 bg-zinc-100 rounded text-[10px] font-bold">{s}</span>)}
                        </div>
                      )}
                      {member.assignedClasses && member.assignedClasses.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {member.assignedClasses.map(c => <span key={c} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold">{c}</span>)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 hover:bg-zinc-200 rounded-lg transition-all text-zinc-600">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteStaff(member.uid)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-all text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['Anglophone', 'Francophone'].map((lang) => (
              <div key={lang} className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                  <h3 className="text-lg font-bold">{lang} Stream Timetable</h3>
                </div>
                <div className="p-0">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/50 border-b border-zinc-100">
                        <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Day / Period</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Subject / Class</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Teacher</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {timetable.filter(t => t.language === lang).map((entry) => (
                        <tr key={entry.id} className="hover:bg-zinc-50/50 transition-all">
                          <td className="px-4 py-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold">{entry.day}</span>
                              <span className="text-[10px] text-zinc-400">P{entry.period} ({entry.startTime}-{entry.endTime})</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold">{entry.subject}</span>
                              <span className="text-[10px] text-emerald-600 font-bold">{entry.classId} - Stream {entry.stream}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-xs font-medium">
                            {staff.find(s => s.uid === entry.teacherId)?.name || 'Unknown'}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button 
                              onClick={() => handleDeleteTimetable(entry.id)}
                              className="text-red-400 hover:text-red-600 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {timetable.filter(t => t.language === lang).length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-zinc-400 text-sm italic">No entries for this stream.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {isAddingStaff && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[40px] max-w-lg w-full space-y-6">
            <h3 className="font-bold text-2xl">Enroll New Staff</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Full Name</label>
                  <input 
                    type="text" 
                    value={newStaffForm.name}
                    onChange={(e) => setNewStaffForm({...newStaffForm, name: e.target.value})}
                    className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" 
                    placeholder="e.g. Mr. John Doe"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Email</label>
                  <input 
                    type="email" 
                    value={newStaffForm.email}
                    onChange={(e) => setNewStaffForm({...newStaffForm, email: e.target.value})}
                    className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" 
                    placeholder="email@wsb.edu.vu"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Role</label>
                  <select 
                    value={newStaffForm.role}
                    onChange={(e) => setNewStaffForm({...newStaffForm, role: e.target.value as any})}
                    className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none"
                  >
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Department</label>
                  <input 
                    type="text" 
                    value={newStaffForm.department}
                    onChange={(e) => setNewStaffForm({...newStaffForm, department: e.target.value})}
                    className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" 
                    placeholder="e.g. Science"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Responsibility</label>
                <input 
                  type="text" 
                  value={newStaffForm.responsibility}
                  onChange={(e) => setNewStaffForm({...newStaffForm, responsibility: e.target.value})}
                  className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" 
                  placeholder="e.g. HOD, Sports Master, Librarian"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Subjects (comma separated)</label>
                  <input 
                    type="text" 
                    value={newStaffForm.subjects}
                    onChange={(e) => setNewStaffForm({...newStaffForm, subjects: e.target.value})}
                    className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" 
                    placeholder="Maths, Physics"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Assigned Classes (comma separated)</label>
                  <input 
                    type="text" 
                    value={newStaffForm.assignedClasses}
                    onChange={(e) => setNewStaffForm({...newStaffForm, assignedClasses: e.target.value})}
                    className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" 
                    placeholder="7A, 8B"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setIsAddingStaff(false)}
                className="flex-1 bg-zinc-100 text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddStaff}
                className="flex-1 bg-zinc-950 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all"
              >
                Enroll Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Timetable Modal */}
      {isAddingTimetable && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[40px] max-w-lg w-full space-y-6">
            <h3 className="font-bold text-2xl">Add Timetable Entry</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Day</label>
                  <select 
                    value={newTimetableForm.day}
                    onChange={(e) => setNewTimetableForm({...newTimetableForm, day: e.target.value as any})}
                    className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Period</label>
                  <input 
                    type="number" 
                    value={newTimetableForm.period}
                    onChange={(e) => setNewTimetableForm({...newTimetableForm, period: parseInt(e.target.value)})}
                    className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Start Time</label>
                  <input 
                    type="time" 
                    value={newTimetableForm.startTime}
                    onChange={(e) => setNewTimetableForm({...newTimetableForm, startTime: e.target.value})}
                    className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">End Time</label>
                  <input 
                    type="time" 
                    value={newTimetableForm.endTime}
                    onChange={(e) => setNewTimetableForm({...newTimetableForm, endTime: e.target.value})}
                    className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Subject</label>
                  <input 
                    type="text" 
                    value={newTimetableForm.subject}
                    onChange={(e) => setNewTimetableForm({...newTimetableForm, subject: e.target.value})}
                    className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Class ID</label>
                  <input 
                    type="text" 
                    value={newTimetableForm.classId}
                    onChange={(e) => setNewTimetableForm({...newTimetableForm, classId: e.target.value})}
                    className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Teacher</label>
                  <select 
                    value={newTimetableForm.teacherId}
                    onChange={(e) => setNewTimetableForm({...newTimetableForm, teacherId: e.target.value})}
                    className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none"
                  >
                    {staff.filter(s => s.role === 'teacher').map(s => <option key={s.uid} value={s.uid}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Language</label>
                  <select 
                    value={newTimetableForm.language}
                    onChange={(e) => setNewTimetableForm({...newTimetableForm, language: e.target.value as any})}
                    className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none"
                  >
                    <option value="Anglophone">Anglophone</option>
                    <option value="Francophone">Francophone</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Stream</label>
                  <input 
                    type="text" 
                    value={newTimetableForm.stream}
                    onChange={(e) => setNewTimetableForm({...newTimetableForm, stream: e.target.value})}
                    className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" 
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setIsAddingTimetable(false)}
                className="flex-1 bg-zinc-100 text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddTimetable}
                className="flex-1 bg-zinc-950 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all"
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
