import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, UserCircle, Bell } from 'lucide-react';
import authService from '../services/authService';
import notificationService from '../services/notificationService';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar({ user: propUser }) {
  const location = useLocation();
  const user = propUser || authService.getCurrentUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
    
    // Set up polling for notifications
    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, 15000); // 15 seconds
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearInterval(intervalId);
    };
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationService.getUnreadCount();
      if (data && data.success) {
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error('Failed to fetch unread count', error);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Directory', path: '/alumni' },
    { name: 'Mentorship', path: '/mentorship' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Events', path: '/events' },
    { name: 'Messages', path: '/messages' },
    ...(user?.role?.toLowerCase() === 'recruiter' ? [{ name: 'Manage Postings', path: '/manage-jobs' }] : [])
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-amber-500/30 transition-shadow"
          >
            <BookOpen className="w-5 h-5 text-slate-50" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-100 leading-tight">AlumniConnect</span>
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">University Network</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path === '/dashboard' && location.pathname === '/');
            return (
              <Link 
                key={link.name} 
                to={link.path}
                className={`text-sm font-semibold transition-colors relative py-2 ${isActive ? 'text-amber-400' : 'text-slate-400 hover:text-slate-100'}`}
              >
                {link.name}
                {isActive && (
                  <motion.div 
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-slate-400 hover:text-amber-400 transition-transform hover:scale-110 relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-slate-950 flex items-center justify-center text-[8px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2"
                >
                  <NotificationDropdown 
                    onClose={() => setShowNotifications(false)} 
                    onRefreshCount={fetchUnreadCount} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="hidden sm:flex items-center gap-4 pl-6 border-l border-slate-800">
            <div className="text-right">
              <Link to="/profile" className="text-sm font-bold text-slate-200 hover:text-amber-400 transition-colors block">
                {user?.name || 'User Profile'}
              </Link>
              <button 
                type="button"
                onClick={async () => {
                  await authService.logout();
                  window.location.href = '/login';
                }} 
                className="text-xs text-slate-500 hover:text-amber-400 transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
            <Link to="/profile">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center shadow-lg cursor-pointer text-slate-300 hover:text-white transition-colors"
              >
                <UserCircle className="w-6 h-6" />
              </motion.div>
            </Link>
          </div>
        </div>
        
      </div>
    </nav>
  );
}
