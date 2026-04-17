import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import img3 from "../../imports/image-3.png";

export function Cover() {
  const navigate = useNavigate();
  return (
    <div className="min-h-full flex flex-col relative overflow-hidden bg-sky-50">
      <img src="https://images.unsplash.com/photo-1763198302745-57cb94135f11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluZSUyMG1lZGljYWwlMjB4LXJheXxlbnwxfHx8fDE3NzYzNjUyMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Spine Medical X-Ray" className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/90 via-sky-100/80 to-teal-50/90" />
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_-10px_rgba(56,189,248,0.6)] overflow-hidden"
          >
            <img src={img3} alt="Scoliosis AI Analyzer" className="w-16 h-16 object-contain" />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold text-sky-900 mb-6 tracking-tight flex flex-wrap justify-center items-center gap-x-4"
          >
            <span className="font-[ADLaM_Display]">Scoliosis</span>
      
            <span className="text-teal-400 font-[ADLaM_Display]">AI Analyzer</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-xl md:text-2xl text-sky-700 mb-16 font-medium font-[ADLaM_Display]"
          >
            For Preliminary Screening
          </motion.p>
          
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/overview')}
            className="bg-teal-500 hover:bg-teal-600 text-white px-10 py-5 rounded-full text-xl font-semibold flex items-center gap-4 mx-auto transition-all shadow-xl text-[#ffffff] font-[ABeeZee]"
          >
            Start Screening Flow
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
