"use client";

import { ReactNode } from "react";

type DataField = {
  label: string;
  value: ReactNode;
};

type DataRowCardProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  icon?: ReactNode;
  fields?: DataField[];
  actions?: ReactNode;
  className?: string;
  fieldsColumns?: 1 | 2;
  fromResume?: boolean
};

export default function DataRowCard({
  title,
  subtitle,
  badge,
  icon,
  fields = [],
  actions,
  className = "",
  fieldsColumns = 2,
  fromResume = false
}: DataRowCardProps) {
  return (
    <div
      className={`flex h-full min-h-55 flex-col rounded-2xl border border-white/55 bg-white/75 p-4 shadow-[0_12px_34px_rgba(84,64,160,0.12)] backdrop-blur ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`min-w-0 flex-1 ${fromResume && 'flex justify-between items-center'}`}>
          <div className="flex items-center gap-2">
            {icon ? (
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                {icon}
              </span>
            ) : null}
            <h3 className="truncate text-base font-semibold text-slate-900">{title}</h3>
          </div>
          {subtitle ? <p className="mt-1 line-clamp-2 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {badge ? <div className="shrink-0">{badge}</div> : null}
      </div>

      {fields.length > 0 ? (
        <div
          className={`mt-4 grid gap-3 ${
            fieldsColumns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {fields.map((field) => (
            <div key={field.label} className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-slate-400">{field.label}</p>
              <div className="mt-1 text-sm text-slate-700">{field.value}</div>
            </div>
          ))}
        </div>
      ) : null}

      {actions ? <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">{actions}</div> : null}
    </div>
  );
}
