import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, ArrowRight, Filter, Search, PlusCircle, Star } from 'lucide-react';
import Navbar from '../components/navbar';
import './Events.css';

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Global Alumni Networking 2024",
    date: "OCT 24",
    time: "6:00 PM - 9:00 PM",
    location: "Grand Hall & Virtual",
    category: "Networking",
    attendees: 450,
    image: "https://images.unsplash.com/photo-1511578334221-6f6f3d24d94b?auto=format&fit=crop&q=80&w=800",
    featured: true
  },
  {
    id: 2,
    title: "Tech Career Fair: Autumn Edition",
    date: "NOV 12",
    time: "10:00 AM - 4:00 PM",
    location: "Engineering Complex",
    category: "Career",
    attendees: 1200,
    image: "https://images.unsplash.com/photo-1540575861501-7ce05b40a190?auto=format&fit=crop&q=80&w=800",
    featured: false
  },
  {
    id: 3,
    title: "Start-up Pitch Competition",
    date: "NOV 20",
    time: "2:00 PM - 6:00 PM",
    location: "Innovation Hub",
    category: "Workshop",
    attendees: 150,
    image: "https://images.unsplash.com/photo-1475721027185-404119d1e1f?auto=format&fit=crop&q=80&w=800",
    featured: false
  },
  {
    id: 4,
    title: "Data Science Webinar: Future Trends",
    date: "DEC 05",
    time: "7:30 PM - 9:00 PM",
    location: "Online (Zoom)",
    category: "Webinar",
    attendees: 800,
    image: "https://images.unsplash.com/photo-1591115765373-520b297b8332?auto=format&fit=crop&q=80&w=800",
    featured: false
  },
  {
    id: 5,
    title: "Annual Sports Meet & Gala",
    date: "DEC 15",
    time: "All Day",
    location: "University Stadium",
    category: "Networking",
    attendees: 2000,
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800",
    featured: true
  }
];

export default function Events() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Networking', 'Career', 'Workshop', 'Webinar'];

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
                    src={event.image} 
                    alt={event.title}
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
                    <div className="flex items-center gap-4 text-teal-400/60 text-xs font-black uppercase tracking-widest">
                      <Users className="w-5 h-5" />
                      {event.attendees}+ Registered
                    </div>
                  </div>

                  <button className="w-full py-5 bg-slate-950 group-hover:bg-white text-white group-hover:text-slate-950 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-slate-800 group-hover:border-white flex items-center justify-center gap-3 shadow-xl">
                    Secure Passage
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
