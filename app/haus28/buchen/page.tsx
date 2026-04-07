import type { Metadata } from "next";
import { haus28 } from "@/data/properties";
import SmoobuBookingWidget from "@/components/property/SmoobuBookingWidget";
import { IconArrowRight, IconStar, IconMapPin } from "@/components/ui/Icons";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HAUS28 buchen – Direkt & günstig",
  description:
    "Buche HAUS28 direkt und spare Plattformgebühren. Modernes A-Frame Ferienhaus im Bayerischen Wald. Ab 149€ / Nacht. Sofort verfügbare Termine.",
  robots: { index: false }, // Booking pages don't need indexing
};

export default function Haus28BuchenPage() {
  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* Header bar */}
      <div className="bg-forest-900 border-b border-cream-50/10">
        <div className="container-site py-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <nav aria-label="Breadcrumb" className="mb-1">
              <ol className="flex items-center gap-2 font-body text-xs text-cream-50/40">
                <li><Link href="/" className="hover:text-cream-50/70 transition-colors">Startseite</Link></li>
                <li className="flex items-center gap-2">
                  <IconArrowRight size={10} />
                  <Link href="/haus28" className="hover:text-cream-50/70 transition-colors">HAUS28</Link>
                </li>
                <li className="flex items-center gap-2">
                  <IconArrowRight size={10} />
                  <span className="text-cream-50/60">Buchen</span>
                </li>
              </ol>
            </nav>
            <h1 className="font-display text-2xl text-cream-50">
              HAUS28 <span className="text-gold-300">buchen</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5 text-gold-300">
                {[1,2,3,4,5].map(i => <IconStar key={i} size={12} filled />)}
              </div>
              <span className="font-body text-sm text-cream-50/70">
                {haus28.airbnbRating} · {haus28.airbnbReviewCount} Bewertungen
              </span>
            </div>
            <div className="flex items-center gap-1 text-cream-50/50">
              <IconMapPin size={13} />
              <span className="font-body text-xs">{haus28.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking widget */}
      <SmoobuBookingWidget
        propertyId={haus28.smoobuPropertyId}
        propertyName={haus28.name}
        fallbackUrl={haus28.smoobuEmbedUrl}
      />

      {/* Trust bar */}
      <div className="container-site pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { icon: "🔒", title: "Sichere Zahlung", text: "SSL-verschlüsselt" },
            { icon: "💬", title: "Persönliche Betreuung", text: "Direkter Kontakt zum Gastgeber" },
            { icon: "💰", title: "Keine Gebühren", text: "Günstiger als Buchungsplattformen" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-cream-200 shadow-card">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-body text-sm font-medium text-forest-800">{item.title}</p>
                <p className="font-body text-xs text-forest-500">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
