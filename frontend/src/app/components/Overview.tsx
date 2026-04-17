import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Overview() {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-full flex flex-col bg-white"
    >
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2 pointer-events-none bg-[#c5fff2]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-50 rounded-full blur-3xl opacity-60 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center mt-8">
          <h1 className="text-4xl sm:text-5xl md:text-[56px] font-bold text-sky-900 tracking-tight flex items-center justify-center gap-3 flex-wrap mb-4">
            <span className="font-[ADLaM_Display]">Scoliosis</span>
            <span className="text-teal-400 font-[ADLaM_Display]">AI</span>
            <span className="font-[ADLaM_Display]">Analyzer</span>
          </h1>
          
          <p className="text-xl sm:text-2xl font-medium text-sky-700/70 mb-16 font-[ADLaM_Display]">
            For Preliminary Screening
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mb-10 text-[#00afaf] font-[ADLaM_Display]">
            Scoliosis Severity Criteria (Cobb Angle)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mb-16">
            {/* Normal */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-teal-100 flex flex-col items-center text-center h-full"
            >
              <div className="bg-[#66C27A] text-white text-sm font-bold tracking-wider px-6 py-1.5 rounded-full uppercase mb-4">
                Normal
              </div>
              <div className="text-4xl font-extrabold text-sky-900 mb-3 tracking-tight font-[ADLaM_Display]">
                {'< 10°'}
              </div>
              <div className="text-sky-700 font-medium font-[ADLaM_Display]">
                No scoliosis / Physiological curve
              </div>
            </motion.div>

            {/* Mild */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-teal-100 flex flex-col items-center text-center h-full"
            >
              <div className="bg-[#FFCA43] text-white text-sm font-bold tracking-wider px-6 py-1.5 rounded-full uppercase mb-4">
                Mild
              </div>
              <div className="text-4xl font-extrabold text-sky-900 mb-3 tracking-tight font-[ADLaM_Display]">
                10° - 25°
              </div>
              <div className="text-sky-700 font-medium font-[ADLaM_Display]">
                Observation & Strengthening
              </div>
            </motion.div>

            {/* Moderate */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-teal-100 flex flex-col items-center text-center h-full"
            >
              <div className="bg-[#FFA24C] text-white text-sm font-bold tracking-wider px-6 py-1.5 rounded-full uppercase mb-4">
                Moderate
              </div>
              <div className="text-4xl font-extrabold text-sky-900 mb-3 tracking-tight font-[ADLaM_Display]">
                25° - 40°
              </div>
              <div className="text-sky-700 font-medium font-[ADLaM_Display]">
                Bracing / Specialist referral
              </div>
            </motion.div>

            {/* Severe */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-teal-100 flex flex-col items-center text-center h-full"
            >
              <div className="bg-[#FF6565] text-white text-sm font-bold tracking-wider px-6 py-1.5 rounded-full uppercase mb-4">
                Severe
              </div>
              <div className="text-4xl font-extrabold text-sky-900 mb-3 tracking-tight font-[ADLaM_Display]">
                {'> 40°'}
              </div>
              <div className="text-sky-700 font-medium font-[ADLaM_Display]">
                Surgical consultation likely
              </div>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/instructions')}
            className="bg-teal-500 text-white px-10 py-5 rounded-full text-lg font-semibold flex items-center gap-3 transition-colors shadow-lg hover:bg-teal-600 font-[ABeeZee]"
          >
            Continue to Instructions
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </main>
    </motion.div>
  );
}
