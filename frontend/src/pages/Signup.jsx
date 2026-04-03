import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, BookOpen, GraduationCap, Briefcase, ShieldCheck } from 'lucide-react';
import axios from 'axios'; // Import Axios

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roles = [
    { id: 'Student', icon: <GraduationCap className="w-5 h-5" />, color: 'blue' },
    { id: 'Alumni', icon: <User className="w-5 h-5" />, color: 'amber' },
    { id: 'Recruiter', icon: <Briefcase className="w-5 h-5" />, color: 'emerald' },
    { id: 'Admin', icon: <ShieldCheck className="w-5 h-5" />, color: 'rose' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/signup', {
        name: name,
        email: email,
        password: password,
        role: role.toLowerCase(), // Detection: Normalizes 'Alumni' to 'alumni' for DB
      });

      if (response.status === 201) {
        console.log('Signup Successful:', response.data);
        // Detection Logic: Redirect based on role
        if (role.toLowerCase() === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-500/30 overflow-hidden relative">
      {/* Background Blurs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-teal-600/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl bg-slate-900 border border-slate-800/80 rounded-[2.5rem] shadow-2xl flex overflow-hidden min-h-[650px] relative z-10"
      >
        {/* Left Side - Visual/Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-900 via-indigo-900 to-teal-900 p-12 flex-col justify-between overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-white">
              <div className="w-12 h-12 bg-slate-900/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                <BookOpen className="w-6 h-6 text-teal-300" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white/90">AlumniConnect</span>
            </div>
          </div>
          <div className="relative z-10 mt-auto">
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Join the Alumni <br /> Community
            </h2>
            <p className="text-blue-100/80 text-lg max-w-sm leading-relaxed">
              Sign up to connect, mentor, and grow with your alma mater's network.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-16 flex flex-col justify-center bg-slate-900">
          <div className="max-w-md w-full mx-auto">
            <div className="text-center lg:text-left mb-10">
              <h3 className="text-3xl font-bold text-white tracking-tight mb-2">Create Your Account</h3>
              <p className="text-slate-400 text-sm">Fill in your details to join the platform.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-300 block">Select Your Role</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {roles.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`cursor-pointer p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden group/role ${
                        role === r.id 
                          ? `border-blue-500/50 bg-blue-500/5` 
                          : 'border-slate-800 bg-transparent hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        role === r.id 
                          ? `bg-blue-600 text-white shadow-lg` 
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        {r.icon}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${
                        role === r.id ? `text-blue-400` : 'text-slate-600'
                      }`}>
                        {r.id}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white outline-none focus:border-blue-500/50 transition-all text-sm"
                    placeholder="Your Name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white outline-none focus:border-blue-500/50 transition-all text-sm"
                    placeholder="you@university.edu"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white outline-none focus:border-blue-500/50 transition-all text-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block ml-1">Confirm</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full px-4 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white outline-none focus:border-blue-500/50 transition-all text-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Sign Up'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-blue-600 hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
