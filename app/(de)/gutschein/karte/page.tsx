import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { verifyVoucherCard, type VoucherCardParams } from "@/lib/voucher";

export const metadata: Metadata = {
  title: "Geschenkgutschein",
  robots: { index: false, follow: false },
};

/**
 * Druckansicht eines gekauften Gutscheins. Erreichbar nur über den signierten
 * Link aus der Gutschein-Mail (HMAC über alle Karten-Parameter) – manipulierte
 * oder frei erfundene URLs laufen in ein 404. "PDF" = Browser-Druckdialog.
 */
export default async function GutscheinKartePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

  const params: VoucherCardParams = {
    code: one(sp.code),
    value: parseInt(one(sp.value), 10),
    recipient: one(sp.recipient) || undefined,
    message: one(sp.message) || undefined,
    issued: one(sp.issued),
  };
  const sig = one(sp.sig);

  if (!params.code || !Number.isFinite(params.value) || !params.issued || !sig) notFound();
  if (!verifyVoucherCard(params, sig)) notFound();

  const issuedDe = params.issued.split("-").reverse().join(".");
  const validUntil = `31.12.${Number(params.issued.slice(0, 4)) + 3}`;

  return (
    <div className="min-h-screen bg-cream-100 py-10 px-4 print:bg-white print:py-0">
      {/* Druck-Hinweis (nicht im Ausdruck) */}
      <div className="max-w-xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <p className="font-body text-sm text-forest-600">
          Tipp: Über <strong>Drucken → als PDF sichern</strong> speicherst du den Gutschein als Datei.
        </p>
        <button
          type="button"
          className="px-5 py-2.5 rounded-full bg-forest-900 text-cream-50 font-body text-sm font-semibold hover:bg-forest-800 transition-colors"
          // Server Component: kein onClick – window.print über inline handler im <a> geht nicht,
          // deshalb Mini-Script unten; Button triggert es via id.
          id="print-btn"
        >
          Drucken
        </button>
      </div>

      {/* Gutschein-Karte */}
      <div className="max-w-xl mx-auto bg-white rounded-3xl overflow-hidden border border-cream-200 shadow-card print:shadow-none print:border-forest-200">
        <div className="bg-forest-900 px-10 py-9 text-center">
          <p className="font-body text-[11px] tracking-[0.2em] uppercase text-gold-300">
            SARFI Collection
          </p>
          <h1 className="font-display text-3xl text-cream-50 mt-2">Geschenkgutschein</h1>
          <p className="font-display text-6xl text-cream-50 mt-5">{params.value} €</p>
        </div>
        <div className="px-10 py-8">
          {params.recipient && (
            <p className="font-body text-base text-forest-800 text-center mb-1">
              Für <strong>{params.recipient}</strong>
            </p>
          )}
          {params.message && (
            <p className="font-body text-sm text-forest-600 italic text-center mb-5 whitespace-pre-line">
              „{params.message}"
            </p>
          )}
          <div className="rounded-2xl bg-cream-50 border border-cream-200 divide-y divide-cream-200">
            {[
              ["Gutscheincode", params.code],
              ["Ausgestellt am", issuedDe],
              ["Gültig bis", validUntil],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-5 py-3">
                <span className="font-body text-xs uppercase tracking-[0.08em] text-forest-400">{label}</span>
                <span className={`font-body text-sm font-semibold text-forest-900 ${label === "Gutscheincode" ? "font-mono tracking-wider" : ""}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          <p className="font-body text-xs text-forest-500 leading-relaxed mt-6">
            Einlösbar für alle Unterkünfte der SARFI Collection (HAUS28, Grattersdorf ·
            Haus Schönblick, Schöfweg): bei der Buchung auf www.sarfi-collection.de oder
            per E-Mail an hallo@sarfi-collection.de einfach den Gutscheincode angeben –
            der Wert wird mit dem Buchungspreis verrechnet. Teileinlösung möglich,
            Restguthaben bleibt bestehen. Keine Barauszahlung.
          </p>
          <p className="font-body text-xs text-forest-400 mt-3">
            Aussteller: Vincent Sarfi · SARFI Collection · hallo@sarfi-collection.de
          </p>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `document.getElementById('print-btn')?.addEventListener('click',()=>window.print())`,
        }}
      />
    </div>
  );
}
