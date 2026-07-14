import React, { useState, useRef } from "react";
import { FileText, Upload, Sparkles, X, File, RefreshCw } from "lucide-react";
import Preloads from "./Preloads";
import { PreloadExample } from "../data";

interface InputSectionProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  jdText: string;
  setJdText: (text: string) => void;
  resumePdf: string;
  setResumePdf: (pdf: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  loadingStep: string;
  onSelectExample: (ex: PreloadExample) => void;
  selectedExampleId?: string;
}

export default function InputSection({
  resumeText,
  setResumeText,
  jdText,
  setJdText,
  resumePdf,
  setResumePdf,
  onAnalyze,
  loading,
  loadingStep,
  onSelectExample,
  selectedExampleId,
}: InputSectionProps) {
  const [resumeMode, setResumeMode] = useState<'paste' | 'upload'>('paste');
  const [pdfName, setPdfName] = useState<string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Only PDF files are supported for resume uploading.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert("File size exceeds 8MB. Please upload a smaller PDF resume.");
      return;
    }

    setPdfName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setResumePdf(reader.result as string);
        // Also wipe text so server knows to use the PDF
        setResumeText("");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clearPdf = () => {
    setResumePdf("");
    setPdfName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const wordCount = (text: string) => {
    if (!text || text.trim() === "") return 0;
    return text.trim().split(/\s+/).length;
  };

  return (
    <div className="w-full flex flex-col gap-6" id="input-section-container">
      {/* Side-by-side Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Resume Input */}
        <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                1. Your Resume / CV
              </h3>
              {(resumeText || resumePdf) && (
                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/30">PARSED OK</span>
              )}
            </div>

            {/* Paste vs Upload toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setResumeMode('paste');
                  clearPdf();
                }}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  resumeMode === 'paste'
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Paste Text
              </button>
              <button
                type="button"
                onClick={() => setResumeMode('upload')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  resumeMode === 'upload'
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Upload PDF
              </button>
            </div>
          </div>

          {resumeMode === 'paste' ? (
            <div className="flex flex-col flex-1 min-h-[320px]">
              <textarea
                id="resume-textarea"
                placeholder="Paste the raw text of your resume here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                disabled={loading}
                className="w-full flex-1 min-h-[300px] p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-slate-700 dark:text-slate-300 placeholder-slate-400 font-sans resize-y"
              />
              <div className="flex items-center justify-between mt-2 text-xs text-slate-400 dark:text-slate-500 px-1">
                <span>{wordCount(resumeText)} words</span>
                <span>Supports copy-paste from Word or PDF</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 min-h-[320px] justify-between">
              {resumePdf ? (
                /* PDF Selected Screen */
                <div className="flex flex-col items-center justify-center border border-dashed border-blue-200 dark:border-blue-900/50 rounded-xl bg-blue-50/5 dark:bg-blue-950/5 p-8 flex-1">
                  <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-500 mb-3">
                    <File className="w-10 h-10" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm max-w-xs text-center truncate">
                    {pdfName}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Ready for ATS comparison
                  </p>

                  <button
                    type="button"
                    onClick={clearPdf}
                    disabled={loading}
                    className="mt-6 flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 font-semibold border border-rose-100 dark:border-rose-900/20 px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/10 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    Remove and Upload Another
                  </button>
                </div>
              ) : (
                /* Drag & Drop Upload Zone */
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 flex-1 transition-all cursor-pointer ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/20'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 mb-4">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                    Drag and Drop your PDF Resume
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    or click to browse from your computer
                  </p>
                  <p className="text-[10px] text-slate-400 mt-4 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    PDF format, Max 8MB
                  </p>
                </div>
              )}
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-3 text-center">
                Gemini will parse your PDF layout & text directly for premium accuracy.
              </div>
            </div>
          )}
        </div>

        {/* Right Side: JD Input */}
        <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                2. Target Job Description (JD)
              </h3>
              {jdText && (
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/30">EXTRACTED</span>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 min-h-[320px]">
            <textarea
              id="jd-textarea"
              placeholder="Paste the target job description (responsibilities, skills, and requirements) here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              disabled={loading}
              className="w-full flex-1 min-h-[300px] p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-slate-700 dark:text-slate-300 placeholder-slate-400 font-sans resize-y"
            />
            <div className="flex items-center justify-between mt-2 text-xs text-slate-400 dark:text-slate-500 px-1">
              <span>{wordCount(jdText)} words</span>
              <span>Input the full job requirements for optimal mapping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Area: Compare button */}
      <div className="flex flex-col items-center justify-center gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={loading || (!jdText.trim()) || (!resumeText.trim() && !resumePdf)}
          className={`relative group w-full md:w-80 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-sm tracking-wide shadow-md transition-all cursor-pointer ${
            loading
              ? 'bg-blue-500 text-white cursor-wait'
              : !jdText.trim() || (!resumeText.trim() && !resumePdf)
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
              : 'bg-blue-600 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 text-white hover:shadow-blue-500/10 active:scale-98'
          }`}
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span className="animate-pulse">{loadingStep || "Comparing Details..."}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span>Compare & Share Score</span>
            </>
          )}
        </button>

        {!loading && (
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-md text-center leading-relaxed">
            Ready to match? Our AI ATS parses skills, identifies missing keywords, and generates direct, tailored additions for your resume.
          </p>
        )}
      </div>

      {/* Preloads section */}
      {!loading && (
        <div className="mt-2">
          <Preloads onSelect={onSelectExample} selectedId={selectedExampleId} />
        </div>
      )}
    </div>
  );
}
