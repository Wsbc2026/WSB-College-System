import React from 'react';
import { Book, Printer, Eye, Download, Shield, Info, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

const StudentHandbook: React.FC = () => {
  const printHandbook = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const content = `
      <html>
        <head>
          <title>Student Handbook - WSB College</title>
          <style>
            body { font-family: sans-serif; padding: 40px; line-height: 1.6; color: #333; }
            .header { text-align: center; border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 40px; }
            h1 { margin: 0; font-size: 28px; }
            h2 { border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 30px; color: #000; }
            .section { margin-bottom: 30px; }
            .rules-list { padding-left: 20px; }
            .rules-list li { margin-bottom: 10px; }
            .footer { margin-top: 50px; font-size: 12px; text-align: center; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>WHITE SANDS BILINGUAL COLLEGE</h1>
            <h2>STUDENT HANDBOOK 2026</h2>
          </div>
          
          <div class="section">
            <h2>1. Introduction</h2>
            <p>Welcome to White Sands Bilingual College. This handbook outlines the expectations, rules, and guidelines for all students to ensure a productive and safe learning environment.</p>
          </div>

          <div class="section">
            <h2>2. School Mission</h2>
            <p>To provide high-quality bilingual education that empowers students to become global citizens while respecting their local heritage.</p>
          </div>

          <div class="section">
            <h2>3. Code of Conduct</h2>
            <ul class="rules-list">
              <li>Respect all staff, students, and school property.</li>
              <li>Punctuality is mandatory for all classes and school activities.</li>
              <li>School uniform must be worn correctly at all times.</li>
              <li>Mobile phones are not permitted during class hours.</li>
              <li>Bullying and harassment of any kind will not be tolerated.</li>
            </ul>
          </div>

          <div class="section">
            <h2>4. Academic Expectations</h2>
            <p>Students are expected to complete all assignments on time and participate actively in class. Academic honesty is paramount.</p>
          </div>

          <div class="section">
            <h2>5. Health and Safety</h2>
            <p>Students must follow all safety protocols in laboratories, workshops, and on the playground.</p>
          </div>

          <div class="footer">
            <p>&copy; 2026 White Sands Bilingual College. All Rights Reserved.</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Handbook</h1>
          <p className="text-zinc-500">Official guidelines and school policies for students and parents.</p>
        </div>
        <button 
          onClick={printHandbook}
          className="flex items-center gap-2 bg-zinc-950 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg"
        >
          <Printer size={18} />
          Print Handbook
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-zinc-950">
              <Shield size={24} />
              <h2 className="text-xl font-bold">Core Policies</h2>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Attendance Policy', desc: 'Students must maintain at least 90% attendance to be eligible for final exams.' },
                { title: 'Uniform Code', desc: 'Full school uniform is required Monday to Thursday. Sports gear on Fridays.' },
                { title: 'Bilingualism', desc: 'Students are encouraged to use both English and French in appropriate contexts.' },
                { title: 'Digital Citizenship', desc: 'Responsible use of school technology and internet resources.' },
              ].map((policy, i) => (
                <div key={i} className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100 flex gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    <CheckCircle size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{policy.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1">{policy.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-zinc-950 text-white p-8 rounded-[40px] shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <Info size={24} />
              <h2 className="text-xl font-bold">Important Dates</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Term 1 Start</p>
                <p className="text-lg font-bold">Feb 2nd, 2026</p>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Mid-Term Break</p>
                <p className="text-lg font-bold">Apr 15th - 22nd</p>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Annual Sports Day</p>
                <p className="text-lg font-bold">June 12th, 2026</p>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Graduation Ceremony</p>
                <p className="text-lg font-bold">Nov 28th, 2026</p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-sm space-y-4">
            <h3 className="font-bold">Quick Links</h3>
            <div className="space-y-2">
              <a 
                href="https://drive.google.com/file/d/1_OYnG-Kt6wfaKmE-6eZGrVx652w5sQsE/view" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl hover:bg-zinc-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Book size={18} className="text-zinc-400" />
                  <span className="text-sm font-medium">School Rules</span>
                </div>
                <Eye size={16} className="text-zinc-300 group-hover:text-zinc-950 transition-all" />
              </a>
              <a 
                href="https://www.wsb.edu.vu/parents" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl hover:bg-zinc-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Download size={18} className="text-zinc-400" />
                  <span className="text-sm font-medium">Fee Structure</span>
                </div>
                <Eye size={16} className="text-zinc-300 group-hover:text-zinc-950 transition-all" />
              </a>
            </div>
          </div>

          <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100 space-y-4">
            <h3 className="font-bold text-emerald-900">Need Help?</h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              If you have any questions regarding the handbook or school policies, please contact the administration office.
            </p>
            <div className="pt-2">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Office Email</p>
              <p className="text-sm font-bold text-emerald-900">admin@wsb.edu.vu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHandbook;
