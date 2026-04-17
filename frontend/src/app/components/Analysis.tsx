import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppFlow } from './Layout';

export function Analysis() {
  const navigate = useNavigate();
  const {
    selectedImage,
    analysisResult,
    isAnalyzing,
    analysisError,
    setSelectedImage,
    setSelectedFile,
    setAnalysisResult,
    setAnalysisError,
  } = useAppFlow();

  const handleReset = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    navigate('/upload');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'normal':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'mild':
        return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'moderate':
        return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'severe':
        return 'text-red-700 bg-red-100 border-red-200';
      default:
        return 'text-sky-800 bg-sky-100 border-sky-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    if (severity === 'normal') {
      return <CheckCircle2 className="w-6 h-6 text-green-600" />;
    }
    return <AlertCircle className="w-6 h-6 text-amber-600" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-full flex flex-col"
    >
      <header className="bg-white border-b border-sky-100 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-sky-900 font-bold text-2xl font-[ADLaM_Display]">Analysis Results</h1>
          <p className="text-sky-700 mt-1 font-[ABeeZee]">AI-generated spinal alignment screening</p>
        </div>
      </header>

      <main className="flex-1 px-6 py-12 bg-sky-50">
        <div className="max-w-4xl mx-auto">
          {isAnalyzing ? (
            <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-16 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-sky-200 border-t-teal-500 rounded-full mx-auto mb-6"
              />
              <h2 className="text-sky-900 font-semibold mb-2 text-xl">Analyzing Image</h2>
              <p className="text-sky-700">Processing spinal alignment data...</p>
            </div>
          ) : analysisError ? (
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
              <h2 className="text-red-700 text-xl font-bold mb-3 font-[ADLaM_Display]">Analysis failed</h2>
              <p className="text-red-700 mb-6 font-[ABeeZee]">{analysisError}</p>
              <button onClick={handleReset} className="w-full bg-teal-500 text-white py-4 rounded-lg hover:bg-teal-600 transition-colors font-semibold shadow-md font-[ABeeZee]">
                Back to Upload
              </button>
            </div>
          ) : analysisResult ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {(analysisResult.analyzedImage || selectedImage) && (
                    <div>
                      <h3 className="text-sky-900 mb-3 font-semibold font-[ADLaM_Display]">Analyzed Image</h3>
                      <img
                        src={analysisResult.analyzedImage || selectedImage || ''}
                        alt="Analyzed back"
                        className="w-full h-auto rounded-lg border border-sky-100 shadow-sm"
                      />
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sky-900 mb-3 font-semibold font-[ADLaM_Display]">Predicted Severity</h3>
                      <div className={`p-4 rounded-lg border flex items-center gap-3 font-medium ${getSeverityColor(analysisResult.severity)}`}>
                        {getSeverityIcon(analysisResult.severity)}
                        <div>
                          <div className="capitalize font-[ABeeZee] text-lg">{analysisResult.rawLabel}</div>
                          <div className="text-sm opacity-80 font-[ABeeZee]">Range: {analysisResult.degreeRange}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sky-900 mb-3 font-semibold font-[ADLaM_Display]">Model Confidence</h3>
                      <div className="bg-sky-50 rounded-lg p-6 text-center border border-sky-100">
                        <div className="text-5xl font-bold text-sky-900 mb-2 font-[ADLaM_Display]">{(analysisResult.confidence * 100).toFixed(1)}%</div>
                        <p className="text-sky-700 font-[ABeeZee]">Confidence of the predicted class</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-sky-100 pt-6">
                  <h3 className="text-sky-900 mb-3 font-semibold font-[ADLaM_Display]">Recommendation</h3>
                  <p className="text-sky-800 leading-relaxed font-[ABeeZee]">{analysisResult.recommendation}</p>
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-900 text-sm font-[ABeeZee]">{analysisResult.note}</p>
                </div>

                <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                  <p className="text-teal-900 text-sm font-[ABeeZee]">
                    <strong>Medical disclaimer:</strong> This AI screening is for preliminary assessment only and is not a substitute for diagnosis by a licensed healthcare professional.
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleReset}
                className="w-full bg-teal-500 text-white py-4 rounded-lg hover:bg-teal-600 transition-colors font-semibold shadow-md font-[ABeeZee] text-[18px]"
              >
                Analyze Another Photo
              </motion.button>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sky-600 mb-4">No analysis data available.</p>
              <button onClick={handleReset} className="text-teal-600 hover:text-teal-700 font-medium hover:underline">
                Go back to upload
              </button>
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
}
