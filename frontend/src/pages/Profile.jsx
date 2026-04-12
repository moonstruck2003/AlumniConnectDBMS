import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Globe, 
  Award, 
  CheckCircle, 
  Edit3, 
  Camera, 
  Zap,
  Linkedin,
  Github,
  Save,
  X,
  Trash2,
  Briefcase,
  GraduationCap,
  Building2,
  BarChart3,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import userService from '../services/userService';
import authService from '../services/authService';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  
  // Unified form data state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    linkedin_url: '',
    // Role specific
    cgpa: '',
    department: '',
    company: '',
    job_title: '',
    is_accepting_mentee: true,
    company_name: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      setUser(response.user);
      
      // Update local storage for global refresh
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      // Initialize form with fetched data
      setFormData({
        first_name: response.user?.profile?.first_name || '',
        last_name: response.user?.profile?.last_name || '',
        bio: response.user?.profile?.bio || '',
        linkedin_url: response.user?.profile?.linkedin_url || '',
        cgpa: response.user?.student?.cgpa || '',
        department: response.user?.student?.department || '',
        company: response.user?.alumni?.company || '',
        job_title: response.user?.alumni?.job_title || '',
        is_accepting_mentee: response.user?.alumni?.is_accepting_mentee ?? true,
        company_name: response.user?.recruiter?.company_name || ''
      });
    } catch (err) {
      console.error("Failed to load profile data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await userService.updateProfile(formData);
      setUser(response.user);
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile. Please check the data and try again.");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("CRITICAL ACTION: Are you sure you want to delete your node from the network? This operation is irreversible.")) {
      try {
        await userService.deleteAccount();
        await authService.logout();
        navigate('/login');
      } catch (err) {
        console.error("Failed to delete account", err);
        alert("Operation failed. Ensure you are authenticated and try again.");
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 font-sans selection:bg-indigo-500/30">
      <Navbar user={user} />
      
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* ----- SIDEBAR: PROFILE CARD ----- */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="!p-0 border-slate-800/40 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl sticky top-32">
               <div className="h-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-80" />
               <div className="px-8 pb-10 -mt-12 flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-3xl bg-slate-950 p-1.5 shadow-2xl border border-white/5 ring-4 ring-indigo-500/10">
                      <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden">
                         <User className="text-slate-700 w-12 h-12" />
                      </div>
                    </div>
                    <button className="absolute bottom-1 right-1 p-2.5 rounded-xl bg-indigo-600 text-white shadow-xl hover:scale-110 transition-transform border border-white/10">
                       <Camera size={16} />
                    </button>
                  </div>
                  
                  <h2 className="text-2xl font-black text-white mt-6 tracking-tight uppercase leading-none">
                     {user?.name || 'User Profile'}
                  </h2>
                  <div className="flex items-center gap-2 mt-3">
                     <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                       {user?.role}
                     </span>
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-white/5">
                     <div className="flex flex-col items-start px-4">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none mb-2">Connects</span>
                        <span className="text-xl font-black text-white">42</span>
                     </div>
                     <div className="flex flex-col items-start px-4 border-l border-white/5">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none mb-2">Status</span>
                        <span className={`text-xl font-black ${user?.is_verified ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {user?.is_verified ? 'Verified' : 'Pending'}
                        </span>
                     </div>
                  </div>
               </div>
            </Card>

            <button 
              onClick={handleDeleteAccount}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl border border-red-500/10 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-all font-black text-[10px] uppercase tracking-widest mt-4 group"
            >
              <Trash2 size={14} className="group-hover:rotate-12 transition-transform" />
              Delete Account
            </button>
          </div>

          {/* ----- MAIN CONTENT: PROFILE INFORMATION ----- */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <Card className="!p-10 border-slate-800/40 bg-slate-900/60 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
               <div className="flex items-center justify-between mb-12 relative z-10 border-b border-white/5 pb-8">
                 <div>
                   <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Profile Information</h1>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-3">ID: {user?.user_id || 'UNKNOWN'}</p>
                 </div>
                 
                 <AnimatePresence mode="wait">
                   {isEditing ? (
                     <motion.div key="edit-actions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex gap-3">
                        <button onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl bg-slate-950 border border-white/10 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                           <X size={14} className="inline mr-2" />
                           Cancel
                        </button>
                        <button onClick={handleSave} className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all">
                           <Save size={14} className="inline mr-2" />
                           Save
                        </button>
                     </motion.div>
                   ) : (
                     <motion.button key="view-actions" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onClick={() => setIsEditing(true)} className="px-8 py-3 rounded-xl bg-slate-950 border border-white/10 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-white hover:border-indigo-500/30 transition-all group">
                        <Edit3 size={14} className="inline mr-2 group-hover:rotate-12 transition-transform" />
                        Edit Profile
                     </motion.button>
                   )}
                 </AnimatePresence>
               </div>

               <div className="space-y-12 relative z-10">
                 {/* Basic Info */}
                 <section className="space-y-6">
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] flex items-center gap-3">
                      <User size={12} />
                      Personal Details
                    </h4>
                    
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">First Name</label>
                           <input 
                             type="text" 
                             value={formData.first_name}
                             onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                             className="bg-slate-950 border border-white/5 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                           />
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Name</label>
                           <input 
                             type="text" 
                             value={formData.last_name}
                             onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                             className="bg-slate-950 border border-white/5 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                           />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-slate-200">{user?.profile?.first_name} {user?.profile?.last_name}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${user?.is_verified ? 'text-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-amber-500/80'}`}>
                           {user?.is_verified ? '✓ Verified Identity' : '⚠ Verification Pending'}
                        </span>
                      </div>
                    )}
                 </section>

                 {/* Contact Channels Section */}
                 <section className="space-y-6 border-t border-white/5 pt-10">
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] flex items-center gap-3">
                      <Mail size={12} />
                      Contact Channels
                    </h4>
                    
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2 opacity-50">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email (Read Only)</label>
                           <div className="bg-slate-950/50 border border-white/5 rounded-xl px-5 py-4 text-sm text-slate-400 font-bold">
                              {user?.email}
                           </div>
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">LinkedIn URL</label>
                           <input 
                             type="text" 
                             value={formData.linkedin_url}
                             onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                             className="bg-slate-950 border border-white/5 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                             placeholder="https://linkedin.com/in/username"
                           />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-950/40 border border-white/5">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center">
                               <Mail size={16} className="text-indigo-400" />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Email Address</span>
                               <span className="text-xs font-bold text-slate-200">{user?.email}</span>
                            </div>
                         </div>
                         <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-950/40 border border-white/5 group bg-slate-900 cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center group-hover:border-indigo-500/30 transition-colors">
                               <Linkedin size={16} className="text-indigo-400" />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">LinkedIn</span>
                               <span className="text-xs font-bold text-slate-200 truncate max-w-[150px]">{user?.profile?.linkedin_url || 'Not Connected'}</span>
                            </div>
                         </div>
                      </div>
                    )}
                 </section>

                 {/* Role Info */}
                 <section className="space-y-6 border-t border-white/5 pt-10">
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] flex items-center gap-3">
                      {user?.role === 'alumni' ? <Briefcase size={12} /> : user?.role === 'student' ? <GraduationCap size={12} /> : <Building2 size={12} />}
                      Employment & Education
                    </h4>
                    
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {user?.role === 'student' && (
                          <>
                            <div className="flex flex-col gap-2">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CGPA</label>
                               <div className="relative">
                                 <input 
                                   type="number" step="0.01" max="4" min="0"
                                   value={formData.cgpa}
                                   onChange={(e) => setFormData({...formData, cgpa: e.target.value})}
                                   className="w-full bg-slate-950 border border-white/5 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                                 />
                                 <BarChart3 className="absolute right-4 top-4 text-slate-600" size={16} />
                               </div>
                            </div>
                            <div className="flex flex-col gap-2">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Department</label>
                               <input 
                                 type="text" 
                                 value={formData.department}
                                 onChange={(e) => setFormData({...formData, department: e.target.value})}
                                 className="bg-slate-950 border border-white/5 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                               />
                            </div>
                          </>
                        )}
                        {user?.role === 'alumni' && (
                          <>
                            <div className="flex flex-col gap-2">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Job Title</label>
                               <input 
                                 type="text" 
                                 value={formData.job_title}
                                 onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                                 className="bg-slate-950 border border-white/5 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                               />
                            </div>
                            <div className="flex flex-col gap-2">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Company</label>
                               <input 
                                 type="text" 
                                 value={formData.company}
                                 onChange={(e) => setFormData({...formData, company: e.target.value})}
                                 className="bg-slate-950 border border-white/5 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                               />
                            </div>
                          </>
                        )}
                        {user?.role === 'recruiter' && (
                          <div className="flex flex-col gap-2 col-span-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Company Name</label>
                             <input 
                               type="text" 
                               value={formData.company_name}
                               onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                               className="bg-slate-950 border border-white/5 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                             />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-8">
                         {user?.role === 'student' && (
                           <>
                             <div className="flex flex-col gap-1">
                               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">CGPA</span>
                               <span className="text-lg font-black text-slate-200">{user?.student?.cgpa || '0.00'}</span>
                             </div>
                             <div className="flex flex-col gap-1">
                               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Department</span>
                               <span className="text-lg font-black text-slate-200">{user?.student?.department || 'Not Set'}</span>
                             </div>
                           </>
                         )}
                         {user?.role === 'alumni' && (
                           <>
                             <div className="flex flex-col gap-1">
                               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Job Title</span>
                               <span className="text-lg font-black text-slate-200">{user?.alumni?.job_title || 'N/A'}</span>
                             </div>
                             <div className="flex flex-col gap-1">
                               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Company</span>
                               <span className="text-lg font-black text-slate-200">{user?.alumni?.company || 'N/A'}</span>
                             </div>
                           </>
                         )}
                         {user?.role === 'recruiter' && (
                           <div className="flex flex-col gap-1">
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Recruiting Firm</span>
                             <span className="text-lg font-black text-slate-200">{user?.recruiter?.company_name || 'N/A'}</span>
                           </div>
                         )}
                      </div>
                    )}
                 </section>

                 {/* Bio Section */}
                 <section className="space-y-6 border-t border-white/5 pt-10">
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] flex items-center gap-3">
                      <Award size={12} />
                      About Me
                    </h4>
                    
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Biography</label>
                        <textarea 
                          rows={4}
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                          className="bg-slate-950 border border-white/5 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold resize-none"
                        />
                      </div>
                    ) : (
                      <div className="p-6 bg-slate-950/50 rounded-2xl border border-white/5">
                        <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
                          "{user?.profile?.bio || 'You haven\'t added a bio yet. Click edit to tell the network about yourself.'}"
                        </p>
                      </div>
                    )}
                 </section>

                 {/* Mentorship Toggle - ONLY FOR ALUMNI */}
                 {user?.role === 'alumni' && (
                    <section className="space-y-6 border-t border-white/5 pt-10">
                      <div className="flex items-center justify-between p-8 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
                        <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${formData.is_accepting_mentee ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-800 border-slate-700'}`}>
                            <Users className={`w-6 h-6 ${formData.is_accepting_mentee ? 'text-emerald-400' : 'text-slate-500'}`} />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-white uppercase italic tracking-tight">Mentorship Program</h4>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                              {formData.is_accepting_mentee ? "Currently accepting new mentees" : "Not accepting mentees right now"}
                            </p>
                          </div>
                        </div>

                        {isEditing ? (
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, is_accepting_mentee: formData.is_accepting_mentee ? 0 : 1})}
                            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border ${formData.is_accepting_mentee ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-slate-950 text-slate-500 border-white/5'}`}
                          >
                            {formData.is_accepting_mentee ? "ON" : "OFF"}
                          </button>
                        ) : (
                          <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border ${formData.is_accepting_mentee ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800/20 text-slate-500 border-slate-800'}`}>
                            {formData.is_accepting_mentee ? "Active" : "Paused"}
                          </div>
                        )}
                      </div>
                    </section>
                  )}
               </div>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
