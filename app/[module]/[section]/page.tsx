import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getModules,
  getModule,
  getSectionMeta,
  loadDoc,
  loadJava,
  loadLinux,
  loadQuiz,
  sectionUnitCount,
} from "@/lib/content";
import MarkdownView from "@/components/MarkdownView";
import JavaChallenge from "@/components/JavaChallenge";
import LinuxTasks from "@/components/LinuxTask";
import Quiz from "@/components/Quiz";
import ProgressBar from "@/components/ProgressBar";

export function generateStaticParams() {
  const out: { module: string; section: string }[] = [];
  for (const m of getModules())
    for (const s of m.sections)
      out.push({ module: m.slug, section: s.slug });
  return out;
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ module: string; section: string }>;
}) {
  const { module, section } = await params;
  const mod = getModule(module);
  if (!mod) notFound();
  const meta = getSectionMeta(module, section);
  if (!meta) notFound();

  const idx = mod.sections.findIndex((s) => s.slug === section);
  const prev = idx > 0 ? mod.sections[idx - 1] : null;
  const next =
    idx < mod.sections.length - 1 ? mod.sections[idx + 1] : null;
  const pageKey = `${module}/${section}`;
  const units = sectionUnitCount(module, meta);

  let body: React.ReactNode = null;

  if (meta.type === "doc") {
    body = <MarkdownView source={loadDoc(module, meta.file)} pageKey={pageKey} />;
  } else if (meta.type === "java") {
    const data = loadJava(module, meta.file);
    const safe = data.challenges.map((c) => ({
      id: c.id,
      title: c.title,
      difficulty: c.difficulty,
      statement: c.statement,
      starter: c.starter,
      reference: c.reference,
      harness: "",
      hints: c.hints,
    }));
    body = (
      <>
        {data.intro && (
          <div className="intro-md">
            <MarkdownView source={data.intro} />
          </div>
        )}
        {safe.map((c, i) => (
          <JavaChallenge
            key={c.id}
            challenge={c}
            index={i}
            module={module}
            section={section}
          />
        ))}
      </>
    );
  } else if (meta.type === "linux") {
    const data = loadLinux(module, meta.file);
    body = (
      <>
        {data.intro && (
          <div className="intro-md">
            <MarkdownView source={data.intro} />
          </div>
        )}
        <LinuxTasks tasks={data.tasks} module={module} section={section} />
      </>
    );
  } else if (meta.type === "quiz") {
    const data = loadQuiz(module, meta.file);
    body = (
      <>
        {data.intro && (
          <div className="intro-md">
            <MarkdownView source={data.intro} />
          </div>
        )}
        <Quiz questions={data.questions} module={module} section={section} />
      </>
    );
  }

  return (
    <div>
      <div className="crumb">
        <Link href="/">Início</Link> /{" "}
        <Link href={`/${mod.slug}`}>{mod.title}</Link> / {meta.title}
      </div>

      {units > 0 && (
        <div style={{ maxWidth: 360, marginBottom: 22 }}>
          <ProgressBar
            prefix={`${pageKey}#`}
            total={units}
            label="Nesta seção"
          />
        </div>
      )}

      {body}

      <div className="pager">
        {prev ? (
          <Link href={`/${mod.slug}/${prev.slug}`}>
            <div className="dir">← Anterior</div>
            <div>{prev.title}</div>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/${mod.slug}/${next.slug}`} className="nx">
            <div className="dir">Próximo →</div>
            <div>{next.title}</div>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
