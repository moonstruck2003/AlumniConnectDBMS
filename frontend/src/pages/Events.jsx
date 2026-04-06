import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, ArrowRight, Filter, Search, PlusCircle, Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import './Events.css';

export default function Events() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', startTime: '', endTime: '', location: '', category: 'Networking' });

  const handlePropose = async (e) => {
    e.preventDefault();
    try {
      let formattedDate = newEvent.date;
      if (newEvent.date.includes('-')) {
        const dateObj = new Date(newEvent.date);
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        formattedDate = `${monthNames[dateObj.getUTCMonth()]} ${String(dateObj.getUTCDate()).padStart(2, '0')}`;
      }

      const formatTime = (time24) => {
        if (!time24) return '';
        let [hours, minutes] = time24.split(':');
        hours = parseInt(hours, 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
      };

      const formattedTime = `${formatTime(newEvent.startTime)} - ${formatTime(newEvent.endTime)}`;

      const payload = { 
        title: newEvent.title,
        location: newEvent.location,
        category: newEvent.category,
        date: formattedDate,
        time: formattedTime 
      };

      const response = await api.post('/events', payload);
      setEvents([response, ...events]);
      setShowModal(false);
      setNewEvent({ title: '', date: '', startTime: '', endTime: '', location: '', category: 'Networking' });
    } catch (error) {
      console.error('Error proposing event:', error);
      alert('Failed to propose event.');
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = ['All', 'Networking', 'Career', 'Workshop', 'Webinar'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const currentYear = new Date().getFullYear();
    const dateA = new Date(`${a.date} ${currentYear}`);
    const dateB = new Date(`${b.date} ${currentYear}`);
    return dateA - dateB;
  });

  const containerVariants = {
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 } 
    }
  };

  return (
    <div className="events-page bg-slate-950 min-h-screen text-slate-100 pb-20 selection:bg-amber-500/30">
      <Navbar />
      
      {/* Compact Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden border-b border-slate-800/50">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-amber-600/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black tracking-[0.3em] uppercase">
                <Calendar className="w-3.5 h-3.5" />
                Network Events
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase italic">
                The Legacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500">Gathering</span>
              </h1>
              <p className="text-base text-slate-400 font-medium leading-relaxed">
                Experience exclusive summits and industry-leading webinars.
              </p>
            </motion.div>

            <motion.button
              onClick={() => setShowModal(true)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg flex items-center gap-2 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              Propose Event
            </motion.button>
          </div>

          {/* Search and Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex flex-col md:flex-row items-center gap-4 p-2 rounded-[2.5rem] bg-slate-900/30 backdrop-blur-3xl border border-white/5 shadow-2xl"
          >
            <div className="flex-1 flex items-center gap-3 px-6 py-2 border-r border-slate-800/50 group/search">
              <Search className="w-5 h-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Locate a premier event..." 
                className="w-full bg-transparent border-none outline-none text-lg placeholder-slate-700 font-semibold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] whitespace-nowrap transition-all relative overflow-hidden group/cat ${
                    selectedCategory === cat 
                    ? 'text-slate-950' 
                    : 'text-slate-500 hover:text-slate-100'
                  }`}
                >
                  {selectedCategory === cat && (
                    <motion.div 
                      layoutId="event-cat-bg"
                      className="absolute inset-0 bg-amber-500 shadow-md shadow-amber-500/10"
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events Grid */}
      <main className="max-w-7xl mx-auto px-6">
        <motion.div 
            initial="visible"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode='popLayout'>
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                layout
                whileHover={{ y: -15 }}
                className="group relative flex flex-col bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl transition-all hover:border-amber-500/40"
              >
                {/* Image Container */}
                <div className="h-72 relative overflow-hidden">
                  <motion.img 
                    src={event.image || "https://images.unsplash.com/photo-1540575861501-7ce05b40a190?auto=format&fit=crop&q=80&w=800"} 
                    alt="" 
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1540575861501-7ce05b40a190?auto=format&fit=crop&q=80&w=800"; }}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80" />
                  
                  {/* Date Badge */}
                  <div className="absolute top-8 left-8 w-20 h-24 bg-slate-950/90 backdrop-blur-md rounded-[1.8rem] border border-white/10 flex flex-col items-center justify-center shadow-[0_15px_30px_rgba(0,0,0,0.5)] group-hover:border-amber-500/40 transition-colors">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1">{event.date.split(' ')[0]}</span>
                    <span className="text-3xl font-black text-white tracking-tight">{event.date.split(' ')[1]}</span>
                  </div>

                  {event.featured && (
                    <div className="absolute top-8 right-8 px-5 py-2.5 bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center gap-2 shadow-2xl opacity-100 scale-100 transition-transform">
                      <Star className="w-3 h-3 fill-current" />
                      Premier
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-10 flex-1 flex flex-col space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-amber-500/80 uppercase tracking-[0.3em]">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                      {event.category}
                    </div>
                    <h3 className="text-3xl font-black text-white leading-[1.1] tracking-tight group-hover:text-amber-400 transition-colors">
                      {event.title}
                    </h3>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                      <MapPin className="w-5 h-5 text-slate-700" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                      <Clock className="w-5 h-5 text-slate-700" />
                      {event.time}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Propose Event Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] w-full max-w-lg shadow-2xl relative"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Propose New Event</h2>
              
              <form onSubmit={handlePropose} className="space-y-4 text-left">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Event Title</label>
                  <input required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500 transition-colors" placeholder="e.g. AI Tech Summit" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Date</label>
                    <input type="date" required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500 transition-colors" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Start</label>
                      <input type="time" required value={newEvent.startTime} onChange={e => setNewEvent({...newEvent, startTime: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500 transition-colors" />
                    </div>
                    <div className="w-1/2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">End</label>
                      <input type="time" required value={newEvent.endTime} onChange={e => setNewEvent({...newEvent, endTime: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500 transition-colors" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Location</label>
                  <input required value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500 transition-colors" placeholder="e.g. Grand Hall" />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Category</label>
                  <select value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500 transition-colors">
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <button type="submit" className="w-full py-4 mt-6 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40">
                  Submit Event
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
