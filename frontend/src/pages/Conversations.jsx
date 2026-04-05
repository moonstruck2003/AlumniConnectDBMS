import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  User, 
  ChevronRight, 
  Clock, 
  Zap,
  MoreVertical
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import messageService from '../services/messageService';
import authService from '../services/authService';

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      const user = authService.getCurrentUser();
      if (!user) {
        setConversations([{ conversation_id: 1, title: "Sarah Jenkins", last_message: "Glad to connect!", time: "10:05 AM", unread: true }]);
        setLoading(false);
        return;
      }
      try {
        const data = await messageService.getConversations(user.user_id);
        setConversations(data);
      } catch (err) {
        setConversations([{ conversation_id: 1, title: "Sarah Jenkins", last_message: "Glad to connect!", time: "10:05 AM", unread: true }]);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const filteredConversations = conversations.filter(c => 
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 lg:px-10 pt-32 pb-20">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-800/60 pb-10">
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase italic leading-none">Signal Hub</h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Secure communication with the network elites.</p>
            </div>
            
            <div className="relative group w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search active frequencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all font-bold text-sm italic"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : (
              filteredConversations.length > 0 ? filteredConversations.map((conv) => (
                <Link key={conv.conversation_id} to={`/messages/${conv.conversation_id}`}>
                  <Card className="!p-6 !bg-slate-900/60 border-slate-800/40 hover:bg-slate-800/40 hover:border-blue-500/30 transition-all cursor-pointer group shadow-xl relative overflow-hidden">
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300 group-hover:scale-105 transition-transform duration-500 shadow-inner">
                        <User size={28} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <h3 className="text-lg font-black text-white uppercase tracking-tight truncate leading-none">{conv.title || "Sarah Jenkins"}</h3>
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                             <Clock size={12} />
                             {conv.time || "10:05 AM"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 font-bold tracking-tight truncate italic leading-none">{conv.last_message || "Buffered incoming signal..."}</p>
                      </div>
                      <div className="flex items-center gap-4 ml-4">
                         {conv.unread && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-glow shadow-blue-500/40" />}
                         <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:text-white group-hover:border-blue-500/20 transition-all">
                            <ChevronRight size={18} />
                         </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              )) : (
                <div className="text-center py-20 grayscale opacity-30">
                   <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 mx-auto mb-6">
                      <MessageSquare size={32} className="text-slate-600" />
                   </div>
                   <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">The frequency is silent.</h3>
                   <p className="text-xs font-bold text-slate-600 uppercase tracking-tight leading-none italic">Initiate communication to begin your legacy.</p>
                </div>
              )
            )}
          </div>
        </main>
    </div>
  );
};

export default Conversations;
