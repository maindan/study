import Link from "next/link";
import { getModules, moduleUnitCount } from "@/lib/content";
import ProgressBar from "@/components/ProgressBar";

export default function Home() {
  const modules = getModules();
  const total = modules.reduce((s, m) => s + moduleUnitCount(m), 0);

  return (
    <div>
      <div className="hero">
        <h1>Study</h1>
        <p>
          Trilha guiada de Linux, Java, Kotlin, Orientação a Objetos,
          Algoritmos, SQL e desenvolvimento Android nativo. Cada módulo tem
          documentação, atividades e exercícios corrigidos automaticamente.
        </p>
      </div>

      {total > 0 && (
        <div style={{ maxWidth: 420, marginBottom: 34 }}>
          <ProgressBar prefix="" total={total} label="Progresso geral" />
        </div>
      )}

      <div className="card-grid">
        {modules.map((m) => {
          const units = moduleUnitCount(m);
          return (
            <Link key={m.slug} href={`/${m.slug}`} className="mod-card">
              <div className="ic">{m.icon}</div>
              <h3>{m.title}</h3>
              <p>{m.description}</p>
              <div className="count">
                {m.sections.length} seções · {units} exercícios
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
