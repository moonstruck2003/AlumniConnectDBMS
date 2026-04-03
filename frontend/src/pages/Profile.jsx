import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  MapPin, 
  Globe, 
  Award, 
  CheckCircle, 
  Edit3, 
  Camera, 
  Zap,
  Linkedin,
  Github,
  Twitter
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import authService from '../services/authService';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = authService.getCurrentUser();
    setUser(userData);
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-row">
      <Sidebar />
      <div className="flex-1 lg:ml-[280px]">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20">
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            
            {/* Left Column: Essential Info */}
            <div className="xl:col-span-1 flex flex-col gap-8">
              <Card className="!p-0 !bg-slate-900/60 relative overflow-hidden group border-slate-800/40 shadow-2xl">
                 <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />
                 
                 <div className="px-8 pb-10 -mt-16 flex flex-col items-center text-center relative z-10">
                    <div className="relative group/avatar">
                      <div className="w-32 h-32 rounded-[2.5rem] bg-slate-950 p-1 shadow-2xl border border-slate-800 transition-transform group-hover/avatar:scale-105">
                        <div className="w-full h-full rounded-[2.2rem] bg-slate-900 flex items-center justify-center overflow-hidden">
                           <User className="text-slate-500 w-12 h-12" />
                        </div>
                      </div>
                      <button className="absolute bottom-1 right-1 p-2 rounded-xl bg-indigo-500 text-white shadow-xl opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                         <Camera size={14} />
                      </button>
                    </div>
                    
                    <h2 className="text-3xl font-black text-white mt-6 tracking-tighter uppercase">{user?.name || 'Network Node'}</h2>
                    <p className="text-indigo-400 font-bold uppercase tracking-widest text-[10px] mt-2 mb-8">{user?.role || 'Guest Entity'}</p>
                    
                    <div className="grid grid-cols-3 gap-4 w-full border-t border-slate-800/60 pt-8">
                       <div className="flex flex-col">
                          <span className="text-lg font-black text-white">124</span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Connects</span>
                       </div>
                       <div className="flex flex-col border-x border-slate-800/60">
                          <span className="text-lg font-black text-white">42</span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Projects</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-lg font-black text-white">920</span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Signal</span>
                       </div>
                    </div>
                 </div>
              </Card>

              <Card className="!p-8 !bg-slate-900/60 border-slate-800/40">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <Globe size={14} className="text-slate-400" />
                  Digital Footprint
                </h4>
                <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-3 text-slate-400 text-xs font-bold hover:text-white transition-colors cursor-pointer">
                      <Mail size={16} />
                      {user?.email || 'node@alumni.net'}
                   </div>
                   <div className="flex items-center gap-3 text-slate-400 text-xs font-bold hover:text-white transition-colors cursor-pointer">
                      <Linkedin size={16} />
                      linkedin.com/in/node
                   </div>
                   <div className="flex items-center gap-3 text-slate-400 text-xs font-bold hover:text-white transition-colors cursor-pointer">
                      <Github size={16} />
                      github.com/nodearchive
                   </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Detailed Sections */}
            <div className="xl:col-span-2 flex flex-col gap-10">
               <Card className="!p-10 !bg-slate-900/60 border-slate-800/40 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800/60">
                     <h4 className="flex items-center gap-3 text-xl font-black uppercase text-white tracking-tighter">
                        <Award size={20} className="text-amber-500" />
                        Professional Synopsis
                     </h4>
                     <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
                        <Edit3 size={12} />
                        Update Node
                     </button>
                  </div>
                  
                  <div className="flex flex-col gap-8">
                     <p className="text-lg text-slate-300 font-medium leading-relaxed italic">
                        "Focused on building scalable digital ecosystems and fostering meaningful connections within the global alumni network. Specializing in full-stack architecture and mentor engagement."
                     </p>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                        <div className="flex flex-col gap-4">
                           <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest">Specializations</h5>
                           <div className="flex flex-wrap gap-2">
                              {['React', 'Node.js', 'System Design', 'ML Ops', 'Cloud Ops'].map(skill => (
                                 <span key={skill} className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-400">{skill}</span>
                              ))}
                           </div>
                        </div>
                        
                        <div className="flex flex-col gap-4">
                           <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest">Verifications</h5>
                           <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                 <CheckCircle size={14} className="text-emerald-500" />
                                 <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Alumni Identity Verified</span>
                              </div>
                              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                 <CheckCircle size={14} className="text-blue-500" />
                                 <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Premium Mentor Badge</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="absolute -top-20 -right-20 opacity-5 pointer-events-none">
                     <Zap size={300} className="text-blue-500" />
                  </div>
               </Card>

               <Card className="!p-10 !bg-slate-900/60 border-slate-800/40 grayscale opacity-50">
                   <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800/60">
                     <h4 className="text-lg font-black uppercase text-white tracking-tighter italic">Operational Timeline</h4>
                   </div>
                   <div className="py-12 flex flex-col items-center justify-center text-center">
                       <Zap size={32} className="text-slate-700 mb-4" />
                       <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No timeline activity detected in local buffer</p>
                   </div>
               </Card>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
