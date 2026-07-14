import { EXAMPLES, PreloadExample } from "../data";
import { Briefcase, Database, Layout } from "lucide-react";

interface PreloadsProps {
  onSelect: (example: PreloadExample) => void;
  selectedId?: string;
}

export default function Preloads({ onSelect, selectedId }: PreloadsProps) {
  const getIcon = (id: string) => {
    switch (id) {
      case "frontend-engineer":
        return <Layout className="w-5 h-5 text-indigo-500" id="icon-fe" />;
      case "data-scientist":
        return <Database className="w-5 h-5 text-teal-500" id="icon-ds" />;
      default:
        return <Briefcase className="w-5 h-5 text-amber-500" id="icon-pm" />;
    }
  };

  const getColor = (id: string) => {
    switch (id) {
      case "frontend-engineer":
        return "hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10";
      case "data-scientist":
        return "hover:border-teal-500 hover:bg-teal-50/20 dark:hover:bg-teal-950/10";
      default:
        return "hover:border-amber-500 hover:bg-amber-50/20 dark:hover:bg-amber-950/10";
    }
  };

  const getActiveStyles = (id: string) => {
    if (selectedId !== id) return "border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40";
    switch (id) {
      case "frontend-engineer":
        return "border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 ring-1 ring-indigo-500";
      case "data-scientist":
        return "border-teal-500 bg-teal-50/30 dark:bg-teal-950/20 ring-1 ring-teal-500";
      default:
        return "border-amber-500 bg-amber-50/30 dark:bg-amber-950/20 ring-1 ring-amber-500";
    }
  };

  return (
    <div className="w-full flex flex-col gap-2" id="preloads-container">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Or, load an instant sample case:
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.id}
            id={`preload-btn-${ex.id}`}
            onClick={() => onSelect(ex)}
            className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${getActiveStyles(
              ex.id
            )} ${getColor(ex.id)}`}
          >
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
              {getIcon(ex.id)}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {ex.roleName}
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                Target: {ex.companyName}
              </p>
              <span className="inline-block text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded mt-1.5 font-medium">
                Click to Auto-fill
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
