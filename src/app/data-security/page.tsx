import { JsonLd } from "@/components/json-ld";
import { MailLink } from "@/components/legal-document";
import { PageHeader } from "@/components/page-header";
import { RelatedLinks } from "@/components/related-links";
import { CheckIcon, ClockIcon, LockIcon, ShieldIcon, XIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, graph, pageMetadata, webPageSchema } from "@/lib/seo";

const page = {
  path: "/data-security",
  title: "Data Security",
  description:
    "How ICAO Standard Photo protects your passport photos and payments: TLS encryption, PCI-DSS payments, signed expiring links and 24-hour auto-deletion.",
};

export const metadata = pageMetadata(page);

const { name, supportEmail, privacy } = siteConfig;

const stats = [
  { value: "256-bit", label: "TLS encryption" },
  { value: "PCI-DSS", label: "Level 1 payments" },
  { value: `${privacy.deleteAfterHours} hours`, label: "Auto image purge" },
  { value: "0%", label: "Data sold or shared" },
];

const guarantees = [
  {
    icon: LockIcon,
    title: "Bank-grade encryption",
    body: "Every transfer between your device and our servers uses TLS 1.3. During processing, files are encrypted at rest with AES-256 in isolated, firewalled environments.",
    points: [
      "TLS 1.3 for all uploads and downloads",
      "AES-256 encryption at rest during processing",
      "HTTPS-only with HSTS enforced",
      "Isolated processing with no public exposure",
    ],
  },
  {
    icon: ShieldIcon,
    title: "Payment security",
    body: `Payments are handled by PCI-DSS Level 1 certified gateways such as Stripe. ${name} never receives or stores card numbers, CVVs or bank credentials.`,
    points: [
      "No card data stored on our servers",
      "Tokenised checkout handled by the payment provider",
      "Encrypted card and digital wallet processing",
      "Instant digital receipt and fraud protection",
    ],
  },
  {
    icon: ClockIcon,
    title: "Temporary image retention",
    body: `Images are kept only as long as needed for checks, background removal and sizing. Download links are cryptographically signed and expire after ${privacy.linkExpiryMinutes} minutes.`,
    points: [
      "Stored only until processing and download finish",
      `Signed download links that expire after ${privacy.linkExpiryMinutes} minutes`,
      "No permanent cloud storage or archives",
      "Staff never view photos without your consent",
    ],
  },
  {
    icon: CheckIcon,
    title: "Automatic permanent deletion",
    body: `An automated process permanently deletes uploads, processed files and caches within ${privacy.deleteAfterHours} hours. Deleted files cannot be recovered by anyone, including our engineers.`,
    points: [
      "Automated deletion running around the clock",
      `Full cache purge within ${privacy.deleteAfterHours} hours`,
      "Instant delete option on your preview screen",
      "No backup snapshots of biometric photos",
    ],
  },
  {
    icon: XIcon,
    title: "No selling data, no AI training",
    body: "Your photos, facial data, email address and personal information are never sold, rented or shared with advertisers, data brokers or marketers, and never used to train AI models.",
    points: [
      "We sell photo processing, not your data",
      "No sharing with ad networks or data brokers",
      "No use of photos for AI or facial recognition training",
      "Compliant with GDPR (EU) and CCPA/CPRA (California)",
    ],
  },
];

const comparison = [
  { feature: "Encryption", ours: "TLS 1.3 + AES-256", theirs: "Basic SSL or none" },
  { feature: "Photo deletion", ours: `Within ${privacy.deleteAfterHours} hours, or instantly`, theirs: "Stored indefinitely" },
  { feature: "Card handling", ours: "Never stored (tokenised)", theirs: "Unclear" },
  { feature: "Selling user data", ours: "Never", theirs: "Often used for ads" },
  { feature: "AI training on photos", ours: "Never", theirs: "Unclear or permitted" },
];

const faqs = [
  {
    q: "Is it safe to upload my passport or ID photo?",
    a: `Yes. Photos are sent over encrypted connections, held only while they are checked and processed, and permanently deleted within ${privacy.deleteAfterHours} hours.`,
  },
  {
    q: "Do you store my card details?",
    a: "No. Payments are processed by a PCI-DSS Level 1 certified provider. Your card details are encrypted by the provider and never reach our servers.",
  },
  {
    q: "How quickly are my photos deleted?",
    a: `Uploads and processed photo sheets are deleted automatically within ${privacy.deleteAfterHours} hours. You can also delete them instantly from the preview screen after downloading.`,
  },
  {
    q: "Can your staff see my photo?",
    a: "No. Processing is fully automated. Our team only looks at a photo if you ask us to investigate a processing problem.",
  },
  {
    q: "Will my photo be used to train AI or facial recognition?",
    a: "Never. We do not use customer photos for AI training, datasets or facial recognition.",
  },
];

export default function DataSecurityPage() {
  return (
    <>
      <JsonLd data={graph(webPageSchema(page), breadcrumbSchema([{ name: page.title, path: page.path }]))} />
      <PageHeader
        eyebrow="Trust & safety"
        breadcrumb={page.title}
        title="Data security and privacy safeguards"
        description="Uploading an ID photo takes trust. We protect your photos and details with strong encryption, short-lived processing, automatic deletion and a strict no-data-selling policy."
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col rounded-lg border border-border bg-white p-5 text-center">
              <dt className="order-last mt-1 text-xs text-gray-500 sm:text-sm">{s.label}</dt>
              <dd className="font-mono text-xl font-semibold text-black sm:text-2xl">{s.value}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">Our 5 data security guarantees</h2>
          <p className="mt-2 text-gray-600">How your data, payment and photos are protected at every step.</p>
          <ol className="mt-8 space-y-4">
            {guarantees.map((g, i) => (
              <li key={g.title} className="rounded-lg border border-border bg-white p-5 sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-lime-600/10 text-lime-700">
                    <g.icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-lime-700">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="text-lg font-semibold text-black">{g.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">{g.body}</p>
                  </div>
                </div>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2 sm:pl-15">
                  {g.points.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-gray-700">
                      <CheckIcon className="mt-0.5 size-4 text-lime-600" />
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">How we compare</h2>
          <p className="mt-2 text-gray-600">{name} versus typical unverified online photo tools.</p>
          <div className="mt-6 overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Feature</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-lime-700">{name}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Typical alternatives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparison.map((row) => (
                  <tr key={row.feature}>
                    <th scope="row" className="px-4 py-3 font-medium text-black">{row.feature}</th>
                    <td className="px-4 py-3 text-gray-800">{row.ours}</td>
                    <td className="px-4 py-3 text-gray-500">{row.theirs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">Security questions</h2>
          <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-white">
            {faqs.map((f) => (
              <details key={f.q} className="group px-5 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium text-black [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-xl leading-none text-gray-400 transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="pb-5 text-sm leading-6 text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-lg border border-lime-600/30 bg-lime-600/5 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-black">Need help with your data?</h2>
          <p className="mt-2 text-gray-700">
            For security questions, urgent deletion or GDPR and CCPA requests, email <MailLink email={supportEmail} />.
          </p>
        </section>

        <RelatedLinks paths={["/privacy-policy", "/terms", "/refund-policy"]} title="Related legal and security documents" />
      </div>
    </>
  );
}
