import React from "react";

type Props = {
  title?: React.ReactNode; // ← opsional sekarang
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function Section({
  title,
  subtitle,
  children,
  className = "",
}: Props) {
  return (
    <section className={"py-16 " + className}>
      <div className="mx-auto max-w-7xl px-4">
        {title && (
          <>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {title}
            </h2>
            {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
          </>
        )}
        <div className={title ? "mt-6" : ""}>{children}</div>
      </div>
    </section>
  );
}
