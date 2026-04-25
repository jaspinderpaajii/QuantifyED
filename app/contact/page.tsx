import { Clock3, FileText, LifeBuoy, MessagesSquare } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const supportCards = [
  {
    icon: FileText,
    title: "Ask for a resource",
    description:
      "Request notes, formula sheets, practice sets, or topic-wise material you want added next.",
  },
  {
    icon: MessagesSquare,
    title: "Get study guidance",
    description:
      "Share what you are preparing for and where you are stuck so the request has useful context.",
  },
  {
    icon: LifeBuoy,
    title: "Report an issue",
    description:
      "Let us know if a PDF is not opening, a video link is broken, or something on the site is not working properly.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Request a resource or report something that is not working."
              description="Use this page when you need study material, want a topic added, or notice a broken PDF or video link. Clear requests are easier to review from the dashboard."
            />

            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
              <Clock3 className="size-4 text-brand" />
              Messages are saved directly into the QuantifyED dashboard.
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {supportCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-sm"
                >
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Icon className="size-5" />
                  </span>
                  <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-slate-950">
                    {card.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {card.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
              Contact Form
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-950">
              Tell us what you are looking for
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Tell us the topic, exam, level, and the exact help you need. If a
              link is broken, include the resource name so it can be fixed faster.
            </p>

            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] bg-slate-950 p-8 !text-white shadow-xl shadow-slate-900/12">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                You can use this page when
              </p>
              <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-200">
                <li>You cannot find notes or videos for a topic you want to study.</li>
                <li>A PDF, download link, or video is not opening properly.</li>
                <li>You want more practice material for a specific exam or level.</li>
                <li>You want to suggest a new topic, category, or resource format.</li>
              </ul>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
                Before you send
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-950">
                A clear message helps a lot
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Mention the topic, exam, or exact issue. For example:{" "}
                <span className="font-medium text-slate-800">
                  Need a short percentages revision PDF for Bank PO
                </span>{" "}
                gives much better context than{" "}
                <span className="font-medium text-slate-800">
                  I need maths help
                </span>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
