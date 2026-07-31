import { ReactNode } from "react";

export default function SspField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="ssp-field">
      <label className="ssp-field-label">{label}</label>
      {hint && <span className="ssp-field-hint">{hint}</span>}
      {children}
    </div>
  );
}
