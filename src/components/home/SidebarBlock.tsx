import TeacherLoginCard from "@/components/TeacherLoginCard";
import ArticleListWidget from "@/components/home/ArticleListWidget";

export default function SidebarBlock() {
  return (
    <aside className="md:col-span-4 space-y-6 md:sticky md:top-24">
      <TeacherLoginCard />
      <ArticleListWidget />
    </aside>
  );
}
