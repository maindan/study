export type SectionType = "doc" | "java" | "linux" | "quiz";

export interface SectionMeta {
  slug: string;
  title: string;
  type: SectionType;
  file: string;
  /** short description shown on the module overview */
  summary?: string;
}

export interface ModuleMeta {
  slug: string;
  title: string;
  icon: string;
  order: number;
  description: string;
  sections: SectionMeta[];
}

/** A single Java algorithm challenge. */
export interface JavaChallenge {
  id: string;
  title: string;
  /** facil | medio | avancado */
  difficulty?: string;
  /** problem statement in markdown */
  statement: string;
  /** code shown in the editor as a starting point */
  starter: string;
  /** full reference solution (revealed on demand) */
  reference: string;
  /** Java harness (Main.java) that calls Solution and prints results */
  harness: string;
  /** expected stdout — filled automatically by scripts/seed-java.mjs */
  expected?: string;
  /** hints */
  hints?: string[];
}

export interface JavaSectionData {
  intro?: string;
  challenges: JavaChallenge[];
}

export interface LinuxTask {
  id: string;
  prompt: string;
  /** accepted answers as regex source strings (case-insensitive, whole-line) */
  accept: string[];
  hint?: string;
  explain: string;
}

export interface LinuxSectionData {
  intro?: string;
  tasks: LinuxTask[];
}

export interface QuizQuestion {
  id: string;
  q: string;
  /** for multiple choice */
  options?: string[];
  /** index of the correct option */
  answer?: number;
  /** for short answer: accepted regex source strings */
  accept?: string[];
  explain: string;
}

export interface QuizSectionData {
  intro?: string;
  questions: QuizQuestion[];
}
