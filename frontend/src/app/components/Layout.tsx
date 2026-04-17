import { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router';

export interface AnalysisResult {
  severity: 'normal' | 'mild' | 'moderate' | 'severe' | string;
  rawLabel: string;
  confidence: number;
  degreeRange: string;
  recommendation: string;
  note: string;
  analyzedImage: string | null;
}

export interface AppContext {
  selectedImage: string | null;
  setSelectedImage: (img: string | null) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (res: AnalysisResult | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  analysisError: string | null;
  setAnalysisError: (error: string | null) => void;
}

export function Layout() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  return (
    <div className="w-full h-full bg-sky-50 overflow-auto">
      <Outlet
        context={{
          selectedImage,
          setSelectedImage,
          selectedFile,
          setSelectedFile,
          analysisResult,
          setAnalysisResult,
          isAnalyzing,
          setIsAnalyzing,
          analysisError,
          setAnalysisError,
        } satisfies AppContext}
      />
    </div>
  );
}

export function useAppFlow() {
  return useOutletContext<AppContext>();
}
