import React from "react";

type Props = React.LabelHTMLAttributes<HTMLLabelElement> & {
  hint?: string;
};

export default function ALabel({
  hint,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <div className="mb-1">
      <label
        className={
          "block text-sm font-medium text-slate-700 " + (className || "")
        }
        {...rest}
      >
        {children}
      </label>
      {hint && <p className="text-xs text-slate-500 mt-0.5">{hint}</p>}
    </div>
  );
}
