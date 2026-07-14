import { motion } from "motion/react";

interface MetricRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  onDarkBg?: boolean;
}

export default function MetricRing({ score, size = 160, strokeWidth = 14, onDarkBg = false }: MetricRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  // Define colors based on score
  const getColorScheme = (val: number) => {
    if (val >= 85) {
      return {
        text: onDarkBg ? "text-emerald-400" : "text-emerald-500 dark:text-emerald-400",
        stroke: "stroke-emerald-500",
        bg: onDarkBg ? "bg-slate-800/40" : "bg-emerald-50/50 dark:bg-emerald-950/10",
        glow: "shadow-emerald-500/20",
        label: "Excellent Fit"
      };
    } else if (val >= 70) {
      return {
        text: onDarkBg ? "text-teal-400" : "text-teal-500 dark:text-teal-400",
        stroke: "stroke-teal-500",
        bg: onDarkBg ? "bg-slate-800/40" : "bg-teal-50/50 dark:bg-teal-950/10",
        glow: "shadow-teal-500/20",
        label: "Strong Alignment"
      };
    } else if (val >= 50) {
      return {
        text: onDarkBg ? "text-amber-400" : "text-amber-500 dark:text-amber-400",
        stroke: "stroke-amber-500",
        bg: onDarkBg ? "bg-slate-800/40" : "bg-amber-50/50 dark:bg-amber-950/10",
        glow: "shadow-amber-500/20",
        label: "Moderate Gaps"
      };
    } else {
      return {
        text: onDarkBg ? "text-rose-400" : "text-rose-500 dark:text-rose-400",
        stroke: "stroke-rose-500",
        bg: onDarkBg ? "bg-slate-800/40" : "bg-rose-50/50 dark:bg-rose-950/10",
        glow: "shadow-rose-500/20",
        label: "Significant Gaps"
      };
    }
  };

  const scheme = getColorScheme(score);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`relative flex items-center justify-center rounded-full p-2 transition-all ${scheme.bg}`}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={onDarkBg ? "stroke-slate-800" : "stroke-slate-200 dark:stroke-slate-800"}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`${scheme.stroke} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Inner Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-4xl font-extrabold font-mono tracking-tight ${onDarkBg ? "text-white" : "text-slate-800 dark:text-slate-100"}`}
          >
            {score}
            <span className={`text-lg font-normal ${onDarkBg ? "text-slate-400" : "text-slate-400"}`}>%</span>
          </motion.span>
          <span className={`text-[11px] font-semibold mt-1 uppercase tracking-wider ${scheme.text}`}>
            {scheme.label}
          </span>
        </div>
      </div>
    </div>
  );
}
