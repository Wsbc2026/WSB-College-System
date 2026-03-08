import React, { useState } from 'react';
import { Plus, UserPlus, BookOpen, Search, MoreVertical, Upload, Trash2, Edit2, Printer } from 'lucide-react';
import { Student, Class } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { YEAR_10A_STUDENTS, MOCK_CLASSES } from '../mockData';

const StudentManagement: React.FC = () => {
  const [view, setView] = useState<'students' | 'classes'>('students');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [filterClassId, setFilterClassId] = useState<string | null>(null);
  const { t } = useLanguage();

  // Mock data
  const [students, setStudents] = useState<Student[]>([
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
  ]);

  const [classes, setClasses] = useState<Class[]>(MOCK_CLASSES);

  // Form state for new class
  const [newClassForm, setNewClassForm] = useState({
    form: 7,
    teacherId: '',
    stream: 'A',
    artStream: false,
    sciStream: false,
    assistantTeacherId: ''
  });

  const handleDeleteStudent = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleDeleteClass = (id: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter(c => c.id !== id));
    }
  };

  const [newStudentForm, setNewStudentForm] = useState({
    surname: '',
    firstName: '',
    dob: '',
    studentId: '',
    birthReg: '',
    classId: '7A',
    stream: 'A',
    language: 'Anglophone' as 'Anglophone' | 'Francophone',
    gender: 'male' as 'male' | 'female',
    category: 'day_boarder' as const
  });

  const handleCreateStudent = () => {
    const newStudent: Student = {
      id: `s${Date.now()}`,
      ...newStudentForm,
      parentId: 'p_new',
      level: Number(newStudentForm.classId.replace(/\D/g, '')) >= 10 ? 'Senior' : 'Junior',
      year: Number(newStudentForm.classId.replace(/\D/g, '')),
    };
    setStudents([...students, newStudent]);
    setIsAdding(false);
    alert('Student added successfully!');
  };

  const handleCreateClass = () => {
    const newClass: Class = {
      id: `${newClassForm.form}${newClassForm.stream}`,
      name: `Year ${newClassForm.form}${newClassForm.stream}`,
      teacherId: newClassForm.teacherId || 'Unknown',
      department: newClassForm.form >= 10 ? 'Senior' : 'Junior',
      enrolment: 0,
      academicYear: selectedYear,
      form: newClassForm.form,
      stream: newClassForm.stream,
      artStream: newClassForm.artStream,
      sciStream: newClassForm.sciStream,
      assistantTeacherId: newClassForm.assistantTeacherId
    };
    setClasses([...classes, newClass]);
    alert('New class created successfully!');
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Uploading student CSV:', file.name);
      alert('Students enrolled successfully from CSV (simulated)');
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student & Class Management</h1>
          <p className="text-zinc-500">Manage the school roster and academic structure.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const printWindow = window.open('', '_blank');
              if (!printWindow) return;
              const content = `
                <html>
                  <head><title>Student Records</title><style>body{font-family:sans-serif;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background:#f4f4f4;}</style></head>
                  <body>
                    <h1>Student Records - WSB College</h1>
                    <table>
                      <thead><tr><th>Name</th><th>ID</th><th>Class</th><th>Level</th><th>DoB</th></tr></thead>
                      <tbody>
                        ${students.map(s => `<tr><td>${s.surname}, ${s.firstName}</td><td>${s.studentId}</td><td>${s.classId}</td><td>${s.level}</td><td>${s.dob}</td></tr>`).join('')}
                      </tbody>
                    </table>
                  </body>
                </html>
              `;
              printWindow.document.write(content);
              printWindow.document.close();
              printWindow.print();
            }}
            className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-50 transition-all"
          >
            <Printer size={18} />
            Print Records
          </button>
          <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-xl">
                <button 
                  onClick={() => { setView('students'); setFilterClassId(null); }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    view === 'students' ? 'bg-white shadow-sm text-black' : 'text-zinc-500'
                  }`}
                >
                  Students
                </button>
                <button 
                  onClick={() => setView('classes')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    view === 'classes' ? 'bg-white shadow-sm text-black' : 'text-zinc-500'
                  }`}
                >
                  Classes
                </button>
              </div>
          {view === 'students' && (
            <label className="cursor-pointer flex items-center gap-2 bg-zinc-100 text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all">
              <Upload size={18} />
              Import CSV
              <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
            </label>
          )}
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-zinc-950 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all"
          >
            {view === 'students' ? <UserPlus size={18} /> : <BookOpen size={18} />}
            Add {view === 'students' ? 'Student' : 'Class'}
          </button>
        </div>
      </header>

      {view === 'classes' && (
        <div className="space-y-8">
          {/* Class Setup Form */}
          <div className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Classes - Set up the classes at your school</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-zinc-500">Add and view classes for this year {'>'}</span>
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="bg-zinc-100 border-none rounded-xl px-4 py-2 text-sm font-bold focus:outline-none"
                >
                  <option value={2026}>2026</option>
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                </select>
              </div>
            </div>
            
            <p className="text-sm text-zinc-500">
              To add a new class, pick the Class/Form, the Stream and the Teacher below and click Create This NEW Class.
              <br />
              If the teacher is not on the list, do not pick any teachers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Year:</label>
                <select 
                  value={newClassForm.form}
                  onChange={(e) => setNewClassForm({...newClassForm, form: parseInt(e.target.value)})}
                  className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none"
                >
                  {[7, 8, 9, 10, 11, 12, 13].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Teacher:</label>
                <select 
                  value={newClassForm.teacherId}
                  onChange={(e) => setNewClassForm({...newClassForm, teacherId: e.target.value})}
                  className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none"
                >
                  <option value="">Pick a Teacher from this list IF POSSIBLE...</option>
                  <option value="t1">Teacher 1</option>
                  <option value="t2">Teacher 2</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Stream:</label>
                <select 
                  value={newClassForm.stream}
                  onChange={(e) => setNewClassForm({...newClassForm, stream: e.target.value})}
                  className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none"
                >
                  {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Assistant Teacher:</label>
                <select 
                  value={newClassForm.assistantTeacherId}
                  onChange={(e) => setNewClassForm({...newClassForm, assistantTeacherId: e.target.value})}
                  className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none"
                >
                  <option value="">OPTIONAL Assistant Teacher...</option>
                  <option value="at1">Assistant 1</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="artStream"
                  checked={newClassForm.artStream}
                  onChange={(e) => setNewClassForm({...newClassForm, artStream: e.target.checked})}
                  className="w-4 h-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950" 
                />
                <label htmlFor="artStream" className="text-sm font-bold text-zinc-700">Art Stream</label>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="sciStream"
                  checked={newClassForm.sciStream}
                  onChange={(e) => setNewClassForm({...newClassForm, sciStream: e.target.checked})}
                  className="w-4 h-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950" 
                />
                <label htmlFor="sciStream" className="text-sm font-bold text-zinc-700">Science Stream</label>
              </div>
              <button 
                onClick={handleCreateClass}
                className="bg-zinc-950 text-white px-8 py-3 rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-black/10"
              >
                Create This NEW Class
              </button>
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <p className="text-xs text-zinc-400 italic">If you have any questions please call the IT Office for assistance.</p>
            </div>
          </div>

          {/* Current Classes Table */}
          <div className="bg-white rounded-[40px] border border-zinc-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-zinc-100">
              <h3 className="text-lg font-bold">Current classes this year ({selectedYear})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-100">
                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Year</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Class</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Stream</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Art Strm</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sci Strm</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Students</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Teacher</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {classes.filter(c => c.academicYear === selectedYear).map((cls) => (
                    <tr key={cls.id} className="hover:bg-zinc-50/50 transition-all group">
                      <td className="px-8 py-5 text-sm font-medium">{cls.academicYear}</td>
                      <td className="px-8 py-5 text-sm font-bold">{cls.form}</td>
                      <td className="px-8 py-5 text-sm font-medium">{cls.stream}</td>
                      <td className="px-8 py-5 text-sm font-medium">{cls.artStream ? 'Yes' : 'No'}</td>
                      <td className="px-8 py-5 text-sm font-medium">{cls.sciStream ? 'Yes' : 'No'}</td>
                      <td className="px-8 py-5 text-sm font-bold">{cls.enrolment}</td>
                      <td className="px-8 py-5 text-sm font-medium">{cls.teacherId}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => { setView('students'); setFilterClassId(cls.id); }}
                            className="px-3 py-1.5 bg-zinc-100 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-zinc-200 transition-all"
                          >
                            VIEW Class/StudentInfo
                          </button>
                          <button 
                            onClick={() => handleDeleteClass(cls.id)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-red-100 transition-all"
                          >
                            DeleteTheClass
                          </button>
                          <button className="px-3 py-1.5 bg-zinc-100 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-zinc-200 transition-all">
                            ChangeStream/Teacher(s)
                          </button>
                          <button className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-emerald-100 transition-all">
                            Fee Structure
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {view === 'students' && (
        <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="text" 
                  placeholder={`Search students...`} 
                  className="w-full pl-10 pr-4 py-2 bg-zinc-100 rounded-xl text-sm focus:outline-none"
                />
              </div>
              {filterClassId && (
                <div className="flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Filtered by: {filterClassId}</span>
                  <button 
                    onClick={() => setFilterClassId(null)}
                    className="text-zinc-400 hover:text-black transition-all"
                  >
                    <Plus size={14} className="rotate-45" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-100">
                  <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Student</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ID</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Class</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Level</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">DoB</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {students
                  .filter(s => !filterClassId || s.classId === filterClassId)
                  .map((student) => (
                  <tr key={student.id} className="hover:bg-zinc-50/50 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-zinc-500">
                          {student.firstName[0]}{student.surname[0]}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{student.surname}, {student.firstName}</p>
                          <p className="text-xs text-zinc-400">{student.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-medium">{student.studentId}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-medium">{student.classId}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-medium">{student.level} Year {student.year}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-medium">{student.dob}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2 hover:bg-zinc-200 rounded-lg transition-all text-zinc-600">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteStudent(student.id)}
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
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[40px] max-w-lg w-full space-y-6">
            <h3 className="font-bold text-2xl">Add New {view === 'students' ? 'Student' : 'Class'}</h3>
            <div className="space-y-4">
              {view === 'students' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Surname</label>
                      <input 
                        type="text" 
                        value={newStudentForm.surname}
                        onChange={(e) => setNewStudentForm(prev => ({ ...prev, surname: e.target.value }))}
                        className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" 
                        placeholder="Surname" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase">First Name</label>
                      <input 
                        type="text" 
                        value={newStudentForm.firstName}
                        onChange={(e) => setNewStudentForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" 
                        placeholder="First Name" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase">DoB</label>
                      <input 
                        type="date" 
                        value={newStudentForm.dob}
                        onChange={(e) => setNewStudentForm(prev => ({ ...prev, dob: e.target.value }))}
                        className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Student ID</label>
                      <input 
                        type="text" 
                        value={newStudentForm.studentId}
                        onChange={(e) => setNewStudentForm(prev => ({ ...prev, studentId: e.target.value }))}
                        className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" 
                        placeholder="ID" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Birth Reg.</label>
                      <input 
                        type="text" 
                        value={newStudentForm.birthReg}
                        onChange={(e) => setNewStudentForm(prev => ({ ...prev, birthReg: e.target.value }))}
                        className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" 
                        placeholder="Birth Reg." 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Class</label>
                      <select 
                        value={newStudentForm.classId}
                        onChange={(e) => setNewStudentForm(prev => ({ ...prev, classId: e.target.value }))}
                        className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none"
                      >
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Stream</label>
                      <select 
                        value={newStudentForm.stream}
                        onChange={(e) => setNewStudentForm(prev => ({ ...prev, stream: e.target.value }))}
                        className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none"
                      >
                        <option value="A">Stream A</option>
                        <option value="B">Stream B</option>
                        <option value="C">Stream C</option>
                        <option value="D">Stream D</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Language</label>
                      <select 
                        value={newStudentForm.language}
                        onChange={(e) => setNewStudentForm(prev => ({ ...prev, language: e.target.value as any }))}
                        className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none"
                      >
                        <option value="Anglophone">Anglophone</option>
                        <option value="Francophone">Francophone</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-zinc-500">Please use the class setup form on the Classes tab.</p>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setIsAdding(false)}
                className="flex-1 bg-zinc-100 text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all"
              >
                Cancel
              </button>
              {view === 'students' && (
                <button 
                  onClick={handleCreateStudent}
                  className="flex-1 bg-zinc-950 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all"
                >
                  Save Student
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
