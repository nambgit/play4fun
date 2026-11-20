/**
 * Minimal, dependency-free charts for /admin. One brand hue (single series / magnitude),
 * thin bars with rounded data ends, recessive axes, hover/focus tooltip on every column,
 * and a table view so nothing depends on reading the chart.
 */

export function fmtNumber(n: number) {
  return n.toLocaleString("vi-VN");
}

export function fmtDuration(seconds: number) {
  if (seconds < 60) return `${Math.round(seconds)} giây`;
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} phút`;
  const h = Math.floor(m / 60);
  return `${fmtNumber(h)} giờ${m % 60 ? ` ${m % 60} phút` : ""}`;
}

/** Big number tile */
export function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-card">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 font-mono text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
    </div>
  );
}

/** Vertical columns over time (single series) */
export function Columns({ data, caption }: { data: { label: string; value: number; detail: string }[]; caption: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const every = data.length > 20 ? 5 : data.length > 10 ? 3 : 1;
  return (
    <figure>
      <div className="relative">
        {/* recessive max gridline */}
        <div className="pointer-events-none absolute inset-x-0 top-0 border-t border-dashed border-line" aria-hidden="true" />
        <span className="pointer-events-none absolute -top-2 right-0 bg-surface pl-1 font-mono text-[10px] text-muted" aria-hidden="true">
          {fmtNumber(max)}
        </span>
        <div className="flex h-40 items-end gap-[2px] border-b border-line pt-2 sm:h-48" role="img" aria-label={caption}>
          {data.map((d) => (
            <div key={d.label} tabIndex={0} className="group relative flex h-full min-w-0 flex-1 items-end outline-none" aria-label={`${d.label}: ${d.detail}`}>
              <div
                className="w-full rounded-t-[4px] bg-brand transition-opacity group-hover:opacity-80 group-focus-visible:opacity-80"
                style={{ height: d.value ? `${Math.max(2, (d.value / max) * 100)}%` : 0 }}
              />
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded-lg border border-line bg-surface px-2 py-1 text-xs whitespace-nowrap shadow-lift group-hover:block group-focus-visible:block">
                <b>{d.label}</b> · {d.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-1 flex gap-[2px]" aria-hidden="true">
        {data.map((d, i) => (
          <span key={d.label} className="min-w-0 flex-1 text-center font-mono text-[10px] text-muted">
            {i % every === 0 ? d.label : ""}
          </span>
        ))}
      </div>
      <details className="mt-3 text-xs">
        <summary className="cursor-pointer text-muted hover:text-fg">Xem bảng số liệu</summary>
        <table className="mt-2 w-full max-w-sm text-left">
          <tbody>
            {data.map((d) => (
              <tr key={d.label} className="border-t border-line">
                <td className="py-1 font-mono">{d.label}</td>
                <td className="py-1 text-right">{d.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

/** Horizontal magnitude bars with the value printed beside each */
export function BarList({ rows, empty = "Chưa có dữ liệu" }: { rows: { label: string; value: number; display?: string }[]; empty?: string }) {
  if (rows.length === 0) return <p className="text-sm text-muted">{empty}</p>;
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label} title={`${r.label}: ${r.display ?? fmtNumber(r.value)}`}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate">{r.label}</span>
            <span className="shrink-0 font-mono font-semibold tabular-nums">{r.display ?? fmtNumber(r.value)}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-brand" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
