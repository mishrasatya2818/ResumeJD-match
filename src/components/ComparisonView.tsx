import { useState } from "react";
import { ComparisonResult, MissingSkill, PartialSkill } from "../types";
import MetricRing from "./MetricRing";
import { Check, Copy, AlertCircle, CheckCircle2, ChevronRight, HelpCircle, FileText, Settings, Award } from "lucide-react";

interface ComparisonViewProps {
  result: ComparisonResult;
  onEditResume: () => void;
}

export default function ComparisonView({ result, onEditResume }: ComparisonViewProps) {
  const [activeTab, setActiveTab] = useState<'missing' | 'partial' | 'matched' | 'tips'>('missing');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {
      // Fallback copy method
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const getImportanceColor = (imp: 'High' | 'Medium' | 'Low') => {
    switch (imp) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-800';
    }
  };

  return (
    <div className="w-full flex flex-col gap-6" id="comparison-view-container">
      {/* Top Banner: Score + Title + Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900 text-white rounded-2xl p-6 shadow-md shadow-blue-900/5">
        <div className="lg:col-span-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 pb-6 lg:pb-0 lg:pr-6">
          <MetricRing score={result.score} size={150} strokeWidth={12} onDarkBg={true} />
          <div className="text-center mt-3">
            <h3 className="text-lg font-bold text-white leading-tight italic">
              {result.jobTitle || "Target Role"}
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-wider">
              ATS SCORE & MATCH STRENGTH
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col justify-center pt-2 lg:pt-0 lg:pl-6">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-blue-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              AI Career Coach Executive Summary
            </h4>
          </div>
          <p className="text-slate-300 leading-relaxed text-sm">
            {result.summary}
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <strong>{result.missingSkills.length}</strong> Missing Skills
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <strong>{result.partialSkills.length}</strong> Partial Gaps
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <strong>{result.matchingSkills.length}</strong> Matching Skills
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Tabs and Detailed Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Quick Action Bar & Navigation */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <button
            onClick={() => setActiveTab('missing')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left border transition-all text-sm font-medium cursor-pointer ${
              activeTab === 'missing'
                ? 'bg-rose-50/50 dark:bg-rose-950/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/30'
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full ${activeTab === 'missing' ? 'bg-rose-500 animate-pulse' : 'bg-rose-400'}`}></span>
              <span>1. Missing Skills</span>
            </div>
            <span className="bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs px-2 py-0.5 rounded-full font-bold">
              {result.missingSkills.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('partial')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left border transition-all text-sm font-medium cursor-pointer ${
              activeTab === 'partial'
                ? 'bg-amber-50/50 dark:bg-amber-950/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30'
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>2. Experience Gaps</span>
            </div>
            <span className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs px-2 py-0.5 rounded-full font-bold">
              {result.partialSkills.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('matched')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left border transition-all text-sm font-medium cursor-pointer ${
              activeTab === 'matched'
                ? 'bg-emerald-50/50 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30'
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>3. Matched Keywords</span>
            </div>
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-0.5 rounded-full font-bold">
              {result.matchingSkills.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left border transition-all text-sm font-medium cursor-pointer ${
              activeTab === 'tips'
                ? 'bg-blue-50/50 dark:bg-blue-950/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/30'
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>4. Formatting & Tips</span>
            </div>
            <span className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full font-bold">
              {result.improvementTips.length}
            </span>
          </button>

          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 mt-2">
            <h5 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Next Action Step
            </h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Apply the suggested modifications and re-paste your resume to watch your score improve in real-time!
            </p>
            <button
              onClick={onEditResume}
              className="w-full flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold py-2 px-3 rounded-lg transition-colors cursor-pointer"
            >
              Modify Resume Now
            </button>
          </div>
        </div>

        {/* Right Column: Tab Contents */}
        <div className="lg:col-span-9 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm min-h-[400px]">
          {/* Missing Skills Tab */}
          {activeTab === 'missing' && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                  Missing Skills to Add to Resume
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  These keywords or hard requirements from the Job Description were not detected in your resume. Insert them using our tailored phrasing below:
                </p>
              </div>

              {result.missingSkills.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-2" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Outstanding!</p>
                  <p className="text-xs text-slate-400 mt-1">Your resume includes all major skills listed in the Job Description.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-5 mt-2">
                  {result.missingSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 hover:shadow-sm transition-all"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded text-sm">
                            {skill.name}
                          </span>
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${getImportanceColor(skill.importance)}`}>
                            {skill.importance} Priority
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                        <strong className="text-slate-600 dark:text-slate-300 block mb-0.5">Where/How to add it:</strong>
                        {skill.recommendation}
                      </div>

                      {skill.suggestedBullet && (
                        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-lg p-3 relative group">
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                              Tailored Resume Bullet Point
                            </span>
                            <button
                              onClick={() => handleCopy(skill.suggestedBullet, `missing-bullet-${index}`)}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
                              title="Copy to clipboard"
                            >
                              {copiedId === `missing-bullet-${index}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span className="text-emerald-500 text-[10px]">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span className="text-[10px]">Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                            "{skill.suggestedBullet}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Partial Match Tab */}
          {activeTab === 'partial' && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  Address Experience & Depth Gaps
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  You mention these skills, but they do not match the level of seniority, scale, or experience outlined in the job description:
                </p>
              </div>

              {result.partialSkills.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-2" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Major Experience Gaps!</p>
                  <p className="text-xs text-slate-400 mt-1">Whenever you mention required skills, they seem to align perfectly with the seniority levels expected.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 mt-2">
                  {result.partialSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50/30 dark:bg-slate-900/10"
                    >
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">
                        {skill.name}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="bg-rose-50/30 dark:bg-rose-950/5 border border-rose-100/50 dark:border-rose-950/20 rounded-lg p-3 text-xs">
                          <span className="font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider text-[10px] block mb-1">
                            Identified Gap
                          </span>
                          <p className="text-slate-600 dark:text-slate-400">
                            {skill.gap}
                          </p>
                        </div>
                        <div className="bg-emerald-50/30 dark:bg-emerald-950/5 border border-emerald-100/50 dark:border-emerald-950/20 rounded-lg p-3 text-xs">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[10px] block mb-1">
                            How to close it
                          </span>
                          <p className="text-slate-600 dark:text-slate-400">
                            {skill.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Matched Skills Tab */}
          {activeTab === 'matched' && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Successfully Matched Keywords
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Awesome job! Your resume successfully incorporates these requirements and key terms. Recruiters and ATS scanners will index these easily:
                </p>
              </div>

              {result.matchingSkills.length === 0 ? (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs">
                  No matching skills detected. Review your resume contents or paste a different job description.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {result.matchingSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 border border-slate-100 dark:border-slate-800 rounded-lg p-3 bg-emerald-50/10 dark:bg-emerald-950/5"
                    >
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-150 truncate">
                          {skill.name}
                        </p>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">
                          {skill.importance} Priority Match
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Improve Tips Tab */}
          {activeTab === 'tips' && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" />
                  Structural & Style Improvement Tips
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  General recommendations regarding your resume format, metrics usage, action verbs, and overall visual clarity:
                </p>
              </div>

              {result.improvementTips.length === 0 ? (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs">
                  No additional layout tips identified. Your current resume structure seems solid.
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-2">
                  {result.improvementTips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50/20 dark:bg-slate-900/10"
                    >
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border shrink-0 mt-0.5 ${
                        tip.impact === 'High'
                          ? 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400'
                          : tip.impact === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400'
                          : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {tip.impact} Impact
                      </span>

                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-0.5">
                          {tip.category}
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {tip.tip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
