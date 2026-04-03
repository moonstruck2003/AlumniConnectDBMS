import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  User, 
  ChevronLeft, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  CheckCheck,
  Zap,
  MessageSquare
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import messageService from '../services/messageService';
import authService from '../services/authService';

const Messages = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await messageService.getMessages(id);
        setMessages(data);
      } catch (err) {
        setMessages([
          { message_id: 1, message_text: 'Hello! I saw your request. Can you provide more details?', sender: 'other', time: '10:00 AM' },
          { message_id: 2, message_text: 'Glad to connect! I want to discuss the Software Engineer role.', sender: 'me', time: '10:05 AM' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [id]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg = {
      message_id: Date.now(),
      message_text: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-row">
      <Sidebar />
      <div className="flex-1 lg:ml-[280px]">
        <Navbar />
        
        <main className="max-w-5xl mx-auto px-6 lg:px-10 pt-32 pb-20 h-[calc(100vh-40px)]">
          <Card className="flex flex-col !p-0 !bg-slate-900/60 border-slate-800/40 h-full relative overflow-hidden shadow-2xl">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-800/60 flex items-center justify-between sticky top-0 z-10 bg-slate-900/40 backdrop-blur-3xl">
              <div className="flex items-center gap-4">
                <Link to="/conversations" className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-white transition-all transform active:scale-95">
                  <ChevronLeft size={18} />
                </Link>
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-500 shadow-inner">
                   <User size={24} />
                </div>
                <div>
                   <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">Sarah Jenkins</h3>
                   <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Node
                   </span>
                </div>
              </div>
              <button className="p-3 rounded-xl text-slate-500 hover:text-white transition-all">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar scroll-smooth">
              {messages.map((msg) => (
                <div 
                  key={msg.message_id} 
                  className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} max-w-[80%] ${msg.sender === 'me' ? 'self-end' : 'self-start'}`}
                >
                  <div className={`px-6 py-4 rounded-[1.8rem] text-sm font-bold leading-relaxed tracking-tight ${msg.sender === 'me' ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-600/10' : 'bg-slate-800/80 text-slate-100 rounded-tl-none border border-slate-700/50 shadow-inner backdrop-blur-sm'}`}>
                    {msg.message_text}
                  </div>
                  <div className={`mt-2 flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest ${msg.sender === 'me' ? 'flex-row' : 'flex-row-reverse'}`}>
                    {msg.time}
                    {msg.sender === 'me' && <CheckCheck size={12} className="text-blue-400" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-6 border-t border-slate-800/60 bg-slate-900/20">
              <form onSubmit={handleSend} className="relative flex items-center gap-4">
                 <button type="button" className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-white transition-all transform active:scale-95">
                    <Paperclip size={20} />
                 </button>
                 <div className="relative flex-1 group/input">
                   <input 
                     type="text" 
                     placeholder="Type your message, Node..."
                     value={newMessage}
                     onChange={(e) => setNewMessage(e.target.value)}
                     className="w-full bg-slate-950 border-2 border-slate-800 rounded-[1.5rem] py-4 px-6 text-sm font-bold text-slate-100 focus:outline-none focus:border-blue-500/40 transition-all italic tracking-tight"
                   />
                   <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-500 transition-all">
                      <Smile size={20} />
                   </button>
                 </div>
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   type="submit"
                   className="p-4 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all border border-blue-400/20 flex items-center justify-center transform active:scale-95"
                 >
                    <Send size={20} strokeWidth={2.5} className="fill-current" />
                 </motion.button>
              </form>
            </div>

            <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none">
               <MessageSquare size={160} />
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Messages;
