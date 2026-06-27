import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  ModuleMeta,
  SectionMeta,
  JavaSectionData,
  LinuxSectionData,
  QuizSectionData,
} from "./types";

// In dev/build, content lives at <cwd>/content. When packaged in Electron the
// working directory differs, so electron/main.js sets CONTENT_DIR explicitly.
const CONTENT_DIR =
  process.env.CONTENT_DIR || path.join(process.cwd(), "content");

/** Read and parse every module's _meta.json, sorted by `order`. */
export function getModules(): ModuleMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const dirs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  const modules: ModuleMeta[] = [];
  for (const dir of dirs) {
    const metaPath = path.join(CONTENT_DIR, dir.name, "_meta.json");
    if (!fs.existsSync(metaPath)) continue;
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf8")) as ModuleMeta;
      meta.slug = dir.name;
      // Only keep sections whose content file actually exists. This lets the
      // app build and run while content is still being authored.
      meta.sections = (meta.sections || []).filter((s) =>
        fs.existsSync(path.join(CONTENT_DIR, dir.name, s.file))
      );
      // Skip modules that have no content yet.
      if (meta.sections.length > 0) modules.push(meta);
    } catch (e) {
      console.error(`Erro lendo ${metaPath}:`, e);
    }
  }
  return modules.sort((a, b) => a.order - b.order);
}

export function getModule(slug: string): ModuleMeta | undefined {
  return getModules().find((m) => m.slug === slug);
}

export function getSectionMeta(
  moduleSlug: string,
  sectionSlug: string
): SectionMeta | undefined {
  return getModule(moduleSlug)?.sections.find((s) => s.slug === sectionSlug);
}

function readFile(moduleSlug: string, file: string): string {
  return fs.readFileSync(path.join(CONTENT_DIR, moduleSlug, file), "utf8");
}

/** Markdown doc: returns the body (frontmatter stripped). */
export function loadDoc(moduleSlug: string, file: string): string {
  const raw = readFile(moduleSlug, file);
  return matter(raw).content;
}

export function loadJava(moduleSlug: string, file: string): JavaSectionData {
  return JSON.parse(readFile(moduleSlug, file)) as JavaSectionData;
}

export function loadLinux(moduleSlug: string, file: string): LinuxSectionData {
  return JSON.parse(readFile(moduleSlug, file)) as LinuxSectionData;
}

export function loadQuiz(moduleSlug: string, file: string): QuizSectionData {
  return JSON.parse(readFile(moduleSlug, file)) as QuizSectionData;
}

/** How many trackable units a section contributes to progress. */
export function sectionUnitCount(moduleSlug: string, section: SectionMeta): number {
  try {
    switch (section.type) {
      case "doc": {
        const body = loadDoc(moduleSlug, section.file);
        const matches = body.match(/^\s*[-*]\s+\[[ xX]\]/gm);
        return matches ? matches.length : 0;
      }
      case "java":
        return loadJava(moduleSlug, section.file).challenges.length;
      case "linux":
        return loadLinux(moduleSlug, section.file).tasks.length;
      case "quiz":
        return loadQuiz(moduleSlug, section.file).questions.length;
    }
  } catch {
    return 0;
  }
}

export function moduleUnitCount(m: ModuleMeta): number {
  return m.sections.reduce((sum, s) => sum + sectionUnitCount(m.slug, s), 0);
}

/** Lightweight nav tree for the sidebar (no heavy content). */
export interface NavModule {
  slug: string;
  title: string;
  icon: string;
  units: number;
  sections: { slug: string; title: string; type: string }[];
}

export function getNav(): NavModule[] {
  return getModules().map((m) => ({
    slug: m.slug,
    title: m.title,
    icon: m.icon,
    units: moduleUnitCount(m),
    sections: m.sections.map((s) => ({
      slug: s.slug,
      title: s.title,
      type: s.type,
    })),
  }));
}
