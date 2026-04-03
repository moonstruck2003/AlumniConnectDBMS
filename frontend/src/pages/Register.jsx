import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Mail, 
  Lock, 
  User, 
  UserCircle, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import FormInput from '../components/FormInput';
import Card from '../components/Card';
import authService from '../services/authService';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authService.register({ name, email, password, role });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'The network rejected your application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[140px] animate-pulse" />

      <Card className="w-full max-w-[560px] !p-12 !bg-slate-900/60 backdrop-blur-3xl border-white/10 shadow-2xl relative overflow-hidden">
        
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6 group cursor-pointer"
          >
            <Sparkles className="text-white w-8 h-8 group-hover:rotate-12 transition-transform duration-500" strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase mb-2">Request Membership</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
            <ShieldCheck size={12} className="text-amber-500" />
            Establish Your Identity
          </p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-10">
          {/* Role Selection */}
          <div className="flex flex-col gap-4">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-center">Identity Role</label>
             <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-3xl border-2 transition-all duration-300 font-bold uppercase tracking-tighter text-sm ${role === 'student' ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-xl' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                >
                  <UserCircle size={18} />
                  Student
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('alumni')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-3xl border-2 transition-all duration-300 font-bold uppercase tracking-tighter text-sm ${role === 'alumni' ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400 shadow-xl' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                >
                  <Users size={18} />
                  Alumni
                </button>
             </div>
          </div>

          <div className="flex flex-col gap-6">
            <FormInput 
              label="Full Name / Handle"
              placeholder="Your professional name"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <FormInput 
              label="Network Email"
              type="email"
              placeholder="name@email.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FormInput 
              label="Primary Security Key"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-lavish w-full py-5 text-lg font-black uppercase tracking-widest flex items-center justify-center gap-3 !bg-indigo-600 !text-white !shadow-indigo-600/20 hover:!bg-indigo-500"
            disabled={loading}
          >
            {loading ? 'Transmitting Data...' : 'Initiate Membership'}
            {!loading && <ArrowRight size={20} strokeWidth={3} />}
          </motion.button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-800/60 flex flex-col items-center gap-4">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-none">Already in the network?</p>
          <Link 
            to="/login" 
            className="text-amber-500 font-black uppercase tracking-widest text-sm hover:text-white transition-colors"
          >
            Authorize Access →
          </Link>
        </div>

      </Card>
    </div>
  );
};

export default Register;
