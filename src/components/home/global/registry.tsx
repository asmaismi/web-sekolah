import type { TemplateComp, TemplateProps } from "./types";

import HighSchool from "./HighSchool"; // idem
import Universitas from "./Universitas"; // pastikan default export ada

import HighSchoolFrame from "./frames/HighSchoolFrame";
import UniversityFrame from "./frames/UniversityFrame";

// Placeholder rapi kalau template masih WIP
const ComingSoon: TemplateComp = (_: TemplateProps) => (
  <main className="mx-auto max-w-6xl px-4 md:px-6 py-10">
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Template dalam pengembangan</h2>
      <p className="text-sm text-slate-600">Sementara tampilkan placeholder.</p>
    </div>
  </main>
);

export const HOME_TEMPLATES = {
  universitas: (Universitas ?? UniversityFrame) as TemplateComp,
  highschool: (HighSchool ?? HighSchoolFrame) as TemplateComp,
  smp: ComingSoon,
  sd: ComingSoon,
} as const;

export type HomeTemplateKey = keyof typeof HOME_TEMPLATES;
export const DEFAULT_HOME_TEMPLATE: HomeTemplateKey = "universitas";
