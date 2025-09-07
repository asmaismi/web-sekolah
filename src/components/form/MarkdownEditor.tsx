import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  value?: string;
  onChange?: (v: string) => void;
  rows?: number;
};

export default function MarkdownEditor({
  value = "",
  onChange,
  rows = 12,
}: Props) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  return (
    <div className="rounded-xl border bg-white">
      <div className="flex border-b">
        <button
          type="button"
          className={`px-4 py-2 text-sm ${tab === "edit" ? "border-b-2 border-primary-600 font-medium" : ""}`}
          onClick={() => setTab("edit")}
        >
          Edit
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm ${tab === "preview" ? "border-b-2 border-primary-600 font-medium" : ""}`}
          onClick={() => setTab("preview")}
        >
          Preview
        </button>
      </div>
      {tab === "edit" ? (
        <textarea
          className="w-full p-3 outline-none rounded-b-xl"
          rows={rows}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Tulis konten dalam Markdown (bold, list, link, table, dll.)"
        />
      ) : (
        <div className="prose max-w-none p-3">
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <div className="text-slate-500 text-sm">
              Belum ada konten untuk dipreview.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
