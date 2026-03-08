import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  QrCode, 
  Package, 
  MoreVertical,
  Maximize2,
  Download
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'motion/react';
import { Asset } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const AssetManagement: React.FC = () => {
  const [showQR, setShowQR] = useState<Asset | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { t } = useLanguage();

  // Mock data
  const assets: Asset[] = [
    { id: 'A001', name: 'Microscope X-200', category: 'Science Lab', location: 'Lab 1', status: 'active', qrCode: 'WSB-A001' },
    { id: 'A002', name: 'MacBook Pro 14"', category: 'IT Department', location: 'Staff Room', status: 'active', qrCode: 'WSB-A002' },
    { id: 'A003', name: 'Acoustic Guitar', category: 'Arts Dept', location: 'Music Room', status: 'maintenance', qrCode: 'WSB-A003' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asset Management</h1>
          <p className="text-zinc-500">Track school property and generate QR identification tags.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-zinc-950 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all"
          >
            <Plus size={18} />
            Register Asset
          </button>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search assets by name or ID..." 
              className="w-full pl-10 pr-4 py-2 bg-zinc-100 rounded-xl text-sm focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="bg-zinc-100 border-none rounded-xl text-sm px-4 py-2 focus:outline-none">
              <option>All Categories</option>
              <option>Science Lab</option>
              <option>IT Department</option>
              <option>Arts Dept</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {assets.map((asset) => (
            <div key={asset.id} className="group bg-zinc-50/50 border border-zinc-100 rounded-3xl p-6 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-900">
                  <Package size={24} />
                </div>
                <button 
                  onClick={() => setShowQR(asset)}
                  className="p-2 bg-white rounded-xl shadow-sm text-zinc-400 hover:text-black transition-all"
                >
                  <QrCode size={20} />
                </button>
              </div>
              
              <div className="space-y-1 mb-6">
                <h3 className="font-bold text-lg">{asset.name}</h3>
                <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">{asset.category}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-zinc-400 mb-1">Asset ID</p>
                  <p className="font-bold">{asset.id}</p>
                </div>
                <div>
                  <p className="text-zinc-400 mb-1">Location</p>
                  <p className="font-bold">{asset.location}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-100 flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  asset.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 
                  asset.status === 'maintenance' ? 'bg-orange-50 text-orange-600' : 
                  'bg-red-50 text-red-600'
                }`}>
                  {asset.status}
                </span>
                <button className="text-zinc-400 hover:text-black transition-all">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-[40px] max-w-sm w-full text-center space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xl">Asset QR Code</h3>
              <button onClick={() => setShowQR(null)} className="p-2 hover:bg-zinc-100 rounded-full transition-all">
                <Plus className="rotate-45" />
              </button>
            </div>
            
            <div className="bg-zinc-50 p-8 rounded-3xl flex items-center justify-center border border-zinc-100">
              <QRCodeSVG 
                value={showQR.qrCode} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="space-y-1">
              <p className="font-bold text-lg">{showQR.name}</p>
              <p className="text-sm text-zinc-400">{showQR.id}</p>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-zinc-100 text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
                <Download size={18} />
                Download
              </button>
              <button className="flex-1 bg-zinc-950 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                <Maximize2 size={18} />
                Print Tag
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Asset Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white p-8 rounded-[40px] max-w-lg w-full space-y-6"
          >
            <h3 className="font-bold text-2xl">Register New Asset</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Asset Name</label>
                <input type="text" className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" placeholder="e.g. Digital Projector" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Category</label>
                  <select className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none">
                    <option>IT Department</option>
                    <option>Science Lab</option>
                    <option>Arts Dept</option>
                    <option>General</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Location</label>
                  <input type="text" className="w-full bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none" placeholder="e.g. Room 302" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Initial Status</label>
                <div className="flex gap-2">
                  {['active', 'maintenance', 'retired'].map((status) => (
                    <button key={status} className="flex-1 py-2 bg-zinc-100 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-all">
                      {status}
                    </button>
                  ))}
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
              <button className="flex-1 bg-zinc-950 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all">
                Register Asset
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AssetManagement;
