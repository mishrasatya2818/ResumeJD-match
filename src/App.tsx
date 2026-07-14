import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, History, ArrowLeft, RefreshCw, FileText, Trash2, ShieldAlert, Check, HelpCircle, GraduationCap } from "lucide-react";
import InputSection from "./components/InputSection";
import ComparisonView from "./components/ComparisonView";
import { ComparisonHistoryItem, ComparisonResult } from "./types";
import { PreloadExample } from "./data";

export default function App() {
  const [resumeText, setResumeText] = useState<string>("");
  const [resumePdf, setResumePdf] = useState<string>(""); // base64 payload
  const [jdText, setJdText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [currentResult, setCurrentResult] = useState<ComparisonResult | null>(null);
  const [history, setHistory] = useState<ComparisonHistoryItem[]>([]);
  const [view, setView] = useState<'input' | 'result' | 'history'>('input');
  const [selectedExampleId, setSelectedExampleId] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("resume_vs_jd_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);

  // Save history helper
  const saveHistory = (newHistory: ComparisonHistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem("resume_vs_jd_history", JSON.stringify(newHistory));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  };

  const handleSelectExample = (ex: PreloadExample) => {
    setResumeText(ex.resumeText);
    setJdText(ex.jdText);
    setResumePdf(""); // Wipe PDF when loading plain text example
    setSelectedExampleId(ex.id);
    setErrorMessage(null);
  };

  // Simulated progressive loading step texts to create a delightful wait experience
  const startLoadingSteps = () => {
    const steps = [
      "Parsing resume formatting and content structure...",
      "Analyzing target job core requirements and duties...",
      "Matching key credentials and evaluating experience level...",
      "Compiling missing skill list and crafting tailored resume bullets...",
      "Finalizing ATS matching score and overall compatibility...",
    ];
    let i = 0;
    setLoadingStep(steps[0]);
    const interval = setInterval(() => {
      i++;
      if (i < steps.length) {
        setLoadingStep(steps[i]);
      } else {
        clearInterval(interval);
      }
    }, 2800);
    return interval;
  };

  const handleAnalyze = async () => {
    setErrorMessage(null);
    setLoading(true);
    const interval = startLoadingSteps();

    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resumePdf ? "" : resumeText,
          resumePdf: resumePdf || "",
          jdText,
        }),
      });

      clearInterval(interval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze resume. Please check your inputs and API configuration.");
      }

      const result: ComparisonResult = await response.json();
      setCurrentResult(result);

      // Save to history list
      const newItem: ComparisonHistoryItem = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        timestamp: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        jobTitle: result.jobTitle || "Job Analysis",
        score: result.score,
        resumeText: resumePdf ? "Uploaded PDF Document" : resumeText,
        jdText,
        result,
      };

      const updatedHistory = [newItem, ...history];
      saveHistory(updatedHistory);

      setView('result');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "A network error occurred. Please try again.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  const handleEditResume = () => {
    // Return to input view to allow the candidate to modify their resume
    setView('input');
  };

  const handleLoadHistory = (item: ComparisonHistoryItem) => {
    setCurrentResult(item.result);
    // Fill back inputs as well for easy editing later
    if (item.resumeText !== "Uploaded PDF Document") {
      setResumeText(item.resumeText);
      setResumePdf("");
    }
    setJdText(item.jdText);
    setView('result');
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = history.filter(item => item.id !== id);
    saveHistory(filtered);
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your entire analysis history?")) {
      saveHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300" id="main-app-container">
      {/* Top Professional Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40" id="header-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 dark:bg-blue-500 text-white p-2.5 rounded-xl shadow-md flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white underline decoration-blue-500">
                ResumeMatch AI <span className="text-slate-400 font-normal text-xs">v2.4</span>
              </h1>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                Professional ATS Optimization & Phrasing Tool
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('input')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                view === 'input'
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Analyze
            </button>
            <button
              onClick={() => setView('history')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                view === 'history'
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History ({history.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="content-container">
        {/* Error Alert Bar */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 dark:bg-rose-950/10 dark:border-rose-900/30 flex items-start gap-3 text-sm text-rose-700 dark:text-rose-400" id="error-alert">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold">Analysis Failed</h4>
              <p className="text-xs mt-0.5">{errorMessage}</p>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-xs font-bold underline cursor-pointer hover:no-underline">Dismiss</button>
          </div>
        )}

        {/* Dynamic Transition States */}
        <AnimatePresence mode="wait">
          {view === 'input' && (
            <motion.div
              key="input-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight sm:text-3xl">
                  Match Your Resume to Any Job
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Identify critical ATS keywords, detect missing skills, and instantly generate custom resume points to raise your hiring score.
                </p>
              </div>

              <InputSection
                resumeText={resumeText}
                setResumeText={setResumeText}
                jdText={jdText}
                setJdText={setJdText}
                resumePdf={resumePdf}
                setResumePdf={setResumePdf}
                onAnalyze={handleAnalyze}
                loading={loading}
                loadingStep={loadingStep}
                onSelectExample={handleSelectExample}
                selectedExampleId={selectedExampleId}
              />
            </motion.div>
          )}

          {view === 'result' && currentResult && (
            <motion.div
              key="result-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4"
            >
              {/* Back to inputs link */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setView('input')}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  Back to Compare Editor
                </button>
                <span className="text-xs text-slate-400 font-medium font-mono">
                  Report Generated Successfully
                </span>
              </div>

              <ComparisonView result={currentResult} onEditResume={handleEditResume} />
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div
              key="history-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Comparison History
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage and review your saved resume-to-JD comparisons
                  </p>
                </div>

                {history.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 font-semibold border border-rose-100 dark:border-rose-900/20 px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear All
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center">
                  <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 mb-3">
                    <History className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                    No comparisons saved yet
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                    Once you run a comparison, the score, missing skills, and coaching tips are saved here.
                  </p>
                  <button
                    onClick={() => setView('input')}
                    className="mt-6 bg-blue-600 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    Start Your First Comparison
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleLoadHistory(item)}
                      className="group flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`p-2.5 rounded-lg font-extrabold text-sm font-mono shrink-0 flex items-center justify-center ${
                          item.score >= 85
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                            : item.score >= 70
                            ? 'bg-teal-50 text-teal-600 dark:bg-teal-950/20'
                            : item.score >= 50
                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                            : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20'
                        }`}>
                          {item.score}%
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.jobTitle}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mt-1">
                            <span>{item.timestamp}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {item.result.missingSkills.length} missing skills
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400 group-hover:text-blue-500 transition-colors">
                          View Analysis
                        </span>
                        <button
                          onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                          className="p-1.5 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10 transition-all cursor-pointer"
                          title="Delete history item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Humble Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 py-6 mt-12" id="footer-section">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400 dark:text-slate-500">
          <p>© 2026 Resume vs JD Matcher. Optimized for Applicant Tracking Systems.</p>
        </div>
      </footer>
    </div>
  );
}
