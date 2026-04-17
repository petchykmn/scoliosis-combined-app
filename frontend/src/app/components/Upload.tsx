import { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Upload as UploadIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppFlow } from './Layout';

export function Upload() {
  const navigate = useNavigate();
  const {
    selectedImage,
    setSelectedImage,
    selectedFile,
    setSelectedFile,
    setAnalysisResult,
    setIsAnalyzing,
    setAnalysisError,
  } = useAppFlow();
  const [localError, setLocalError] = useState<string | null>(null);

  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
  const ANALYZE_URL = API_BASE_URL ? `${API_BASE_URL}/api/analyze` : '/api/analyze';

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setLocalError('กรุณาใช้ไฟล์ JPG, JPEG, PNG หรือ WEBP');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setLocalError('ไฟล์ต้องมีขนาดไม่เกิน 10 MB');
      return;
    }

    setLocalError(null);
    setSelectedFile(file);
    setAnalysisError(null);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setLocalError('กรุณาเลือกรูปก่อนวิเคราะห์');
      return;
    }

    setLocalError(null);
    setAnalysisError(null);
    setIsAnalyzing(true);
    navigate('/analysis');

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch(ANALYZE_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'การวิเคราะห์ล้มเหลว');
      }

      setAnalysisResult({
        severity: data.severity,
        rawLabel: data.raw_label,
        confidence: data.confidence,
        degreeRange: data.degree_range,
        recommendation: data.recommendation,
        note: data.note,
        analyzedImage: data.analyzed_image_base64 ?? null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
      setAnalysisError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-full flex flex-col"
    >
      <header className="bg-white border-b border-sky-100 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate('/instructions')} className="text-sky-600 hover:text-teal-600 mb-2 font-[ABeeZee]">
            ← Back to Instructions
          </button>
          <h1 className="text-sky-900 font-bold text-2xl font-[ADLaM_Display]">Upload Photo</h1>
          <p className="text-sky-700 mt-1 font-[ABeeZee]">Select an image of the patient's back</p>
        </div>
      </header>

      <main className="flex-1 px-6 py-12 bg-sky-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-8">
            {!selectedImage ? (
              <label className="block">
                <input type="file" accept="image/jpeg,image/png,image/jpg,image/webp" onChange={handleImageSelect} className="hidden" />
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="border-2 border-dashed border-sky-300 rounded-lg p-16 text-center cursor-pointer hover:border-teal-400 hover:bg-teal-50/50 transition-colors"
                >
                  <UploadIcon className="w-16 h-16 text-sky-400 mx-auto mb-4" />
                  <h3 className="text-sky-900 font-semibold mb-2">Select Photo</h3>
                  <p className="text-sky-700">Click to browse or drag and drop an image</p>
                  <p className="text-sky-500 mt-2 text-sm">JPG, PNG, or WEBP up to 10MB</p>
                </motion.div>
              </label>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <img src={selectedImage} alt="Selected back photo" className="w-full h-auto rounded-lg shadow-md" />
                  <label className="absolute top-4 right-4">
                    <input type="file" accept="image/jpeg,image/png,image/jpg,image/webp" onChange={handleImageSelect} className="hidden" />
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer bg-white px-4 py-2 rounded-lg shadow-lg border border-teal-100 text-sky-700 hover:bg-teal-50 inline-block font-medium font-[ABeeZee]"
                    >
                      Change Photo
                    </motion.div>
                  </label>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleAnalyze}
                  className="w-full bg-teal-500 text-white py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors font-semibold shadow-md font-[ABeeZee]"
                >
                  <Camera className="w-5 h-5" />
                  Analyze Spinal Alignment
                </motion.button>
              </div>
            )}

            {(localError || (!selectedFile && selectedImage)) && null}

            {localError && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-[ABeeZee]">
                {localError}
              </div>
            )}

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-sm font-[ABeeZee]">
              ผลลัพธ์จากโมเดลนี้เป็นการคัดกรองเบื้องต้นจากภาพถ่ายด้านหลัง และแสดงระดับความรุนแรงตามคลาสของโมเดล ไม่ใช่ค่า Cobb angle ทางการแพทย์ที่ยืนยันแล้ว
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
