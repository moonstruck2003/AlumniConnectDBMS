import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle } from 'lucide-react';

const FormInput = ({ 
  label, 
  type = 'text', 
  icon: Icon, 
  error, 
  required = false, 
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col w-full gap-3 group/input">
      {label && (
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest leading-none ml-1">
          {label} {required && <span className="text-amber-500">*</span>}
        </label>
      )}
      
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-5 text-slate-500 transition-colors duration-300 group-focus-within/input:text-amber-500">
            <Icon size={20} />
          </div>
        )}
        
        <input
          type={inputType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full bg-slate-950/60 border-2 rounded-[1.5rem] py-4 pr-6 transition-all duration-500
            ${Icon ? 'pl-14' : 'pl-6'}
            ${error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-amber-500/50'}
            text-slate-100 font-bold placeholder:text-slate-700 focus:outline-none focus:ring-8 focus:ring-amber-500/5
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 p-2 rounded-xl text-slate-500 hover:text-amber-500 hover:bg-amber-500/10 transition-all duration-300"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest ml-1"
          >
            <AlertCircle size={12} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormInput;
