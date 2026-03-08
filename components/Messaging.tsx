import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Search, 
  User, 
  Check, 
  CheckCheck,
  MoreVertical,
  Paperclip,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message, UserProfile } from '../types';
import { format } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import { SCHOOL_INFO } from '../constants';

interface MessagingProps {
  currentUser: UserProfile;
}

const Messaging: React.FC<MessagingProps> = ({ currentUser }) => {
  const [activeView, setActiveView] = useState<'chat' | 'sms' | 'info'>('chat');
  const [selectedContact, setSelectedContact] = useState<UserProfile | null>(null);
  const [messageText, setMessageText] = useState('');
  const [smsNumber, setSmsNumber] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Mock contacts
  const contacts: UserProfile[] = [
    { uid: 't1', name: 'Mr. John Smith', email: 'john@wsb.edu.vu', role: 'teacher', department: 'Maths' },
    { uid: 'p1', name: 'Mrs. Sarah Doe', email: 'sarah@gmail.com', role: 'parent', studentId: 's1' },
    { uid: 't2', name: 'Ms. Emily Brown', email: 'emily@wsb.edu.vu', role: 'teacher', department: 'Arts' },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedContact]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.uid,
      receiverId: selectedContact.uid,
      studentId: currentUser.studentId || selectedContact.studentId || 'unknown',
      content: messageText,
      timestamp: Date.now(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  return (
    <div className="h-[calc(100vh-64px)] flex bg-white rounded-3xl overflow-hidden border border-zinc-100 shadow-sm m-4">
      {/* Sidebar */}
      <div className="w-80 border-r border-zinc-100 flex flex-col">
        <div className="p-6 border-b border-zinc-100">
          <h2 className="text-xl font-bold mb-4">Communication</h2>
          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => setActiveView('chat')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeView === 'chat' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-500'}`}
            >
              Chat
            </button>
            <button 
              onClick={() => setActiveView('sms')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeView === 'sms' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-500'}`}
            >
              SMS
            </button>
            <button 
              onClick={() => setActiveView('info')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeView === 'info' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-500'}`}
            >
              Info
            </button>
          </div>
          {activeView === 'chat' && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Search contacts..." 
                className="w-full pl-10 pr-4 py-2 bg-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeView === 'chat' ? (
            contacts.map((contact) => (
              <button
                key={contact.uid}
                onClick={() => setSelectedContact(contact)}
                className={`w-full p-4 flex items-center gap-4 hover:bg-zinc-50 transition-all ${
                  selectedContact?.uid === contact.uid ? 'bg-zinc-50' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 font-bold">
                  {contact.name.charAt(0)}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm">{contact.name}</h4>
                    <span className="text-[10px] text-zinc-400">12:45 PM</span>
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-1">Click to start conversation</p>
                </div>
              </button>
            ))
          ) : activeView === 'info' ? (
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">School Emails</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-zinc-50 rounded-xl">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Admin</p>
                    <p className="text-xs font-medium">{SCHOOL_INFO.emails.admin}</p>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-xl">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Secretary</p>
                    <p className="text-xs font-medium">{SCHOOL_INFO.emails.secretary}</p>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-xl">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Bursar</p>
                    <p className="text-xs font-medium">{SCHOOL_INFO.emails.bursar}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Support</h4>
                <p className="text-xs text-zinc-500">For technical assistance, please contact the IT Office.</p>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-zinc-400">
              <p className="text-xs italic">Select SMS mode to send broadcast messages.</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-zinc-50/30">
        {activeView === 'sms' ? (
          <div className="flex-1 flex flex-col p-8 max-w-2xl mx-auto w-full space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">SMS Broadcast</h3>
              <p className="text-zinc-500 text-sm">Send messages to any Vodafone or Digicel number in Vanuatu.</p>
            </div>
            
            <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Recipient Number</label>
                <div className="flex gap-2">
                  <div className="bg-zinc-100 px-4 py-3 rounded-xl text-sm font-bold text-zinc-500">+678</div>
                  <input 
                    type="text" 
                    value={smsNumber}
                    onChange={(e) => setSmsNumber(e.target.value)}
                    placeholder="7xxxxxx or 5xxxxxx"
                    className="flex-1 bg-zinc-100 border-none rounded-xl text-sm px-4 py-3 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-zinc-400 italic">Supports all local networks (Vodafone, Digicel)</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Message Content</label>
                <textarea 
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Enter your message here..."
                  className="w-full bg-zinc-100 border-none rounded-2xl text-sm px-4 py-4 focus:outline-none resize-none"
                />
              </div>

              <button 
                onClick={() => {
                  alert(`SMS sent to ${smsNumber} via school gateway`);
                  setMessageText('');
                  setSmsNumber('');
                }}
                disabled={!smsNumber || !messageText}
                className="w-full bg-zinc-950 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Send SMS Note
              </button>
            </div>
          </div>
        ) : selectedContact ? (
          <>
            <div className="p-4 bg-white border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center font-bold">
                  {selectedContact.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{selectedContact.name}</h3>
                  <p className="text-[10px] text-emerald-500 font-medium uppercase tracking-wider">Online</p>
                </div>
              </div>
              <button className="p-2 hover:bg-zinc-100 rounded-full transition-all">
                <MoreVertical size={20} className="text-zinc-400" />
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              {messages.filter(m => 
                (m.senderId === currentUser.uid && m.receiverId === selectedContact.uid) ||
                (m.senderId === selectedContact.uid && m.receiverId === currentUser.uid)
              ).map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.senderId === currentUser.uid ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] p-4 rounded-2xl ${
                    msg.senderId === currentUser.uid 
                      ? 'bg-zinc-950 text-white rounded-tr-none' 
                      : 'bg-white border border-zinc-100 rounded-tl-none shadow-sm'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] opacity-50">
                        {format(msg.timestamp, 'HH:mm')}
                      </span>
                      {msg.senderId === currentUser.uid && (
                        msg.read ? <CheckCheck size={12} className="text-emerald-400" /> : <Check size={12} className="opacity-50" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-2">
                  <MessageSquare size={48} strokeWidth={1} />
                  <p className="text-sm">No messages yet. Send a greeting!</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-zinc-100">
              <div className="flex items-center gap-2 bg-zinc-100 p-2 rounded-2xl">
                <button className="p-2 hover:bg-zinc-200 rounded-xl transition-all text-zinc-500">
                  <Paperclip size={20} />
                </button>
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..." 
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="p-2 bg-zinc-950 text-white rounded-xl hover:bg-zinc-800 transition-all disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 space-y-4">
            <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center">
              <MessageSquare size={40} strokeWidth={1} />
            </div>
            <div className="text-center">
              <h3 className="text-zinc-900 font-bold">Select a conversation</h3>
              <p className="text-sm">Choose a contact from the left to start messaging.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messaging;
