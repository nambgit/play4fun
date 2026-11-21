import { ChevronDown } from "lucide-react";
import type { Faq } from "@/lib/seo";

/** Visible FAQ (search engines only use questions people can read on the page) */
export function FaqSection({ faq, id = "hoi-dap", title = "Câu hỏi thường gặp" }: { faq: Faq[]; id?: string; title?: string }) {
  if (!faq.length) return null;
  return (
    <section aria-labelledby={id} className="mt-14 sm:mt-20">
      <h2 id={id} className="mb-4 text-xl font-extrabold tracking-tight sm:mb-6 sm:text-2xl">
        {title}
      </h2>
      <div className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
        {faq.map(([q, a]) => (
          <details key={q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold sm:px-6 sm:text-base [&::-webkit-details-marker]:hidden">
              <h3>{q}</h3>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export const faqJsonLd = (faq: Faq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});
