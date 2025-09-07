import { useState, KeyboardEvent } from "react";

type Props = {
  value?: string[];
  onChange?: (v: string[]) => void;
  placeholder?: string;
};

export default function TagsInput({
  value = [],
  onChange,
  placeholder,
}: Props) {
  const [draft, setDraft] = useState("");

  function add(tag: string) {
    const t = tag.trim();
    if (!t) return;
    if (value.includes(t)) {
      setDraft("");
      return;
    }
    onChange?.([...value, t]);
    setDraft("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange?.(value.slice(0, -1));
    }
  }

  return (
    <div className="rounded-xl border bg-white px-2 py-2 flex flex-wrap gap-2">
      {value.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border bg-slate-50"
        >
          {t}
          <button
            type="button"
            className="text-slate-500"
            onClick={() => onChange?.(value.filter((v) => v !== t))}
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="min-w-[140px] flex-1 outline-none text-sm px-2"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder || "Ketik tag lalu Enter/Comma"}
      />
    </div>
  );
}
