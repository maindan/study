"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavModule } from "@/lib/content";
import { countDone, onProgressChange } from "@/lib/progress";

export default function Sidebar({ nav }: { nav: NavModule[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const activeModule = decodeURIComponent(pathname.split("/")[1] || "");
  const [done, setDone] = useState<Record<string, number>>({});

  useEffect(() => {
    const refresh = () => {
      const next: Record<string, number> = {};
      for (const m of nav) next[m.slug] = countDone(m.slug + "/");
      setDone(next);
    };
    refresh();
    return onProgressChange(refresh);
  }, [nav]);

  return (
    <aside className="sidebar">
      <Link href="/" className="brand" style={{ color: "var(--text)" }}>
        <span className="logo">S</span>
        <span>Study</span>
      </Link>

      <nav>
        {nav.map((m) => {
          const open = activeModule === m.slug;
          const pct = m.units ? Math.round(((done[m.slug] || 0) / m.units) * 100) : 0;
          return (
            <div className="nav-mod" key={m.slug}>
              <Link
                href={`/${m.slug}`}
                className={`nav-mod-head ${open ? "open active" : ""}`}
                onClick={(e) => {
                  // clicar no módulo já aberto fecha o accordion
                  if (open) {
                    e.preventDefault();
                    router.push("/");
                  }
                }}
              >
                <span className="icon">{m.icon}</span>
                <span>{m.title}</span>
                <span className="chev">▶</span>
              </Link>
              {m.units > 0 && (
                <div className="mini-bar" title={`${pct}% concluído`}>
                  <span style={{ width: `${pct}%` }} />
                </div>
              )}
              {open && (
                <div className="nav-sections">
                  {m.sections.map((s) => {
                    const href = `/${m.slug}/${s.slug}`;
                    const active = pathname === href;
                    return (
                      <Link
                        key={s.slug}
                        href={href}
                        className={`nav-link ${active ? "active" : ""}`}
                      >
                        <span>{s.title}</span>
                        {s.type !== "doc" && (
                          <span className="tag">
                            {s.type === "java"
                              ? "code"
                              : s.type === "linux"
                              ? "cmd"
                              : "quiz"}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
