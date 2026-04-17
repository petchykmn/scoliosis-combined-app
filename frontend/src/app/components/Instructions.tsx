import { motion } from 'motion/react';
import { Camera, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import img1 from "../../imports/image-1.png";
import img5 from "../../imports/image-5.png";
import { ImageWithFallback } from "./figma/ImageWithFallback";

function InstructionItem({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
        <span className="text-teal-700">{number}</span>
      </div>
      <div>
        <h3 className="text-sky-900 mb-1 text-[16px] font-[ADLaM_Display]">{title}</h3>
        <p className="text-sky-700 font-[ABeeZee] text-[13px]">{description}</p>
      </div>
    </div>
  );
}

export function Instructions() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-full flex flex-col"
    >
      <header className="bg-white border-b border-sky-100 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate('/overview')} className="text-sky-600 hover:text-teal-600 mb-2 font-[ABeeZee]">
            ← Back to Overview
          </button>
          <h1 className="text-sky-900 font-bold text-2xl font-[ADLaM_Display]">Spinal Alignment Screening</h1>
          <p className="text-sky-700 mt-1 font-[ABeeZee]">AI-powered scoliosis assessment</p>
        </div>
      </header>

      <main className="flex-1 px-6 py-12 bg-sky-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-8">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                <Camera className="w-6 h-6 text-teal-500" />
              </div>
              <div>
                <h2 className="text-sky-900 font-semibold mb-2 text-[18px] font-bold font-[ADLaM_Display]">Photography Guidelines</h2>
                <p className="text-sky-700 font-[ABeeZee] text-[13px]">Follow these guidelines carefully to ensure accurate analysis</p>
              </div>
            </div>

            <div className="space-y-6">
              <InstructionItem
                number={1}
                title="Lighting 💡"
                description="Use bright, even lighting. Avoid strong shadows or backlighting that obscure the back."
              />
              <InstructionItem
                number={2}
                title="Background 🖼️"
                description="Choose a solid, light-colored background (white or light grey) with no patterns or objects behind."
              />
              <InstructionItem
                number={3}
                title="Distance 📏"
                description="Stand 1.5–2 meters away from the camera. Make sure the entire back is visible."
              />
              <InstructionItem
                number={4}
                title="Camera Angle 📱"
                description="Hold the camera vertically at mid-back height. Keep it parallel to the back, not angled up or down."
              />
              <InstructionItem
                number={5}
                title="Posture 🧘"
                description="Stand straight, arms relaxed by your sides. Tie long hair up if needed."
              />
            </div>

            <div className="mt-8 border-t border-sky-100 pt-8">
              <h3 className="text-sky-900 font-bold mb-4 text-[18px] font-[ADLaM_Display]">Optimal Posture Reference</h3>
              <div className="rounded-xl overflow-hidden border-2 border-teal-100 bg-white p-4 shadow-sm flex justify-center items-center">
                <ImageWithFallback 
                  src={img5} 
                  alt="Optimal Posture Reference" 
                  className="max-h-72 object-contain w-full"
                />
              </div>
            </div>

            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-900 font-[ADLaM_Display] text-[13px]">Medical Disclaimer: This tool is for preliminary screening only and does not replace professional medical diagnosis. Always consult a healthcare provider for proper evaluation <strong>Important:</strong></p>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate('/upload')}
              className="w-full mt-8 bg-teal-500 text-white py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors font-semibold font-[ABeeZee]"
            >
              Continue to Upload
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
