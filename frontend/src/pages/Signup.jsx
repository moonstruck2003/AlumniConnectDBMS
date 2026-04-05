import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, BookOpen, GraduationCap, Briefcase, ArrowRight, FileText, Building2, Link as LinkIcon, Mail, Lock, Hash } from 'lucide-react';
import axios from 'axios';

export default function Signup() {
  const [role, setRole] = useState('Student');
  
  // Base details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [bio, setBio] = useState('');

  // Role specific details
  const [studentId, setStudentId] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [department, setDepartment] = useState('');
  
  const [companyName, setCompanyName] = useState('');
  
  const [alumniCompany, setAlumniCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roles = [
    { id: 'Alumni', icon: <User className="w-5 h-5 mb-2" /> },
    { id: 'Student', icon: <GraduationCap className="w-5 h-5 mb-2" /> },
    { id: 'Recruiter', icon: <Briefcase className="w-5 h-5 mb-2" /> }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`.trim(), // keeping for compatibility
        email: email,
        password: password,
        linkedin_url: linkedinUrl,
        bio: bio,
        role: role.toLowerCase(),
      };

      if (role === 'Student') {
        payload.student_id = studentId;
        payload.cgpa = cgpa;
        payload.department = department;
      } else if (role === 'Recruiter') {
        payload.company_name = companyName;
      } else if (role === 'Alumni') {
        payload.company = alumniCompany;
        payload.job_title = jobTitle;
      }

      const response = await axios.post('http://127.0.0.1:8000/api/signup', payload);

      if (response.status === 201) {
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(', ')
        : 'Server connection failed';
      alert('Signup Error: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-4 overflow-hidden relative">
      <div className="w-full max-w-5xl bg-[#111827] border border-slate-800 rounded-2xl shadow-xl flex overflow-hidden min-h-[750px] relative z-10">
        
        {/* Left Side */}
        <div className="hidden lg:flex lg:w-[45%] relative bg-gradient-to-br from-[#1d3557] via-[#152a45] to-[#0f1f33] p-12 flex-col justify-between overflow-hidden">
          <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-teal-500/20 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-teal-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">AlumniConnect</span>
            </div>
          </div>
          
          <div className="relative z-10 mb-20">
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Join Our Global<br />Network
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              Create an account to connect with peers, discover exclusive opportunities, and engage with your alma mater.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-[55%] bg-[#111827] flex flex-col p-8 lg:p-12 h-[750px] overflow-y-auto custom-scrollbar">
          <div className="w-full">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Create an Account</h3>
              <p className="text-slate-400 text-sm">Fill in your details to get started with AlumniConnect.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Role Selection */}
              <div>
                <label className="text-sm text-slate-300 block mb-3">I am a...</label>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`cursor-pointer p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        role === r.id 
                          ? 'border-teal-500 bg-[#111827] shadow-[inset_0_0_15px_rgba(20,184,166,0.15)] text-teal-400' 
                          : 'border-slate-800 hover:border-slate-700 text-slate-400 bg-[#172136]'
                      }`}
                    >
                      {r.icon}
                      <span className="text-xs font-semibold">{r.id}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Details Category */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 mt-6">Account Details</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="text-xs text-slate-400 block mb-1">First Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-slate-500" />
                        </div>
                        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required
                          className="w-full bg-[#172136] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                          placeholder="John" />
                      </div>
                    </div>
                    <div className="relative">
                      <label className="text-xs text-slate-400 block mb-1">Last Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-slate-500" />
                        </div>
                        <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required
                          className="w-full bg-[#172136] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                          placeholder="Doe" />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-slate-500" />
                      </div>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                        className="w-full bg-[#172136] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                        placeholder="you@university.edu" />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="text-xs text-slate-400 block mb-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-500" />
                      </div>
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                        className="w-full bg-[#172136] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                        placeholder="••••••••" />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="text-xs text-slate-400 block mb-1">LinkedIn URL (Optional)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="h-4 w-4 text-slate-500" />
                      </div>
                      <input type="url" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)}
                        className="w-full bg-[#172136] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                        placeholder="https://linkedin.com/in/username" />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="text-xs text-slate-400 block mb-1">Short Bio (Optional)</label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <FileText className="h-4 w-4 text-slate-500" />
                      </div>
                      <textarea value={bio} onChange={e => setBio(e.target.value)} rows="3"
                        className="w-full bg-[#172136] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors resize-none"
                        placeholder="Tell us a bit about yourself..." />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Section */}
              <AnimatePresence mode='wait'>
                {role === 'Student' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 mt-6">Student Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <label className="text-xs text-slate-400 block mb-1">Student ID</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Hash className="h-4 w-4 text-slate-500" />
                            </div>
                            <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} required
                              className="w-full bg-[#172136] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                              placeholder="e.g. 2024-1-60-XXX" />
                          </div>
                        </div>
                        <div className="relative">
                          <label className="text-xs text-slate-400 block mb-1">CGPA</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FileText className="h-4 w-4 text-slate-500" />
                            </div>
                            <input type="number" step="0.01" max="4.0" min="0" value={cgpa} onChange={e => setCgpa(e.target.value)} required
                              className="w-full bg-[#172136] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                              placeholder="e.g. 3.85" />
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <label className="text-xs text-slate-400 block mb-1">Department</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building2 className="h-4 w-4 text-slate-500" />
                          </div>
                          <input type="text" value={department} onChange={e => setDepartment(e.target.value)} required
                            className="w-full bg-[#172136] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                            placeholder="Computer Science" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {role === 'Recruiter' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 mt-6">Company Detail</h4>
                    <div className="space-y-4">
                      <div className="relative">
                        <label className="text-xs text-slate-400 block mb-1">Company Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building2 className="h-4 w-4 text-slate-500" />
                          </div>
                          <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required
                            className="w-full bg-[#172136] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                            placeholder="Acme Corp" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {role === 'Alumni' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 mt-6">Alumni Details</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <label className="text-xs text-slate-400 block mb-1">Current Company (Optional)</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Building2 className="h-4 w-4 text-slate-500" />
                            </div>
                            <input type="text" value={alumniCompany} onChange={e => setAlumniCompany(e.target.value)}
                              className="w-full bg-[#172136] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                              placeholder="Google" />
                          </div>
                        </div>
                        <div className="relative">
                          <label className="text-xs text-slate-400 block mb-1">Job Title (Optional)</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Briefcase className="h-4 w-4 text-slate-500" />
                            </div>
                            <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                              className="w-full bg-[#172136] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                              placeholder="Software Engineer" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                disabled={loading}
                type="submit"
                className="w-full flex items-center justify-center py-3.5 px-4 bg-teal-500 hover:bg-teal-600 text-slate-900 rounded-lg text-sm font-bold transition-all disabled:opacity-50 mt-4"
              >
                {loading ? 'Processing...' : 'Create Account'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </form>

            <div className="mt-8 text-center text-sm pb-10">
              <p className="text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-teal-400 hover:text-teal-300">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hide scrollbar styles locally */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111827; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569; 
        }
      `}</style>
    </div>
  );
}
