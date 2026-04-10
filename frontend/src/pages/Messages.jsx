import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  User as UserIcon, 
  Loader2, 
  MessageSquare, 
  Search,
  ChevronLeft,
  Circle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import messageService from '../services/messageService';
import authService from '../services/authService';

export default function Messages() {
  const { id: urlId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (urlId && conversations.length > 0) {
      const selected = conversations.find(c => c.user_id.toString() === urlId);
      if (selected) {
        setActiveUser(selected);
      }
    } else if (location.state?.selectedUser) {
        const sel = location.state.selectedUser;
        setActiveUser(sel);
        // If not in conversations list, we should probably add it temporarily or refresh
    }
  }, [urlId, conversations]);

  useEffect(() => {
    if (activeUser) {
      fetchMessages(activeUser.user_id);
      
      const interval = setInterval(() => {
        fetchMessages(activeUser.user_id, false);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const data = await messageService.getConversations();
      if (data) {
        setConversations(data);
      }
    } catch (error) {
      console.error('Failed to fetch conversations', error);
    } finally {
      setIsLoadingChats(false);
    }
  };

  const fetchMessages = async (userId, showLoading = true) => {
    if (showLoading) setIsLoadingMessages(true);
    try {
      const data = await messageService.getConversation(userId);
      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      if (showLoading) setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUser) return;

    const content = newMessage;
    setNewMessage('');

    try {
      // Optimistic update
      const tempMsg = {
        message_id: Date.now(),
        sender_id: user?.user_id || user?.id,
        receiver_id: activeUser.user_id,
        content: content,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, tempMsg]);

      await messageService.sendMessage(activeUser.user_id, content);
      fetchMessages(activeUser.user_id, false);
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.profile?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.profile?.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6 h-[calc(100vh-80px)]">
        
        {/* Sidebar */}
        <motion.aside 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`w-full md:w-80 lg:w-96 flex flex-col bg-slate-900/50 border border-slate-800/60 rounded-[2rem] overflow-hidden ${activeUser && 'hidden md:flex'}`}
        >
          <div className="p-6 border-b border-slate-800/60">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Messages</h2>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all font-bold text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 custom-scrollbar">
            {isLoadingChats ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-10 opacity-30">
                <MessageSquare size={48} className="mx-auto mb-4 text-slate-600" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">No active conversations found.</p>
              </div>
            ) : (
              filteredConversations.map((chatUser) => (
                <div 
                  key={chatUser.user_id}
                  onClick={() => {
                    setActiveUser(chatUser);
                    navigate(`/messages/${chatUser.user_id}`);
                  }}
                  className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${activeUser?.user_id === chatUser.user_id ? 'bg-blue-600/10 border-blue-500/30 shadow-lg shadow-blue-500/5' : 'bg-transparent border-transparent hover:bg-slate-800/40'}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform shadow-inner shrink-0">
                    <UserIcon size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-white uppercase tracking-tight truncate leading-none mb-1">
                      {chatUser.name || `${chatUser.profile?.first_name} ${chatUser.profile?.last_name}`}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate leading-none italic">
                      {chatUser.role} member
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.aside>

        {/* Chat Area */}
        <motion.main 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`flex-1 flex flex-col bg-slate-900/50 border border-slate-800/60 rounded-[2rem] overflow-hidden ${!activeUser && 'hidden md:flex'}`}
        >
          {activeUser ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-slate-800/60 flex items-center justify-between bg-slate-900/40 backdrop-blur-3xl">
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveUser(null)} className="p-2 md:hidden text-slate-400 hover:text-white">
                    <ChevronLeft size={24} />
                  </button>
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-500 shadow-inner">
                    <UserIcon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">
                      {activeUser.name || `${activeUser.profile?.first_name} ${activeUser.profile?.last_name}`}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Messages History */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6 custom-scrollbar scroll-smooth">
                {isLoadingMessages && messages.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                  </div>
                ) : (
                  <AnimatePresence>
                    {messages.map((msg) => {
                      const isMine = Number(msg.sender_id) === Number(user?.user_id || user?.id);
                      return (
                        <motion.div 
                          key={msg.message_id}
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className={`flex flex-col ${isMine ? 'items-end ml-auto' : 'items-start mr-auto'} max-w-[85%] md:max-w-[70%]`}
                        >
                          <div className={`px-5 py-3 rounded-2xl text-sm font-bold leading-relaxed tracking-tight ${isMine ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-600/10 border border-blue-400/20' : 'bg-slate-800/80 text-slate-100 rounded-tl-none border border-slate-700/50 shadow-inner backdrop-blur-sm'}`}>
                            {msg.content}
                          </div>
                          <span className="mt-1.5 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-slate-800/60 bg-slate-900/20">
                <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      placeholder="Type your signal, Node..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl py-3.5 px-6 text-sm font-bold text-slate-100 focus:outline-none focus:border-blue-500/40 transition-all italic tracking-tight"
                    />
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-3.5 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500 disabled:opacity-50 disabled:grayscale transition-all border border-blue-400/20 flex items-center justify-center"
                  >
                    <Send size={20} strokeWidth={2.5} className="fill-current" />
                  </motion.button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-20 grayscale opacity-20">
               <div className="w-24 h-24 bg-slate-950 rounded-[2rem] flex items-center justify-center border border-slate-800 mb-8 shadow-2xl">
                  <MessageSquare size={48} className="text-slate-600" />
               </div>
               <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest mb-3 leading-none italic">No conversation selected.</h3>
               <p className="text-sm font-bold text-slate-600 uppercase tracking-tight leading-none italic">Select a contact to start messaging.</p>
            </div>
          )}
        </motion.main>
      </div>
    </div>
  );
}
