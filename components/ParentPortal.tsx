import React, { useState } from 'react';
import { Search, Download, FileText, User, GraduationCap, AlertCircle, ExternalLink, Book, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Student, AcademicRecord } from '../types';
import { YEAR_10A_STUDENTS } from '../mockData';

const ParentPortal: React.FC = () => {
  const { t } = useLanguage();
  const [studentId, setStudentId] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [error, setError] = useState('');

  // Mock data for demonstration
  const mockStudents: Student[] = [
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

  const announcements = [
    { id: 1, title: 'Term 1 Parent-Teacher Meeting', date: 'March 15, 2026', content: 'Discussion on student progress and upcoming academic goals.' },
    { id: 2, title: 'School Fee Deadline', date: 'March 30, 2026', content: 'Please ensure all Term 1 fees are settled by the end of the month.' },
    { id: 3, title: 'Easter Break Notice', date: 'April 10, 2026', content: 'School will be closed for Easter break from April 13th to April 20th.' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setError('');
    setFoundStudent(null);

    // Simulate API delay
    setTimeout(() => {
      const student = mockStudents.find(s => s.studentId === studentId);
      if (student) {
        setFoundStudent(student);
      } else {
        setError('Student ID not found. Please check and try again.');
      }
      setSearching(false);
    }, 800);
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Parent Portal</h1>
          <p className="text-zinc-500">Access your child's academic reports and school information.</p>
        </div>
        <div className="flex gap-3">
          <a 
            href="https://www.wsb.edu.vu/parents" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-50 transition-all"
          >
            <ExternalLink size={16} />
            Fee Structure
          </a>
          <a 
            href="https://drive.google.com/file/d/1_OYnG-Kt6wfaKmE-6eZGrVx652w5sQsE/view" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-50 transition-all"
          >
            <Book size={16} />
            School Rules
          </a>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Academic Report Access</h2>
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
                  Enter Student ID
                </label>
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                  <input 
                    type="text" 
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. 83684"
                    className="w-full bg-zinc-50 border-none rounded-2xl pl-14 pr-6 py-5 text-lg font-medium focus:ring-2 focus:ring-black/5 transition-all"
                    required
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={searching}
                className="w-full bg-zinc-950 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
              >
                {searching ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Search size={20} />
                    View Report Card
                  </>
                )}
              </button>
            </form>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}

              {foundStudent && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-10 pt-10 border-t border-zinc-100 space-y-8"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400">
                      <User size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{foundStudent.surname}, {foundStudent.firstName}</h3>
                      <p className="text-sm text-zinc-500">Class {foundStudent.classId} • {foundStudent.level}</p>
                    </div>
                  </div>

                  <div className="bg-zinc-50 rounded-3xl overflow-hidden border border-zinc-100">
                    <div className="p-6 border-b border-zinc-100 bg-zinc-100/50">
                      <h4 className="font-bold text-sm">Academic Performance - Term 1 2026</h4>
                    </div>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
                          <th className="px-6 py-4">Subject</th>
                          <th className="px-6 py-4">Mark</th>
                          <th className="px-6 py-4">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {[
                          { subject: 'Mathematics', mark: 85, grade: 'A' },
                          { subject: 'English', mark: 78, grade: 'B+' },
                          { subject: 'French', mark: 92, grade: 'A+' },
                          { subject: 'Science', mark: 81, grade: 'A-' },
                        ].map((row, i) => (
                          <tr key={i} className="text-sm">
                            <td className="px-6 py-4 font-medium">{row.subject}</td>
                            <td className="px-6 py-4">{row.mark}</td>
                            <td className="px-6 py-4 font-bold">{row.grade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="p-6 bg-zinc-100/30 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center italic">
                      Note: Printing is disabled for security reasons. Please contact the school for official hard copies.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <Megaphone size={24} className="text-zinc-950" />
              <h2 className="text-xl font-bold">Announcements</h2>
            </div>
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm">{ann.title}</h4>
                    <span className="text-[10px] font-bold text-zinc-400">{ann.date}</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-zinc-950 text-white p-8 rounded-[40px] shadow-xl space-y-4">
            <h3 className="font-bold">Support Contact</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Having trouble accessing your child's report? Contact our IT support team.
            </p>
            <div className="pt-2">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email</p>
              <p className="text-sm font-bold">it-support@wsb.edu.vu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentPortal;
