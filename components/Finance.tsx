import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Download, 
  Filter,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Printer,
  ChevronRight,
  FileText,
  Settings,
  Trash2,
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar
} from 'lucide-react';
import { FeeRecord, Expenditure, FeeSettings, StudentCategory, PaymentVoucher } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { DEFAULT_FEE_SETTINGS, SCHOOL_INFO } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

const Finance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'outstanding' | 'expenditures' | 'vouchers' | 'settings'>('overview');
  const [feeSettings, setFeeSettings] = useState<FeeSettings>(DEFAULT_FEE_SETTINGS);
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);
  const [isRecordingExpenditure, setIsRecordingExpenditure] = useState(false);
  const [isCreatingVoucher, setIsCreatingVoucher] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(null);
  const { t } = useLanguage();

  // Mock initial data
  const [records, setRecords] = useState<FeeRecord[]>([
    {
      id: 'FEE001',
      studentId: '83684',
      studentName: 'Katherine Robert',
      classId: '7A',
      term: 'Term 1',
      year: '2025',
      totalAmount: 50000,
      paidAmount: 30000,
      outstandingAmount: 20000,
      status: 'partial',
      dueDate: '2024-04-15',
      payments: [
        { id: 'P1', amount: 30000, date: '2024-02-10', method: 'Bank Transfer' }
      ]
    },
    {
      id: 'FEE002',
      studentId: '83685',
      studentName: 'Jean Lini',
      classId: '8B',
      term: 'Term 1',
      year: '2025',
      totalAmount: 50000,
      paidAmount: 50000,
      outstandingAmount: 0,
      status: 'paid',
      dueDate: '2024-04-15',
      payments: [
        { id: 'P2', amount: 50000, date: '2024-01-20', method: 'Cash' }
      ]
    }
  ]);

  const [expenditures, setExpenditures] = useState<Expenditure[]>([
    { id: 'E1', description: 'Stationery supplies', amount: 5000, date: '2024-02-15', category: 'Supplies', supplierName: 'Office World', quotationNumber: 'Q-1001' },
    { id: 'E2', description: 'Electricity bill', amount: 12000, date: '2024-02-20', category: 'Utilities', supplierName: 'UNELCO', quotationNumber: 'INV-2024-02' },
  ]);

  const [vouchers, setVouchers] = useState<PaymentVoucher[]>([
    { id: 'V1', payeeName: 'John Doe', payeeType: 'Ancillary Staff', description: 'Ground maintenance services', amount: 15000, date: '2024-03-01', approvedBy: 'Bursar', paymentMethod: 'Cash' },
    { id: 'V2', payeeName: 'Mary Smith', payeeType: 'Other', description: 'Catering for school event', amount: 25000, date: '2024-03-05', approvedBy: 'Principal', paymentMethod: 'Bank Transfer' },
  ]);

  const totalRevenue = records.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalOutstanding = records.reduce((acc, curr) => acc + (curr.totalAmount - curr.paidAmount), 0);
  const totalExpenditure = expenditures.reduce((acc, curr) => acc + curr.amount, 0);
  const netIncome = totalRevenue - totalExpenditure;
  const collectionRate = (totalRevenue / (records.reduce((acc, curr) => acc + curr.totalAmount, 0) || 1)) * 100;

  const handleDeletePayment = (recordId: string, paymentId: string) => {
    setRecords(prev => prev.map(record => {
      if (record.id === recordId) {
        const updatedPayments = record.payments.filter(p => p.id !== paymentId);
        const newPaidAmount = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
        return {
          ...record,
          payments: updatedPayments,
          paidAmount: newPaidAmount,
          outstandingAmount: record.totalAmount - newPaidAmount,
          status: newPaidAmount === 0 ? 'unpaid' : newPaidAmount >= record.totalAmount ? 'paid' : 'partial'
        };
      }
      return record;
    }));
  };

  const handleAddPayment = (recordId: string, amount: number, method: string) => {
    setRecords(prev => prev.map(record => {
      if (record.id === recordId) {
        const newPayment = { id: `P${Date.now()}`, amount, date: new Date().toISOString().split('T')[0], method };
        const updatedPayments = [...record.payments, newPayment];
        const newPaidAmount = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
        return {
          ...record,
          payments: updatedPayments,
          paidAmount: newPaidAmount,
          outstandingAmount: record.totalAmount - newPaidAmount,
          status: newPaidAmount >= record.totalAmount ? 'paid' : 'partial'
        };
      }
      return record;
    }));
    setIsRecordingPayment(false);
  };

  const printQuarterlyReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <html>
        <head>
          <title>Quarterly Financial Report</title>
          <style>
            body { font-family: sans-serif; padding: 40px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { bg-color: #f8f9fa; }
            .header { text-align: center; margin-bottom: 40px; }
            .summary { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 40px; }
            .card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Quarterly Financial Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="summary">
            <div class="card"><h3>Total Income</h3><p>VT ${totalRevenue.toLocaleString()}</p></div>
            <div class="card"><h3>Total Expenditure</h3><p>VT ${totalExpenditure.toLocaleString()}</p></div>
            <div class="card"><h3>Net Income</h3><p>VT ${netIncome.toLocaleString()}</p></div>
          </div>
          <h2>Income Details</h2>
          <table>
            <thead><tr><th>Student</th><th>Amount</th><th>Date</th><th>Method</th></tr></thead>
            <tbody>
              ${records.flatMap(r => r.payments.map(p => `<tr><td>${r.studentName}</td><td>VT ${p.amount.toLocaleString()}</td><td>${p.date}</td><td>${p.method}</td></tr>`)).join('')}
            </tbody>
          </table>
          <h2>Expenditure Details</h2>
          <table>
            <thead><tr><th>Description</th><th>Category</th><th>Amount</th><th>Date</th></tr></thead>
            <tbody>
              ${expenditures.map(e => `<tr><td>${e.description}</td><td>${e.category}</td><td>VT ${e.amount.toLocaleString()}</td><td>${e.date}</td></tr>`).join('')}
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
          <h1 className="text-3xl font-bold tracking-tight">{t('finance')}</h1>
          <p className="text-zinc-500">Manage fees, track expenditures, and generate reports.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={printQuarterlyReport}
            className="flex items-center gap-2 bg-zinc-100 text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all"
          >
            <Printer size={18} />
            Quarterly Report
          </button>
          <button 
            onClick={() => setIsCreatingVoucher(true)}
            className="flex items-center gap-2 bg-zinc-100 text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all"
          >
            <FileText size={18} />
            Create Voucher
          </button>
          <button 
            onClick={() => setIsRecordingExpenditure(true)}
            className="flex items-center gap-2 bg-zinc-100 text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all"
          >
            <ArrowUpCircle size={18} />
            Record Expenditure
          </button>
          <button 
            onClick={() => setIsRecordingPayment(true)}
            className="flex items-center gap-2 bg-zinc-950 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all"
          >
            <ArrowDownCircle size={18} />
            Record Payment
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <ArrowDownCircle size={20} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Total Income</p>
          </div>
          <p className="text-2xl font-bold">VT {totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-red-600">
            <ArrowUpCircle size={20} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Expenditure</p>
          </div>
          <p className="text-2xl font-bold">VT {totalExpenditure.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-zinc-950">
            <TrendingUp size={20} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Net Income</p>
          </div>
          <p className="text-2xl font-bold">VT {netIncome.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-blue-600">
            <CheckCircle2 size={20} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Collection</p>
          </div>
          <p className="text-2xl font-bold">{collectionRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-zinc-100 pb-px">
        {(['overview', 'payments', 'outstanding', 'expenditures', 'vouchers', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-2 text-sm font-bold capitalize transition-all relative ${
              activeTab === tab ? 'text-zinc-950' : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-950 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'settings' ? (
        <div className="bg-white border border-zinc-100 rounded-[32px] p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Fee Settings</h2>
              <p className="text-zinc-500 text-sm">Set fixed term amounts for student categories.</p>
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={feeSettings.term}
                onChange={(e) => setFeeSettings(prev => ({ ...prev, term: e.target.value }))}
                className="bg-zinc-100 border-none rounded-xl text-sm px-4 py-2 font-bold focus:outline-none"
              >
                <option>Term 1</option>
                <option>Term 2</option>
                <option>Term 3</option>
                <option>Term 4</option>
              </select>
              <select 
                value={feeSettings.year}
                onChange={(e) => setFeeSettings(prev => ({ ...prev, year: Number(e.target.value) }))}
                className="bg-zinc-100 border-none rounded-xl text-sm px-4 py-2 font-bold focus:outline-none"
              >
                <option>2025</option>
                <option>2026</option>
                <option>2027</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(['boarder', 'day_boarder', 'day_boarder_lunch'] as const).map(category => (
              <div key={category} className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {category.replace(/_/g, ' ')}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-bold">VT</span>
                  <input 
                    type="number"
                    value={feeSettings[category]}
                    onChange={(e) => setFeeSettings(prev => ({ ...prev, [category]: Number(e.target.value) }))}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-12 pr-4 font-bold focus:outline-none focus:ring-2 focus:ring-zinc-950/5"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-zinc-100 flex justify-end">
            <button className="bg-zinc-950 text-white px-8 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all">
              Save Fee Settings
            </button>
          </div>
        </div>
      ) : activeTab === 'outstanding' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Outstanding Fees by Class</h2>
            <button 
              onClick={() => {
                const printWindow = window.open('', '_blank');
                if (!printWindow) return;
                const content = `
                  <html>
                    <head><title>Outstanding Fees List</title><style>body{font-family:sans-serif;padding:40px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ddd;padding:12px;text-align:left;}</style></head>
                    <body>
                      <h1>Outstanding Fees List - ${new Date().toLocaleDateString()}</h1>
                      <table>
                        <thead><tr><th>Student</th><th>Class</th><th>Balance</th></tr></thead>
                        <tbody>
                          ${records.filter(r => r.outstandingAmount > 0).map(r => `<tr><td>${r.studentName}</td><td>${r.classId}</td><td>VT ${r.outstandingAmount.toLocaleString()}</td></tr>`).join('')}
                        </tbody>
                      </table>
                    </body>
                  </html>
                `;
                printWindow.document.write(content);
                printWindow.document.close();
                printWindow.print();
              }}
              className="flex items-center gap-2 bg-zinc-950 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all"
            >
              <Printer size={18} />
              Print Outstanding List
            </button>
          </div>
          <div className="bg-white border border-zinc-100 rounded-[32px] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-100">
                  <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Student</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Class</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Outstanding Amount</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {records.filter(r => r.outstandingAmount > 0).map((record) => (
                  <tr key={record.id} className="hover:bg-zinc-50/50 transition-all">
                    <td className="px-8 py-5">
                      <div>
                        <p className="font-bold text-sm">{record.studentName}</p>
                        <p className="text-xs text-zinc-400">{record.studentId}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium">{record.classId}</td>
                    <td className="px-8 py-5 text-sm font-bold text-red-600">VT {record.outstandingAmount.toLocaleString()}</td>
                    <td className="px-8 py-5">
                      <button 
                        onClick={() => alert(`Reminder note sent to parent of ${record.studentName} via SMS/Email`)}
                        className="flex items-center gap-2 text-zinc-950 hover:underline text-xs font-bold"
                      >
                        <FileText size={14} />
                        Send Note
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'expenditures' ? (
        <div className="bg-white border border-zinc-100 rounded-[32px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Description</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Supplier</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Quotation #</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {expenditures.map(e => (
                <tr key={e.id} className="hover:bg-zinc-50/50 transition-all">
                  <td className="px-8 py-5 font-bold text-sm">{e.description}</td>
                  <td className="px-8 py-5 text-sm">{e.supplierName || '-'}</td>
                  <td className="px-8 py-5 text-sm font-mono">{e.quotationNumber || '-'}</td>
                  <td className="px-8 py-5 text-sm">{e.category}</td>
                  <td className="px-8 py-5 font-bold text-red-600">VT {e.amount.toLocaleString()}</td>
                  <td className="px-8 py-5 text-sm text-zinc-500">{e.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === 'vouchers' ? (
        <div className="bg-white border border-zinc-100 rounded-[32px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Payee</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Description</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Approved By</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {vouchers.map(v => (
                <tr key={v.id} className="hover:bg-zinc-50/50 transition-all">
                  <td className="px-8 py-5 font-bold text-sm">{v.payeeName}</td>
                  <td className="px-8 py-5 text-sm">{v.payeeType}</td>
                  <td className="px-8 py-5 text-sm">{v.description}</td>
                  <td className="px-8 py-5 font-bold text-red-600">VT {v.amount.toLocaleString()}</td>
                  <td className="px-8 py-5 text-sm">{v.approvedBy}</td>
                  <td className="px-8 py-5 text-sm text-zinc-500">{v.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by student name or ID..." 
                className="w-full bg-white border border-zinc-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950/5 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-3 rounded-xl text-sm font-bold hover:bg-zinc-50 transition-all">
              <Filter size={18} />
              Filter by Class
            </button>
          </div>

          <div className="bg-white border border-zinc-100 rounded-[32px] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-100">
                  <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Student</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Class</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Fee</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Paid</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Balance</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {records.map((record) => (
                  <React.Fragment key={record.id}>
                    <tr className="hover:bg-zinc-50/50 transition-all group">
                      <td className="px-8 py-5">
                        <div>
                          <p className="font-bold text-sm">{record.studentName}</p>
                          <p className="text-xs text-zinc-400">{record.studentId}</p>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-medium">{record.classId}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold">VT {record.totalAmount.toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold text-emerald-600">VT {record.paidAmount.toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-sm font-bold ${record.totalAmount - record.paidAmount > 0 ? 'text-red-600' : 'text-zinc-400'}`}>
                          VT {(record.totalAmount - record.paidAmount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          record.status === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                          record.status === 'partial' ? 'bg-orange-50 text-orange-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              const newAmount = prompt('Enter individual fee amount for ' + record.studentName, record.totalAmount.toString());
                              if (newAmount !== null) {
                                setRecords(prev => prev.map(r => r.id === record.id ? { ...r, totalAmount: Number(newAmount), outstandingAmount: Number(newAmount) - r.paidAmount } : r));
                              }
                            }}
                            className="p-2 hover:bg-zinc-100 rounded-lg transition-all text-zinc-400 hover:text-black"
                            title="Edit Individual Fee"
                          >
                            <Settings size={16} />
                          </button>
                          <button 
                            onClick={() => setSelectedRecord(selectedRecord?.id === record.id ? null : record)}
                            className="p-2 hover:bg-zinc-100 rounded-lg transition-all" 
                            title="View Payments"
                          >
                            <ChevronRight size={16} className={`transition-transform ${selectedRecord?.id === record.id ? 'rotate-90' : ''}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {selectedRecord?.id === record.id && (
                      <tr className="bg-zinc-50/30">
                        <td colSpan={7} className="px-8 py-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Payment History</h4>
                              <button 
                                onClick={() => setIsRecordingPayment(true)}
                                className="text-[10px] font-bold text-zinc-950 hover:underline"
                              >
                                + Add Payment
                              </button>
                            </div>
                            {record.payments.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {record.payments.map(p => (
                                  <div key={p.id} className="bg-white p-4 rounded-2xl border border-zinc-100 flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-bold">VT {p.amount.toLocaleString()}</p>
                                      <p className="text-[10px] text-zinc-400">{p.date} • {p.method}</p>
                                    </div>
                                    <button 
                                      onClick={() => handleDeletePayment(record.id, p.id!)}
                                      className="p-2 text-zinc-300 hover:text-red-600 transition-all"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-zinc-400 italic">No payments recorded yet.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {isRecordingPayment && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white p-8 rounded-[40px] max-w-md w-full space-y-6"
            >
              <h3 className="text-2xl font-bold">Record Payment</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Student</label>
                  <select className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none">
                    {records.map(r => <option key={r.id} value={r.id}>{r.studentName}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Term</label>
                    <select className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none">
                      <option>Term 1</option>
                      <option>Term 2</option>
                      <option>Term 3</option>
                      <option>Term 4</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Year</label>
                    <select className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none">
                      <option>2025</option>
                      <option>2026</option>
                      <option>2027</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Amount (VT)</label>
                  <input type="number" className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3 px-4 text-sm font-bold focus:outline-none" placeholder="0" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Method</label>
                  <select className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none">
                    <option>Cash</option>
                    <option>Bank Transfer</option>
                    <option>Cheque</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsRecordingPayment(false)} className="flex-1 bg-zinc-100 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all">Cancel</button>
                <button onClick={() => handleAddPayment(records[0].id, 10000, 'Cash')} className="flex-1 bg-zinc-950 text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all">Save Payment</button>
              </div>
            </motion.div>
          </div>
        )}

        {isRecordingExpenditure && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white p-8 rounded-[40px] max-w-md w-full space-y-6"
            >
              <h3 className="text-2xl font-bold">Record Expenditure</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Description</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none" placeholder="What was this for?" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Supplier Name</label>
                    <input type="text" className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none" placeholder="Supplier" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Quotation #</label>
                    <input type="text" className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none" placeholder="Q-000" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Amount (VT)</label>
                  <input type="number" className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3 px-4 text-sm font-bold focus:outline-none" placeholder="0" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Category</label>
                  <select className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none">
                    <option>Utilities</option>
                    <option>Supplies</option>
                    <option>Maintenance</option>
                    <option>Salaries</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsRecordingExpenditure(false)} className="flex-1 bg-zinc-100 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all">Cancel</button>
                <button 
                  onClick={() => {
                    setExpenditures(prev => [...prev, { id: `E${Date.now()}`, description: 'New expenditure', amount: 1000, date: new Date().toISOString().split('T')[0], category: 'Other' }]);
                    setIsRecordingExpenditure(false);
                  }}
                  className="flex-1 bg-zinc-950 text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all"
                >
                  Save Expenditure
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {isCreatingVoucher && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white p-8 rounded-[40px] max-w-md w-full space-y-6"
            >
              <h3 className="text-2xl font-bold">Create Payment Voucher</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Payee Name</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none" placeholder="Name" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Payee Type</label>
                  <select className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none">
                    <option>Ancillary Staff</option>
                    <option>Teacher</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Description</label>
                  <input type="text" className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none" placeholder="Purpose of payment" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Amount (VT)</label>
                    <input type="number" className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3 px-4 text-sm font-bold focus:outline-none" placeholder="0" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Method</label>
                    <select className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none">
                      <option>Cash</option>
                      <option>Bank Transfer</option>
                      <option>Cheque</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsCreatingVoucher(false)} className="flex-1 bg-zinc-100 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all">Cancel</button>
                <button 
                  onClick={() => {
                    setVouchers(prev => [...prev, { id: `V${Date.now()}`, payeeName: 'New Payee', payeeType: 'Other', description: 'New voucher', amount: 5000, date: new Date().toISOString().split('T')[0], approvedBy: 'Bursar', paymentMethod: 'Cash' }]);
                    setIsCreatingVoucher(false);
                  }}
                  className="flex-1 bg-zinc-950 text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all"
                >
                  Create Voucher
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Finance;
