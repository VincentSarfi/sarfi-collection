import Link from "next/link";
import { IconInstagram, IconMail, IconMapPin, IconPhone } from "@/components/ui/Icons";
import SarfiLogo from "@/components/ui/SarfiLogo";
import NewsletterForm from "@/components/layout/NewsletterForm";
import { getDict, localizeHref, localizePath, type Locale } from "@/lib/i18n";

export default function Footer({ locale = "de" }: { locale?: Locale }) {
  const t = getDict(locale).common.footer;
  const year = new Date().getFullYear();

  // Deutsche Referenzpfade; localizeHref mappt übersetzte Seiten auf /en/…
  const footerLinks = {
    unterkuenfte: [
      { label: "HAUS28", href: "/haus28" },
      { label: "Haus Schönblick", href: "/schoenblick" },
      { label: "Apartment B5", href: "/schoenblick/b5" },
      { label: "Apartment B6", href: "/schoenblick/b6" },
      { label: "Apartment B7", href: "/schoenblick/b7" },
      { label: "Apartment B8", href: "/schoenblick/b8" },
      { label: "Apartment A2", href: "/schoenblick/a2" },
    ],
    info: [
      { label: t.links.ueberUns, href: "/ueber-uns" },
      { label: t.links.kontakt, href: "/kontakt" },
      { label: t.links.faq, href: "/kontakt#faq" },
      { label: t.links.blog, href: "/blog" },
      { label: t.links.ausflugsziele, href: "/ausflugsziele" },
      { label: t.links.gutschein, href: "/gutschein" },
      { label: t.links.stornierung, href: "/stornierung" },
    ],
    legal: [
      { label: t.links.impressum, href: "/impressum" },
      { label: t.links.datenschutz, href: "/datenschutz" },
      { label: t.links.agb, href: "/agb" },
    ],
  };

  return (
    <footer className="bg-forest-900 text-cream-50/80" role="contentinfo">
      {/* Main Footer */}
      <div className="container-site py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={localizePath("/", locale)} className="group inline-block mb-4" aria-label="SARFI Collection">
              <SarfiLogo
                variant="light"
                className="w-56 opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="font-body text-sm leading-relaxed text-cream-50/60 max-w-xs">
              {t.brandText}
            </p>

            {/* Contact snippets */}
            <div className="mt-6 flex flex-col gap-2">
              <a
                href="mailto:hallo@sarfi-collection.de"
                className="flex items-center gap-2 text-sm text-cream-50/60 hover:text-gold-300 transition-colors font-body"
                aria-label={t.emailAria}
              >
                <IconMail size={15} />
                hallo@sarfi-collection.de
              </a>
              <a
                href="tel:+4917656850146"
                className="flex items-center gap-2 text-sm text-cream-50/60 hover:text-gold-300 transition-colors font-body"
                aria-label={t.phoneAria}
              >
                <IconPhone size={15} />
                +49 176 56850146
              </a>
              <a
                href="https://wa.me/4917656850146"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-cream-50/60 hover:text-gold-300 transition-colors font-body"
                aria-label={t.whatsappAria}
              >
                <IconPhone size={15} />
                WhatsApp
              </a>
              <div className="flex items-start gap-2 text-sm text-cream-50/60 font-body">
                <IconMapPin size={15} className="mt-0.5 shrink-0" />
                <span>{t.location}</span>
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
            <h3 className="font-body text-xs font-semibold tracking-[0.15em] uppercase text-cream-50/60 mb-4">
              {t.headingHomes}
            </h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.unterkuenfte.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localizeHref(link.href, locale)}
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
            <h3 className="font-body text-xs font-semibold tracking-[0.15em] uppercase text-cream-50/60 mb-4">
              {t.headingInfo}
            </h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.info.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localizeHref(link.href, locale)}
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
            <h3 className="font-body text-xs font-semibold tracking-[0.15em] uppercase text-cream-50/60 mb-4">
              {t.headingBook}
            </h3>
            <p className="font-body text-sm text-cream-50/60 mb-4 leading-relaxed">
              {t.bookText}
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href={localizeHref("/buchen", locale)}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-body font-medium bg-gold-500 text-forest-900 hover:bg-gold-400 transition-colors shadow-cta"
              >
                {t.bookCta}
              </Link>
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <h3 className="font-body text-xs font-semibold tracking-[0.15em] uppercase text-cream-50/60 mb-3">
                {t.headingNewsletter}
              </h3>
              <p className="font-body text-sm text-cream-50/60 mb-3 leading-relaxed">
                {t.newsletterText}
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream-50/10">
        <div className="container-site py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-cream-50/60">
            © {year} SARFI Collection. {t.copyright}
          </p>
          <div className="flex gap-4">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-xs text-cream-50/60 hover:text-cream-50/70 transition-colors"
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
