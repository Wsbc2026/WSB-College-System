import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Filter,
  MoreHorizontal,
  GraduationCap,
  FileText,
  Printer,
  ChevronRight,
  ChevronLeft,
  Save,
  Users
} from 'lucide-react';
import { AcademicRecord, Student, SubjectResult, Class, Incident } from '../types';
import { SCHOOL_INFO, GRADING_SCALE, SUBJECTS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { YEAR_10A_STUDENTS, MOCK_CLASSES } from '../mockData';

const AcademicRecords: React.FC = () => {
  const [activeView, setActiveView] = useState<'classes' | 'students' | 'entry' | 'report' | 'bulk'>('classes');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [reportLanguage, setReportLanguage] = useState<'en' | 'fr'>('en');
  const [selectedTerm, setSelectedTerm] = useState<string>('Term 1');
  const [selectedYear, setSelectedYear] = useState<string>('2026');

  const terms = [
    'Term 1',
    'Term 2',
    'Term 3',
    'Term 4',
    'End of Year Report Card'
  ];
  
  // Simulated persistent store for marks
  const [allAcademicRecords, setAllAcademicRecords] = useState<Record<string, AcademicRecord>>({
    's1': {
      id: 'r1',
      studentId: 's1',
      term: 'Mid-Year',
      year: '2025',
      results: [
        { subject: 'Mathematics', grade: 'C', mark: 54, average: 41, position: '7th', teacherComment: 'Average effort.', teacherInitials: 'LK' },
        { subject: 'Basic Science', grade: 'E', mark: 8, average: 19, position: '30th', teacherComment: 'Below average effort.', teacherInitials: 'WN' },
      ],
      overallPercentage: 31,
      overallPosition: '14th',
      gpa: 1.0,
      overallGrade: 'E',
      overallComment: 'Keep working hard to gain better grade.',
      classTeacherComment: 'Needs improvement a lot.',
      principalComment: '',
      detentionCount: 0,
      absentCount: 5
    }
  });

  const { t, language } = useLanguage();
  
  // Sync report language with app language initially
  useMemo(() => {
    setReportLanguage(language);
  }, [language]);

  // Mock data for classes
  const classes: Class[] = MOCK_CLASSES;

  // Mock data for students
  const students: Student[] = [
    { id: 's1', surname: 'Robert', firstName: 'Katherine', dob: '2012-05-15', studentId: '83684', birthReg: 'BR-12345', classId: '7A', stream: 'A', language: 'Anglophone', parentId: 'p1', gender: 'female', level: 'Junior', year: 7, category: 'boarder' },
    { id: 's2', surname: 'Lini', firstName: 'Jean', dob: '2011-08-22', studentId: '83685', birthReg: 'BR-12346', classId: '7A', stream: 'A', language: 'Anglophone', parentId: 'p2', gender: 'male', level: 'Junior', year: 7, category: 'day_boarder' },
    { id: 's3', surname: 'Brown', firstName: 'Robert', dob: '2012-01-10', studentId: '83686', birthReg: 'BR-12347', classId: '7A', stream: 'A', language: 'Anglophone', parentId: 'p3', gender: 'male', level: 'Junior', year: 7, category: 'day_boarder_lunch' },
    ...YEAR_10A_STUDENTS
  ];

  // Mock incidents for attendance/incident counts
  const incidents: Incident[] = [
    { id: 'i1', studentId: 's1', teacherId: 't1', description: 'Late', date: '2024-03-01', type: 'warning', count: 3, absentCount: 5 },
    { id: 'i2', studentId: 's1', teacherId: 't1', description: 'Disruptive', date: '2024-03-05', type: 'punishment', count: 1, absentCount: 0 },
  ];

  const filteredStudents = useMemo(() => {
    if (!selectedClass) return [];
    return students.filter(s => s.classId === selectedClass.id);
  }, [selectedClass]);

  const getStudentStats = (studentId: string) => {
    const studentIncidents = incidents.filter(i => i.studentId === studentId);
    const detentionCount = studentIncidents.filter(i => i.type === 'detention').length;
    const absentCount = studentIncidents.reduce((acc, curr) => acc + (curr.absentCount || 0), 0);
    const incidentCount = studentIncidents.length;
    return { detentionCount, absentCount, incidentCount };
  };

  const calculateResults = (marks: Record<string, number>) => {
    const results: SubjectResult[] = Object.entries(marks).map(([subject, mark]) => {
      const m = mark as number;
      const gradeInfo = GRADING_SCALE.find(s => m >= s.min && m <= s.max) || GRADING_SCALE[GRADING_SCALE.length - 1];
      return {
        subject,
        mark: m,
        grade: gradeInfo.grade,
        average: 50, // Mock average
        position: '1st', // Mock position
        teacherComment: 'Good effort',
        teacherInitials: 'AA'
      };
    });

    const totalMarks = results.reduce((acc, curr) => acc + curr.mark, 0);
    const overallPercentage = results.length > 0 ? Math.round(totalMarks / results.length) : 0;
    
    const overallGradeInfo = GRADING_SCALE.find(s => overallPercentage >= s.min && overallPercentage <= s.max) || GRADING_SCALE[GRADING_SCALE.length - 1];
    
    const totalGPA = results.reduce((acc, curr) => {
      const g = GRADING_SCALE.find(s => curr.mark >= s.min && curr.mark <= s.max);
      return acc + (g?.gpa || 0);
    }, 0);
    const gpa = results.length > 0 ? Number((totalGPA / results.length).toFixed(2)) : 0;

    return { results, overallPercentage, gpa, overallGrade: overallGradeInfo.grade };
  };

  const [currentMarks, setCurrentMarks] = useState<Record<string, number>>({});
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  const handleSave = () => {
    if (!selectedStudent || !selectedClass) return;

    const mergedMarks: Record<string, number> = {};
    const existingRecord = allAcademicRecords[selectedStudent.id];
    if (existingRecord) {
      existingRecord.results.forEach(r => mergedMarks[r.subject] = r.mark);
    }
    Object.entries(currentMarks).forEach(([sub, mark]) => {
      mergedMarks[sub] = mark as number;
    });

    const calculated = calculateResults(mergedMarks);
    const stats = getStudentStats(selectedStudent.id);

    const updatedRecord: AcademicRecord = {
      id: existingRecord?.id || `r-${selectedStudent.id}-${Date.now()}`,
      studentId: selectedStudent.id,
      term: selectedTerm,
      year: selectedYear,
      results: calculated.results,
      overallPercentage: calculated.overallPercentage,
      overallPosition: existingRecord?.overallPosition || 'TBD',
      gpa: calculated.gpa,
      overallGrade: calculated.overallGrade,
      overallComment: calculated.overallPercentage > 50 ? 'Satisfactory performance.' : 'Needs significant improvement.',
      classTeacherComment: existingRecord?.classTeacherComment || 'Good conduct in class.',
      principalComment: existingRecord?.principalComment || '',
      detentionCount: stats.detentionCount,
      absentCount: stats.absentCount
    };

    setAllAcademicRecords(prev => ({
      ...prev,
      [selectedStudent.id]: updatedRecord
    }));
    alert('Scores saved successfully.');
  };

  const handleSaveAndNext = () => {
    handleSave();
    const currentIndex = filteredStudents.findIndex(s => s.id === selectedStudent?.id);
    if (currentIndex < filteredStudents.length - 1) {
      const nextStudent = filteredStudents[currentIndex + 1];
      setSelectedStudent(nextStudent);
      const nextRecord = allAcademicRecords[nextStudent.id];
      if (nextRecord) {
        const marks: Record<string, number> = {};
        nextRecord.results.forEach(r => marks[r.subject] = r.mark);
        setCurrentMarks(marks);
      } else {
        setCurrentMarks({});
      }
    } else {
      alert('All students in this class have been processed.');
      setActiveView('students');
    }
  };

  const downloadTemplate = () => {
    const headers = 'Student ID,Subject,Mark\n';
    const rows = filteredStudents.map(s => `${s.studentId},Mathematics,`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'academic_records_template.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        // Simple CSV parser simulation
        const lines = text.split('\n');
        const newRecords = { ...allAcademicRecords };
        
        // Skip header
        for (let i = 1; i < lines.length; i++) {
          const [studentId, subject, mark] = lines[i].split(',');
          if (studentId && subject && mark) {
            const student = students.find(s => s.studentId === studentId.trim());
            if (student) {
              const existing = newRecords[student.id] || {
                id: `r-${student.id}-${Date.now()}`,
                studentId: student.id,
                term: selectedTerm,
                year: selectedYear,
                results: [],
                overallPercentage: 0,
                overallPosition: 'TBD',
                gpa: 0,
                overallGrade: '',
                overallComment: '',
                classTeacherComment: '',
                principalComment: '',
                detentionCount: 0,
                absentCount: 0
              };

              const marks: Record<string, number> = {};
              existing.results.forEach(r => marks[r.subject] = r.mark);
              marks[subject.trim()] = Number(mark.trim());

              const calculated = calculateResults(marks);
              newRecords[student.id] = {
                ...existing,
                results: calculated.results,
                overallPercentage: calculated.overallPercentage,
                gpa: calculated.gpa,
                overallGrade: calculated.overallGrade
              };
            }
          }
        }
        setAllAcademicRecords(newRecords);
        alert('Bulk upload completed successfully.');
        setActiveView('classes');
      };
      reader.readAsText(file);
    }
  };

  const mockRecord: AcademicRecord = {
    id: 'r1',
    studentId: 's1',
    term: 'Mid-Year',
    year: '2025',
    results: [
      { subject: 'Mathematics', grade: 'C', mark: 54, average: 41, position: '7th', teacherComment: 'Average effort.', teacherInitials: 'LK' },
      { subject: 'Basic Science', grade: 'E', mark: 8, average: 19, position: '30th', teacherComment: 'Below average effort.', teacherInitials: 'WN' },
    ],
    overallPercentage: 38,
    overallPosition: '14th',
    gpa: 1.0,
    overallGrade: 'E',
    overallComment: 'Keep working hard to gain better grade.',
    classTeacherComment: 'Needs improvement a lot.',
    principalComment: '',
    detentionCount: 0,
    absentCount: 5
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('academics')}</h1>
          <p className="text-zinc-500">Manage student performance and generate report cards.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const printWindow = window.open('', '_blank');
              if (!printWindow) return;
              const records = Object.values(allAcademicRecords) as AcademicRecord[];
              const content = `
                <html>
                  <head><title>Academic Records</title><style>body{font-family:sans-serif;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background:#f4f4f4;}</style></head>
                  <body>
                    <h1>Academic Records - WSB College</h1>
                    <table>
                      <thead><tr><th>Student ID</th><th>Term</th><th>Year</th><th>GPA</th><th>Grade</th></tr></thead>
                      <tbody>
                        ${records.map(r => `<tr><td>${r.studentId}</td><td>${r.term}</td><td>${r.year}</td><td>${r.gpa}</td><td>${r.overallGrade}</td></tr>`).join('')}
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
          <div className="flex items-center gap-2 bg-white border border-zinc-200 px-3 py-2 rounded-xl">
            <Filter size={16} className="text-zinc-400" />
            <select 
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="text-sm font-bold bg-transparent focus:outline-none"
            >
              {terms.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="w-px h-4 bg-zinc-200 mx-1" />
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-sm font-bold bg-transparent focus:outline-none"
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
          <button 
            onClick={() => setActiveView('bulk')}
            className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-50 transition-all"
          >
            <Download size={18} />
            {t('bulk_upload')}
          </button>
        </div>
      </header>

      {/* Class Selection View */}
      {activeView === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => {
                setSelectedClass(cls);
                setActiveView('students');
              }}
              className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-sm hover:shadow-md transition-all text-left group"
            >
              <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-zinc-950 group-hover:text-white transition-all">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-1">{cls.name}</h3>
              <p className="text-zinc-500 text-sm mb-4">{cls.department}</p>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t('enrolment')}: {cls.enrolment}</span>
                <ChevronRight size={18} className="text-zinc-300 group-hover:text-zinc-950 transition-all" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Student List View */}
      {activeView === 'students' && selectedClass && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setActiveView('classes')}
              className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-black"
            >
              <ChevronLeft size={18} />
              {t('all_classes')}
            </button>
            <h2 className="text-2xl font-bold">{selectedClass.name} - {t('student_list')}</h2>
          </div>

          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50/50 text-zinc-500 text-[10px] uppercase tracking-widest">
                  <th className="px-8 py-4 font-bold">{t('student')}</th>
                  <th className="px-8 py-4 font-bold">{t('student_id')}</th>
                  <th className="px-8 py-4 font-bold">{t('attendance')}</th>
                  <th className="px-8 py-4 font-bold">{t('incidents')}</th>
                  <th className="px-8 py-4 font-bold text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredStudents.map((student) => {
                  const stats = getStudentStats(student.id);
                  return (
                    <tr key={student.id} className="hover:bg-zinc-50/50 transition-all group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-zinc-500">
                            {student.firstName[0]}{student.surname[0]}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{student.surname}, {student.firstName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm">{student.studentId}</td>
                      <td className="px-8 py-5 text-sm">{stats.absentCount} {t('days')}</td>
                      <td className="px-8 py-5 text-sm">{stats.incidentCount} {t('records')}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => {
                              setSelectedStudent(student);
                              const existingRecord = allAcademicRecords[student.id];
                              if (existingRecord) {
                                const marks: Record<string, number> = {};
                                existingRecord.results.forEach(r => {
                                  marks[r.subject] = r.mark;
                                });
                                setCurrentMarks(marks);
                              } else {
                                setCurrentMarks({});
                              }
                              setActiveView('entry');
                            }}
                            className="flex items-center gap-2 bg-zinc-100 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-200 transition-all"
                          >
                            <Plus size={14} />
                            {t('enter_scores')}
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedStudent(student);
                              setActiveView('report');
                            }}
                            className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-black transition-all"
                          >
                            <FileText size={18} />
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
      )}

      {/* Score Entry View */}
      {activeView === 'entry' && selectedStudent && (
        <div className="bg-white p-10 rounded-[48px] border border-zinc-100 shadow-xl max-w-4xl mx-auto space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center font-bold text-zinc-500">
                {selectedStudent.firstName[0]}{selectedStudent.surname[0]}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{selectedStudent.surname}, {selectedStudent.firstName}</h3>
                <p className="text-zinc-500 text-sm">{selectedStudent.studentId} • {selectedClass?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  const idx = filteredStudents.findIndex(s => s.id === selectedStudent.id);
                  if (idx > 0) {
                    const prev = filteredStudents[idx - 1];
                    setSelectedStudent(prev);
                    const rec = allAcademicRecords[prev.id];
                    if (rec) {
                      const m: Record<string, number> = {};
                      rec.results.forEach(r => m[r.subject] = r.mark);
                      setCurrentMarks(m);
                    } else setCurrentMarks({});
                  }
                }}
                disabled={filteredStudents.findIndex(s => s.id === selectedStudent.id) === 0}
                className="p-2 hover:bg-zinc-100 rounded-xl disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => {
                  const idx = filteredStudents.findIndex(s => s.id === selectedStudent.id);
                  if (idx < filteredStudents.length - 1) {
                    const next = filteredStudents[idx + 1];
                    setSelectedStudent(next);
                    const rec = allAcademicRecords[next.id];
                    if (rec) {
                      const m: Record<string, number> = {};
                      rec.results.forEach(r => m[r.subject] = r.mark);
                      setCurrentMarks(m);
                    } else setCurrentMarks({});
                  }
                }}
                disabled={filteredStudents.findIndex(s => s.id === selectedStudent.id) === filteredStudents.length - 1}
                className="p-2 hover:bg-zinc-100 rounded-xl disabled:opacity-30 transition-all"
              >
                <ChevronRight size={20} />
              </button>
              <button 
                onClick={() => setActiveView('students')}
                className="ml-4 text-sm font-bold text-zinc-400 hover:text-black"
              >
                {t('cancel')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SUBJECTS.Junior.map((subject) => (
              <div key={subject} className={`p-6 rounded-3xl space-y-3 transition-all border ${currentMarks[subject] !== undefined ? 'bg-zinc-50 border-zinc-100' : 'bg-white border-zinc-100'}`}>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold">{subject}</label>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Mark %</span>
                </div>
                <input 
                  type="number" 
                  value={currentMarks[subject] || ''}
                  onChange={(e) => setCurrentMarks({...currentMarks, [subject]: Number(e.target.value)})}
                  className="w-full bg-white border border-zinc-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  placeholder="0-100"
                />
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-zinc-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('percentage')}</p>
                <p className="text-xl font-bold">{calculateResults(currentMarks).overallPercentage}%</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('gpa')}</p>
                <p className="text-xl font-bold">{calculateResults(currentMarks).gpa}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSave}
                className="px-6 py-4 rounded-2xl text-sm font-bold bg-zinc-100 hover:bg-zinc-200 transition-all"
              >
                {t('save')}
              </button>
              <button 
                onClick={handleSaveAndNext}
                className="flex items-center gap-2 bg-zinc-950 text-white px-8 py-4 rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-black/10"
              >
                <Save size={18} />
                {t('save_and_next')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Card View */}
      {activeView === 'report' && selectedStudent && (
        <div className="bg-white p-12 rounded-[48px] border border-zinc-100 shadow-2xl max-w-5xl mx-auto print:shadow-none print:p-0 print:border-none">
          <div className="flex justify-between items-start mb-12 print:hidden">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveView('students')}
                className="text-sm font-bold text-zinc-400 hover:text-black"
              >
                ← {t('student_list')}
              </button>
              <div className="h-4 w-px bg-zinc-200" />
              <div className="flex bg-zinc-100 p-1 rounded-xl">
                <button 
                  onClick={() => setReportLanguage('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${reportLanguage === 'en' ? 'bg-white shadow-sm text-black' : 'text-zinc-500 hover:text-black'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => setReportLanguage('fr')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${reportLanguage === 'fr' ? 'bg-white shadow-sm text-black' : 'text-zinc-500 hover:text-black'}`}
                >
                  Français
                </button>
              </div>
            </div>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-zinc-950 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-black/10"
            >
              <Printer size={18} />
              {t('print_pdf')}
            </button>
          </div>

          {allAcademicRecords[selectedStudent.id] ? (
            <div className="report-content">
              <div className="text-center space-y-4 mb-12 border-b border-zinc-100 pb-10">
                <img src={SCHOOL_INFO.logo} alt="Logo" className="w-24 h-24 mx-auto rounded-full mb-4 shadow-lg" />
                <h1 className="text-3xl font-bold tracking-tight uppercase">{SCHOOL_INFO.name}</h1>
                <h2 className="text-xl font-medium text-zinc-500 uppercase tracking-[0.2em]">
                  {allAcademicRecords[selectedStudent.id].year} {allAcademicRecords[selectedStudent.id].term} {reportLanguage === 'en' ? 'Report Card' : 'Bulletin Scolaire'}
                  <span className="block text-[10px] mt-1 opacity-50">
                    ({reportLanguage === 'en' ? 'English Version' : 'Version Française'})
                  </span>
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left mt-10 bg-zinc-50 p-8 rounded-[32px]">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{reportLanguage === 'en' ? 'Student ID' : 'ID Étudiant'}</p>
                    <p className="font-bold">{selectedStudent.studentId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{reportLanguage === 'en' ? 'Student Name' : 'Nom de l\'Étudiant'}</p>
                    <p className="font-bold">{selectedStudent.firstName} {selectedStudent.surname}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{reportLanguage === 'en' ? 'Class' : 'Classe'}</p>
                    <p className="font-bold">{selectedStudent.classId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{reportLanguage === 'en' ? 'Enrolment' : 'Effectif'}</p>
                    <p className="font-bold">{selectedClass?.enrolment || 41}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 text-[9px] mb-10 leading-relaxed border border-zinc-100 p-6 rounded-3xl bg-zinc-50/50">
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {GRADING_SCALE.slice(0, 8).map((scale) => (
                    <span key={scale.grade} className="font-bold text-zinc-900">
                      {scale.grade}: {scale.min}-{scale.max}%
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {GRADING_SCALE.slice(8).map((scale) => (
                    <span key={scale.grade} className="font-bold text-zinc-900">
                      {scale.grade}: {scale.min}-{scale.max}%
                    </span>
                  ))}
                  <span className="text-zinc-500 italic ml-2">
                    {reportLanguage === 'en' ? 'Grading Scale & Performance Indicators' : 'Échelle de notation et indicateurs de performance'}
                  </span>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-zinc-100 mb-10">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                      <th className="border-b border-zinc-100 p-4 text-left">{reportLanguage === 'en' ? 'Subject' : 'Matière'}</th>
                      <th className="border-b border-zinc-100 p-4 text-center">{reportLanguage === 'en' ? 'Grade' : 'Note'}</th>
                      <th className="border-b border-zinc-100 p-4 text-center">% {reportLanguage === 'en' ? 'Mark' : 'Note'}</th>
                      <th className="border-b border-zinc-100 p-4 text-center">{reportLanguage === 'en' ? 'Subject Average' : 'Moyenne'}</th>
                      <th className="border-b border-zinc-100 p-4 text-center">{reportLanguage === 'en' ? 'Position' : 'Rang'}</th>
                      <th className="border-b border-zinc-100 p-4 text-left">{reportLanguage === 'en' ? 'Teacher Comment' : 'Commentaire'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {allAcademicRecords[selectedStudent.id].results.map((res, i) => (
                      <tr key={i} className="hover:bg-zinc-50/30 transition-all">
                        <td className="p-4 font-bold text-zinc-900">{res.subject}</td>
                        <td className="p-4 text-center font-bold text-zinc-900">{res.grade}</td>
                        <td className="p-4 text-center">{res.mark || ''}</td>
                        <td className="p-4 text-center">{res.average || ''}</td>
                        <td className="p-4 text-center">{res.position}</td>
                        <td className="p-4 text-zinc-500 italic">{res.teacherComment} {res.teacherInitials ? `(${res.teacherInitials})` : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="overflow-hidden rounded-3xl border border-zinc-100 mb-12">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                      <th className="border-b border-zinc-100 p-4 text-center">{reportLanguage === 'en' ? 'Detention' : 'Retenue'}</th>
                      <th className="border-b border-zinc-100 p-4 text-center">{reportLanguage === 'en' ? 'Absence' : 'Absence'}</th>
                      <th className="border-b border-zinc-100 p-4 text-center">{reportLanguage === 'en' ? 'Overall %' : 'Moyenne Gén.'}</th>
                      <th className="border-b border-zinc-100 p-4 text-center">{reportLanguage === 'en' ? 'Position' : 'Rang'}</th>
                      <th className="border-b border-zinc-100 p-4 text-center">{reportLanguage === 'en' ? 'GPA' : 'GPA'}</th>
                      <th className="border-b border-zinc-100 p-4 text-center">{reportLanguage === 'en' ? 'Grade' : 'Mention'}</th>
                      <th className="border-b border-zinc-100 p-4 text-left">{reportLanguage === 'en' ? 'Overall Comment' : 'Commentaire Général'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-4 text-center font-medium">{allAcademicRecords[selectedStudent.id].detentionCount}</td>
                      <td className="p-4 text-center font-medium">{allAcademicRecords[selectedStudent.id].absentCount}</td>
                      <td className="p-4 text-center font-bold text-zinc-950">{allAcademicRecords[selectedStudent.id].overallPercentage}%</td>
                      <td className="p-4 text-center font-bold text-zinc-950">{allAcademicRecords[selectedStudent.id].overallPosition}</td>
                      <td className="p-4 text-center font-bold text-zinc-950">{allAcademicRecords[selectedStudent.id].gpa}</td>
                      <td className="p-4 text-center font-bold text-zinc-950">{allAcademicRecords[selectedStudent.id].overallGrade}</td>
                      <td className="p-4 text-zinc-500 italic">{allAcademicRecords[selectedStudent.id].overallComment}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-xs">
                <div className="space-y-6">
                  <div className="bg-zinc-50 p-6 rounded-[32px] min-h-[120px] border border-zinc-100">
                    <p className="font-bold mb-3 uppercase text-[10px] text-zinc-400 tracking-widest">{reportLanguage === 'en' ? 'Class Teacher\'s Comment' : 'Commentaire du Titulaire'}</p>
                    <p className="text-zinc-700 leading-relaxed">{allAcademicRecords[selectedStudent.id].classTeacherComment}</p>
                  </div>
                  <div className="pt-10 border-t border-dashed border-zinc-200">
                    <p className="font-bold text-zinc-900">{reportLanguage === 'en' ? 'Signature' : 'Signature'}: _________________________</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-zinc-50 p-6 rounded-[32px] min-h-[120px] border border-zinc-100">
                    <p className="font-bold mb-3 uppercase text-[10px] text-zinc-400 tracking-widest">{reportLanguage === 'en' ? 'Principal\'s Comment' : 'Commentaire du Principal'}</p>
                    <p className="text-zinc-700 leading-relaxed">{allAcademicRecords[selectedStudent.id].principalComment}</p>
                  </div>
                  <div className="pt-10 border-t border-dashed border-zinc-200">
                    <p className="font-bold text-zinc-900">{reportLanguage === 'en' ? 'Signature' : 'Signature'}: _________________________</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-zinc-500">No academic record found for this student. Please enter scores first.</p>
            </div>
          )}
        </div>
      )}

      {activeView === 'bulk' && (
        <div className="bg-white border border-zinc-100 rounded-[48px] p-16 text-center space-y-8 shadow-xl max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Download className="text-zinc-400" size={40} />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold">{t('bulk_upload')}</h3>
            <p className="text-zinc-500 max-w-sm mx-auto">Upload a CSV file with student IDs and marks for specific subjects to update records in bulk.</p>
          </div>
          <div className="flex flex-col items-center gap-6">
            <label className="cursor-pointer bg-zinc-950 text-white px-10 py-5 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-black/10">
              {t('select_csv')}
              <input type="file" accept=".csv" className="hidden" onChange={handleBulkUpload} />
            </label>
            <div className="flex items-center gap-6">
              <button 
                onClick={downloadTemplate}
                className="text-xs font-bold text-zinc-400 hover:text-black underline tracking-widest uppercase"
              >
                Download Template
              </button>
              <button 
                onClick={() => setActiveView('classes')}
                className="text-sm font-bold text-zinc-500 hover:text-black"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicRecords;
;
