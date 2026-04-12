import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Terminal, AlertCircle, ArrowRight } from 'lucide-react';
import adminService from '../services/adminService';

const AdminLogin = () => {
    const [credentials, setCredentials] = React.useState({ username: '', password: '' });
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await adminService.login(credentials.username, credentials.password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Unauthorized access. Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#020617] relative overflow-hidden font-outfit">
            {/* Dark Mode Animated Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-[120px] -ml-48 -mb-48" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md p-1 px-1 relative z-10"
            >
                {/* Glassmorphism Card */}
                <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative group">
                    {/* Inner highlight */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                    <div className="flex flex-col items-center mb-10 translate-y-0">
                        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                            <Shield className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight text-center">Admin Portal</h2>
                        <p className="text-slate-400 mt-3 text-center flex items-center gap-2">
                             <Terminal className="w-4 h-4 text-red-500/50" />
                             Restricted System Access
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm mb-4"
                                >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-5">
                            <div className="group/field relative">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Username</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="username"
                                        value={credentials.username}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 px-12 text-white placeholder:text-slate-700 focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all duration-300"
                                        placeholder="Admin Authority ID"
                                        required
                                    />
                                    <Lock className="absolute left-4 top-[17px] w-5 h-5 text-slate-600 transition-colors group-hover/field:text-red-500/50" />
                                </div>
                            </div>

                            <div className="group/field relative">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Key Phrase</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 px-12 text-white placeholder:text-slate-700 focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all duration-300"
                                        placeholder="Enter Security Hash"
                                        required
                                    />
                                    <Lock className="absolute left-4 top-[17px] w-5 h-5 text-slate-600 transition-colors group-hover/field:text-red-500/50" />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl shadow-[0_10px_30px_rgba(239,68,68,0.2)] transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative flex items-center gap-2">
                                {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
                                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> }
                            </span>
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-800/50 flex justify-between items-center opacity-60">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                             <span className="text-[10px] font-bold text-slate-500 tracking-tighter uppercase tracking-widest">Security Active</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 tracking-tighter uppercase tracking-widest">v3.0.4-LTS</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
