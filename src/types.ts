export interface SkillMatch {
  name: string;
  importance: 'High' | 'Medium' | 'Low';
}

export interface MissingSkill {
  name: string;
  importance: 'High' | 'Medium' | 'Low';
  recommendation: string; // How to add it, e.g. "Include under Skills section or reference in your project description."
  suggestedBullet: string; // Tailored, ready-to-use resume bullet point
}

export interface PartialSkill {
  name: string;
  gap: string; // e.g., "Resume mentions basic Python but role requires advanced data science libraries"
  recommendation: string; // How to bridge the gap
}

export interface ImprovementTip {
  category: 'Formatting' | 'Experience' | 'Projects' | 'Keywords' | 'Education';
  tip: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface ComparisonResult {
  score: number;
  jobTitle: string;
  summary: string;
  matchingSkills: SkillMatch[];
  missingSkills: MissingSkill[];
  partialSkills: PartialSkill[];
  improvementTips: ImprovementTip[];
}

export interface ComparisonHistoryItem {
  id: string;
  timestamp: string;
  jobTitle: string;
  companyName?: string;
  score: number;
  resumeText: string;
  jdText: string;
  result: ComparisonResult;
}
