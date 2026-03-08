import React, { useState } from 'react';
import { 
  Plus, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Building2,
  Trash2,
  Wrench,
  Home,
  Utensils,
  UserCheck
} from 'lucide-react';
import { StaffRequest } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const StaffRequests: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const { t } = useLanguage();

  // Mock data
  const requests: StaffRequest[] = [
    { 
      id: 'REQ001', 
      type: 'Material',
      department: 'Science', 
      description: 'Lab supplies for Term 2',
      items: [{ name: 'Beakers 500ml', quantity: 20 }, { name: 'Safety Goggles', quantity: 50 }], 
      status: 'pending', 
      requesterId: 't1', 
      requestDate: '2024-03-05' 
    },
    { 
      id: 'REQ002', 
      type: 'Maintenance',
      description: 'Staff house #4 roof leak',
      status: 'approved', 
      requesterId: 't2', 
      requestDate: '2024-03-01' 
    },
  ];

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Maintenance': return <Home size={24} />;
      case 'Handy Man': return <Wrench size={24} />;
      case 'Boarding Master': return <UserCheck size={24} />;
      case 'Chief Cook': return <Utensils size={24} />;
      default: return <Building2 size={24} />;
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff & Department Requests</h1>
          <p className="text-zinc-500">Maintenance, supply, and operational requests for the Principal.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-zinc-950 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all"
        >
          <Plus size={18} />
          New Request
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map((req) => (
          <div key={req.id} className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  req.type === 'Maintenance' ? 'bg-orange-50 text-orange-600' :
                  req.type === 'Material' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {getTypeIcon(req.type)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{req.type} Request</h3>
                  <p className="text-xs text-zinc-400">ID: {req.id} • {req.requestDate}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                req.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                req.status === 'rejected' ? 'bg-red-50 text-red-600' :
                'bg-orange-50 text-orange-600'
              }`}>
                {req.status === 'approved' && <CheckCircle2 size={12} />}
                {req.status === 'rejected' && <XCircle size={12} />}
                {req.status === 'pending' && <Clock size={12} />}
                {req.status}
              </span>
            </div>

            <p className="text-sm text-zinc-600 mb-6">{req.description}</p>

            {req.items && req.items.length > 0 && (
              <div className="space-y-3 mb-8">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Requested Items</p>
                <div className="space-y-2">
                  {req.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-zinc-50 rounded-xl">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-xs font-bold bg-white px-2 py-1 rounded-lg shadow-sm">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button className="flex-1 bg-zinc-100 text-black py-3 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all">
                View Details
              </button>
              {req.status === 'pending' && (
                <div className="flex gap-2">
                  <button className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all">
                    <CheckCircle2 size={20} />
                  </button>
                  <button className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all">
                    <XCircle size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[40px] max-w-lg w-full space-y-6">
            <h3 className="font-bold text-2xl">Create New Request</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Request Type</label>
                <select className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none">
                  <option>Material</option>
                  <option>Maintenance</option>
                  <option>Handy Man</option>
                  <option>Boarding Master</option>
                  <option>Chief Cook</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Description</label>
                <textarea className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none h-24" placeholder="Describe your request..."></textarea>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setIsAdding(false)}
                className="flex-1 bg-zinc-100 text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all"
              >
                Cancel
              </button>
              <button className="flex-1 bg-zinc-950 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffRequests;
