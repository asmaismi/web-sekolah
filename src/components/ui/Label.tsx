import type { LabelHTMLAttributes } from "react";
type Props = LabelHTMLAttributes<HTMLLabelElement>;
export default function Label(props: Props) {
  return (
    <label
      className="block text-sm font-medium text-slate-700 mb-1"
      {...props}
    />
  );
}
