export type SubjectId =
  | 'matematika'
  | 'ipas'
  | 'bahasa_indonesia'
  | 'pancasila'
  | 'seni_budaya';

export type Semester = 1 | 2;
export type SemesterFilter = 'ALL' | Semester;

export type GameMode = 'kuis' | 'duel' | 'sortir';

export type TimerOption = 0 | 20 | 30 | 45;

export type VisualDiagramType =
  | { kind: 'fraction_bar'; numerator: number; denominator: number; label?: string }
  | { kind: 'cube'; side: number; unit: string }
  | { kind: 'cuboid'; length: number; width: number; height: number; unit: string }
  | { kind: 'triangle'; base: number; height: number; unit: string }
  | { kind: 'food_chain'; steps: string[] }
  | { kind: 'prism_light' }
  | { kind: 'compass_rose' }
  | { kind: 'angle'; degrees: number; label: string };

export interface QuizQuestion {
  id: string;
  subjectId: SubjectId;
  semester: Semester;
  topic: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  visual?: VisualDiagramType;
  isCustom?: boolean;
}

export interface SortItem {
  id: string;
  label: string;
  detail?: string;
  category: 'left' | 'right';
  reason: string;
}

export interface SortChallenge {
  id: string;
  subjectId: SubjectId;
  semester: Semester;
  title: string;
  instruction: string;
  leftCategory: {
    title: string;
    subtitle: string;
  };
  rightCategory: {
    title: string;
    subtitle: string;
  };
  items: SortItem[];
}

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  shortName: string;
  description: string;
  topicsBySemester: {
    1: string[];
    2: string[];
  };
  accentColor: string;
  softBg: string;
  borderTint: string;
  illustration: string;
}

export interface SessionConfig {
  subjectId: SubjectId;
  semester: SemesterFilter;
  topic: string; // 'ALL' or specific topic name
  mode: GameMode;
  timerSeconds: TimerOption;
  teamRedName: string;
  teamBlueName: string;
  questionCount: number;
}
