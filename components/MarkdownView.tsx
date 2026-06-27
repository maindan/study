"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import PersistentCheckbox from "./PersistentCheckbox";

/**
 * Renders markdown. GitHub task-list items (`- [ ] ...`) become persistent
 * checkboxes namespaced under `pageKey`, so reading progress is tracked.
 */
export default function MarkdownView({
  source,
  pageKey,
}: {
  source: string;
  pageKey?: string;
}) {
  // Counter is reset on every render; react-markdown renders synchronously
  // top-to-bottom, so checkbox indices stay stable across renders.
  let cbIndex = 0;

  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          input(props) {
            if (props.type === "checkbox" && pageKey) {
              const key = `${pageKey}#${cbIndex++}`;
              return <PersistentCheckbox storageKey={key} />;
            }
            return <input {...props} />;
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
