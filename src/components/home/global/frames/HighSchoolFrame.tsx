// src/components/home/global/frames/HighSchoolFrame.tsx
import type { TemplateComp } from "../types";

const HighSchoolFrame: TemplateComp = ({ s, F }) => {
  return (
    <>
      {F.Hero?.()}
      <section className="mx-auto max-w-6xl px-4 md:px-6">{F.Major?.()}</section>

      {s.home_show_welcome && (
        <section className="mx-auto max-w-6xl px-4 md:px-6 py-6">{F.Welcome?.()}</section>
      )}

      <section className="mx-auto max-w-6xl px-4 md:px-6 py-8 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {s.home_show_news && F.News?.()}
          {s.home_show_events && F.Events?.()}
          {s.home_show_announcements && F.Announcements?.()}
        </div>
        <aside className="space-y-6">{F.Sidebar?.()}</aside>
      </section>

      {s.home_show_gallery && (
        <section className="mx-auto max-w-6xl px-4 md:px-6 py-10">{F.Gallery?.()}</section>
      )}

      {s.home_show_whyus && (
        <section className="mx-auto max-w-6xl px-4 md:px-6 py-12">{F.WhyUs?.()}</section>
      )}
    </>
  );
};

export default HighSchoolFrame;
