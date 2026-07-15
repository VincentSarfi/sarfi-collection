import Image from "next/image";
import Link from "next/link";
import { IconStar, IconArrowRight } from "@/components/ui/Icons";
import { getDict, localizeHref, type Locale } from "@/lib/i18n";

export default function UeberUnsPageContent({ locale }: { locale: Locale }) {
  const t = getDict(locale).about;

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <div className="relative h-64 md:h-80 bg-forest-900 flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/images/shared/panorama-drohne.jpg"
            alt={t.hero.imageAlt}
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 container-site pb-8 pt-24">
          <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-300 mb-2">
            {t.hero.kicker}
          </p>
          <h1 className="font-display text-display-lg text-cream-50">
            {t.hero.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container-site py-16 max-w-4xl">
        {/* Profilbild + Name */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-card-lg mb-4">
            <Image
              src="/images/team/profilbild.jpg"
              alt={t.profile.imageAlt}
              fill
              className="object-cover"
            />
          </div>
          <h2 className="font-display text-2xl text-forest-900">{t.profile.name}</h2>
          <p className="font-body text-sm text-forest-500 mt-1">{t.profile.role}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Story */}
          <div>
            <h2 className="font-display text-2xl text-forest-900 mb-4">{t.story.heading}</h2>
            <div className="space-y-4 font-body text-base text-forest-600 leading-relaxed">
              {t.story.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Values */}
          <div>
            <h2 className="font-display text-2xl text-forest-900 mb-4">{t.values.heading}</h2>
            <div className="space-y-4">
              {t.values.items.map((value) => (
                <div key={value.title} className="flex gap-4 p-4 rounded-xl bg-white border border-cream-200 shadow-card">
                  <span className="text-2xl shrink-0">{value.icon}</span>
                  <div>
                    <p className="font-body text-sm font-semibold text-forest-800 mb-1">{value.title}</p>
                    <p className="font-body text-sm text-forest-500 leading-relaxed">{value.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Awards / Social Proof */}
        <div className="mt-16 p-8 rounded-3xl bg-forest-900 text-center">
          <div className="flex justify-center gap-0.5 text-gold-300 mb-3">
            {[1,2,3,4,5].map(i => <IconStar key={i} size={20} filled />)}
          </div>
          <p className="font-display text-2xl text-cream-50 mb-2">
            {t.superhost.title}
          </p>
          <p className="font-body text-sm text-cream-50/60 max-w-md mx-auto">
            {t.superhost.text}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="font-body text-lg text-forest-600 mb-6">
            {t.cta.text}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href={localizeHref("/kontakt", locale)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-forest-700 text-cream-50 rounded-full font-body font-medium text-sm hover:bg-forest-800 transition-colors"
            >
              {t.cta.contactLabel}
              <IconArrowRight size={16} />
            </Link>
            <Link
              href={localizeHref("/haus28", locale)}
              className="inline-flex items-center gap-2 px-6 py-3 border border-forest-200 text-forest-700 rounded-full font-body text-sm hover:border-forest-400 transition-colors"
            >
              {t.cta.homesLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
