import Link from "next/link";
import { IconInstagram, IconMail, IconMapPin } from "@/components/ui/Icons";
import SarfiLogo from "@/components/ui/SarfiLogo";

const footerLinks = {
  unterkuenfte: [
    { label: "HAUS28", href: "/haus28" },
    { label: "HAUS28 buchen", href: "/haus28/buchen" },
    { label: "Haus Schönblick", href: "/schoenblick" },
    { label: "Apartment B5", href: "/schoenblick/b5" },
    { label: "Apartment B6", href: "/schoenblick/b6" },
    { label: "Apartment B7", href: "/schoenblick/b7" },
    { label: "Apartment B8", href: "/schoenblick/b8" },
    { label: "Apartment A2", href: "/schoenblick/a2" },
  ],
  info: [
    { label: "Über uns", href: "/ueber-uns" },
    { label: "Kontakt", href: "/kontakt" },
    { label: "FAQ", href: "/kontakt#faq" },
  ],
  legal: [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest-900 text-cream-50/80" role="contentinfo">
      {/* Main Footer */}
      <div className="container-site py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="group inline-block mb-4" aria-label="SARFI Collection">
              <SarfiLogo
                variant="light"
                className="w-56 opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="font-body text-sm leading-relaxed text-cream-50/60 max-w-xs">
              Exklusive Ferienunterkünfte im Bayerischen Wald. Natur, Design und Komfort – direkt gebucht.
            </p>

            {/* Contact snippets */}
            <div className="mt-6 flex flex-col gap-2">
              <a
                href="mailto:28imwald@gmail.com"
                className="flex items-center gap-2 text-sm text-cream-50/60 hover:text-gold-300 transition-colors font-body"
                aria-label="E-Mail schreiben"
              >
                <IconMail size={15} />
                28imwald@gmail.com
              </a>
              <div className="flex items-start gap-2 text-sm text-cream-50/60 font-body">
                <IconMapPin size={15} className="mt-0.5 shrink-0" />
                <span>Bayerischer Wald, Deutschland</span>
              </div>
            </div>

            {/* Social */}
            <div className="mt-6 flex gap-3">
              <a
                href="https://www.instagram.com/haus28imwald/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-cream-50/20 text-cream-50/60 hover:text-gold-300 hover:border-gold-300/40 transition-all"
                aria-label="Instagram"
              >
                <IconInstagram size={16} />
              </a>
            </div>
          </div>

          {/* Unterkünfte */}
          <div>
            <h3 className="font-body text-xs font-semibold tracking-[0.15em] uppercase text-cream-50/40 mb-4">
              Unterkünfte
            </h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.unterkuenfte.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-cream-50/60 hover:text-cream-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-body text-xs font-semibold tracking-[0.15em] uppercase text-cream-50/40 mb-4">
              Informationen
            </h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.info.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-cream-50/60 hover:text-cream-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA-Box */}
          <div>
            <h3 className="font-body text-xs font-semibold tracking-[0.15em] uppercase text-cream-50/40 mb-4">
              Direkt buchen
            </h3>
            <p className="font-body text-sm text-cream-50/60 mb-4 leading-relaxed">
              Buche direkt bei uns und spare Plattformgebühren.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/haus28/buchen"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-body font-medium bg-gold-500 text-forest-900 hover:bg-gold-400 transition-colors shadow-cta"
              >
                HAUS28 buchen
              </Link>
              <Link
                href="/schoenblick/buchen"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-body font-medium border border-cream-50/20 text-cream-50/80 hover:text-cream-50 hover:border-cream-50/40 transition-colors"
              >
                Schönblick buchen
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream-50/10">
        <div className="container-site py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-cream-50/40">
            © {year} SARFI Collection. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-4">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-xs text-cream-50/40 hover:text-cream-50/70 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
