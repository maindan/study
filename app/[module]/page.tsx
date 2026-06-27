import Link from "next/link";
import { notFound } from "next/navigation";
import { getModules, getModule, moduleUnitCount } from "@/lib/content";
import ProgressBar from "@/components/ProgressBar";

export function generateStaticParams() {
  return getModules().map((m) => ({ module: m.slug }));
}

const KIND_LABEL: Record<string, string> = {
  doc: "Documentação",
  java: "Código",
  linux: "Comandos",
  quiz: "Quiz",
};

export default async function ModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  const mod = getModule(module);
  if (!mod) notFound();

  return (
    <div>
      <div className="crumb">
        <Link href="/">Início</Link> / {mod.title}
      </div>

      <div className="hero">
        <h1>
          {mod.icon} {mod.title}
        </h1>
        <p>{mod.description}</p>
      </div>

      <div style={{ maxWidth: 420, marginBottom: 8 }}>
        <ProgressBar
          prefix={`${mod.slug}/`}
          total={moduleUnitCount(mod)}
          label="Progresso do módulo"
        />
      </div>

      <div className="sec-list">
        {mod.sections.map((s, i) => (
          <Link
            key={s.slug}
            href={`/${mod.slug}/${s.slug}`}
            className="sec-item"
          >
            <span className="num">{i + 1}</span>
            <div className="meta">
              <h3>{s.title}</h3>
              {s.summary && <p>{s.summary}</p>}
            </div>
            <span className="kind">{KIND_LABEL[s.type] || s.type}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
