"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Turnstile } from "@marsidev/react-turnstile"
import BookingCalendar, { toDateKey, fmtShort, fmtLong, type SelectionStep } from "./BookingCalendar"
import PaymentStep from "./PaymentStep"
import type { AvailabilityMap } from "@/lib/smoobu"
import type { NightRate } from "@/lib/pricelabs"
import { getDict, localizeHref, type Locale } from "@/lib/i18n"
import { useLocale } from "@/lib/i18n/LocaleProvider"

type BookingDict = ReturnType<typeof getDict>["booking"]

/** BCP-47 tag für Zahlenformatierung je Locale */
const numLocale = (locale: Locale): string => (locale === "en" ? "en-GB" : "de-DE")

// Public Cloudflare Turnstile site key (safe to expose client-side).
const TURNSTILE_SITE_KEY = "0x4AAAAAADCAIuxW7h0ePfOM"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BookingWidgetProps {
  smoobuId: string
  propertyName: string
  propertySlug: string
  maxGuests: number
  minStay: number
  cleaningFee: number
  priceFrom: number
  baseOccupancy: number
  extraPersonFee: number
  breadcrumb: Array<{ label: string; href: string }>
  propertyHref: string
  /** Hide the fixed mobile bottom bar (e.g. when multiple widgets are on one page) */
  hideMobileBar?: boolean
  /** Render as a sticky sidebar card (calendar opens inline, no page scroll) */
  sidebarMode?: boolean
}

type Step = "dates" | "form" | "payment" | "confirmed" | "error"
type PaymentOption = "50" | "100"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
  isBusinessBooking: boolean
  company: string
  vatId: string
  street: string
  zip: string
  city: string
  country: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

interface PriceBreakdown {
  nights: number
  nightlyTotal: number
  extraPersonTotal: number
  cleaningFee: number
  total: number
  avgNightly: number
  extraGuests: number
}

// ─── Price Calculator ─────────────────────────────────────────────────────────

function calcPrice(
  checkIn: Date,
  checkOut: Date,
  priceMap: Record<string, number>,
  priceFrom: number,
  cleaningFee: number,
  guests: number,
  baseOccupancy: number,
  extraPersonFee: number,
): PriceBreakdown {
  const nights = Math.round(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
  )

  let nightlyTotal = 0
  const cursor = new Date(checkIn)
  let daysWithPrice = 0

  while (cursor < checkOut) {
    const key = toDateKey(cursor)
    const rate = priceMap[key] && priceMap[key] > 0 ? priceMap[key] : priceFrom
    nightlyTotal += rate
    daysWithPrice++
    cursor.setDate(cursor.getDate() + 1)
  }

  if (daysWithPrice === 0) nightlyTotal = priceFrom * nights

  const extraGuests = Math.max(0, guests - baseOccupancy)
  const extraPersonTotal = extraGuests * extraPersonFee * nights

  return {
    nights,
    nightlyTotal: Math.round(nightlyTotal),
    extraPersonTotal,
    cleaningFee,
    total: Math.round(nightlyTotal + extraPersonTotal + cleaningFee),
    avgNightly: Math.round(nightlyTotal / nights),
    extraGuests,
  }
}

// ─── Form validation ──────────────────────────────────────────────────────────

function validateForm(data: FormData, v: BookingDict["validation"]): FormErrors {
  const errors: FormErrors = {}

  // Name: min 2 Zeichen, nur Buchstaben (inkl. Umlaute, Bindestriche)
  if (!data.firstName.trim()) {
    errors.firstName = v.firstNameRequired
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = v.firstNameTooShort
  } else if (!/^[a-zA-ZÄÖÜäöüß\s\-']+$/.test(data.firstName.trim())) {
    errors.firstName = v.lettersOnly
  }

  if (!data.lastName.trim()) {
    errors.lastName = v.lastNameRequired
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = v.lastNameTooShort
  } else if (!/^[a-zA-ZÄÖÜäöüß\s\-']+$/.test(data.lastName.trim())) {
    errors.lastName = v.lettersOnly
  }

  // E-Mail: gültiges Format, TLD min 2 Zeichen
  if (!data.email.trim()) {
    errors.email = v.emailRequired
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) {
    errors.email = v.emailInvalid
  }

  // Telefon: muss mind. 6 Ziffern enthalten, kein reiner Text
  if (!data.phone.trim()) {
    errors.phone = v.phoneRequired
  } else if ((data.phone.replace(/\D/g, "").length < 6)) {
    errors.phone = v.phoneInvalid
  }

  return errors
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const TRUST_BADGE_EMOJIS = ["🔒", "💬", "💰"] as const

function TrustBadges() {
  const locale = useLocale()
  const t = getDict(locale).booking
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
      {t.trustBadges.map((b, i) => (
        <div
          key={b.title}
          className="flex items-center gap-3 p-3 rounded-xl bg-cream-50 border border-cream-200"
        >
          <span className="text-xl">{TRUST_BADGE_EMOJIS[i]}</span>
          <div>
            <p className="font-body text-xs font-semibold text-forest-800">{b.title}</p>
            <p className="font-body text-xs text-forest-400">{b.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
}

function Input({ label, error, required, ...props }: InputProps) {
  return (
    <div>
      <label className="block font-body text-xs font-medium text-forest-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        {...props}
        className={[
          "w-full rounded-xl border px-3.5 py-2.5 font-body text-sm text-forest-900 bg-white",
          "placeholder:text-forest-300 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent",
          error ? "border-red-400" : "border-cream-300 hover:border-forest-300",
        ]
          .filter(Boolean)
          .join(" ")}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 text-xs font-body text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Booking Widget (main) ─────────────────────────────────────────────────────

export default function BookingWidget({
  smoobuId,
  propertyName,
  maxGuests,
  minStay,
  cleaningFee,
  priceFrom,
  baseOccupancy,
  extraPersonFee,
  breadcrumb,
  propertyHref,
  hideMobileBar = false,
  sidebarMode = false,
}: BookingWidgetProps) {
  // ── Locale (Texte + Zahlen-/Datumsformatierung) ──
  const locale = useLocale()
  const t = getDict(locale).booking
  const nf = numLocale(locale)

  // ── Ref zum Scrollen zum Widget-Anfang (nicht Seitenanfang) ──
  const widgetRef = useRef<HTMLDivElement>(null)

  const scrollToWidget = useCallback(() => {
    widgetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  // ── State ──
  const [step, setStep] = useState<Step>("dates")
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [selectionStep, setSelectionStep] = useState<SelectionStep>("checkin")
  const [guests, setGuests] = useState(2)
  const [showGuestDropdown, setShowGuestDropdown] = useState(false)
  const [showCalendarOverlay, setShowCalendarOverlay] = useState(false)

  const [availabilityMap, setAvailabilityMap] = useState<AvailabilityMap>({})
  const [loadingAvailability, setLoadingAvailability] = useState(true)

  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    isBusinessBooking: false,
    company: "",
    vatId: "",
    street: "",
    zip: "",
    city: "",
    country: "",
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const turnstileToken = useRef<string>("")
  const [turnstileReady, setTurnstileReady] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [paymentOption, setPaymentOption] = useState<PaymentOption>("50")

  // ── Stripe + PriceLabs state ──
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null)
  const [depositAmount, setDepositAmount] = useState<number>(0)
  const [plPriceMap, setPlPriceMap] = useState<Record<string, NightRate>>({})

  // ── Fetch availability + PriceLabs prices in parallel ──
  useEffect(() => {
    async function load() {
      setLoadingAvailability(true)
      const today = new Date()
      const endDate = new Date(today)
      endDate.setFullYear(today.getFullYear() + 1)
      const start = today.toISOString().split("T")[0]
      const end = endDate.toISOString().split("T")[0]

      await Promise.allSettled([
        // Smoobu availability (blocked dates)
        fetch(`/api/smoobu/availability?propertyId=${smoobuId}&startDate=${start}&endDate=${end}`)
          .then(r => r.ok ? r.json() : {})
          .then((data: AvailabilityMap) => setAvailabilityMap(data))
          .catch(() => {}),

        // PriceLabs dynamic prices
        fetch(`/api/pricelabs/rates?listingId=${smoobuId}&startDate=${start}&endDate=${end}`)
          .then(r => r.ok ? r.json() : {})
          .then((data: Record<string, NightRate>) => setPlPriceMap(data))
          .catch(() => {}),
      ])

      setLoadingAvailability(false)
    }
    load()
  }, [smoobuId])

  // Kalender-Overlay per Escape schließen (Tastatur-Bedienbarkeit)
  useEffect(() => {
    if (!showCalendarOverlay) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowCalendarOverlay(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [showCalendarOverlay])

  // ── Derived data ──
  const blockedDates = useMemo<Set<string>>(() => {
    const s = new Set<string>()
    for (const [date, day] of Object.entries(availabilityMap)) {
      if (!day.available) s.add(date)
    }
    return s
  }, [availabilityMap])

  // PriceLabs prices take priority; fall back to Smoobu rates, then priceFrom
  const priceMap = useMemo<Record<string, number>>(() => {
    const m: Record<string, number> = {}
    // First: Smoobu fallback prices
    for (const [date, day] of Object.entries(availabilityMap)) {
      if (day.price > 0) m[date] = day.price
    }
    // Override with PriceLabs dynamic prices (more accurate)
    for (const [date, night] of Object.entries(plPriceMap)) {
      if (night.price > 0) m[date] = night.price
    }
    return m
  }, [availabilityMap, plPriceMap])

  // Min-stay map: PriceLabs takes priority over Smoobu
  const minStayMap = useMemo<Record<string, number>>(() => {
    const m: Record<string, number> = {}
    for (const [date, day] of Object.entries(availabilityMap)) {
      if (day.minimumStay > 1) m[date] = day.minimumStay
    }
    for (const [date, night] of Object.entries(plPriceMap)) {
      if (night.minStay > 1) m[date] = night.minStay
    }
    return m
  }, [availabilityMap, plPriceMap])

  const priceBreakdown = useMemo<PriceBreakdown | null>(() => {
    if (!checkIn || !checkOut) return null
    return calcPrice(checkIn, checkOut, priceMap, priceFrom, cleaningFee, guests, baseOccupancy, extraPersonFee)
  }, [checkIn, checkOut, priceMap, priceFrom, cleaningFee, guests, baseOccupancy, extraPersonFee])

  // Effective display price: minimum PriceLabs price over the fetched year, else priceFrom
  const effectivePrice = useMemo(() => {
    const prices = Object.values(plPriceMap).map(r => r.price).filter(p => p > 0)
    return prices.length > 0 ? Math.min(...prices) : priceFrom
  }, [plPriceMap, priceFrom])

  // ── Calendar handlers ──
  const handleDateClick = useCallback(
    (date: Date) => {
      if (selectionStep === "checkin") {
        setCheckIn(date)
        setCheckOut(null)
        setSelectionStep("checkout")
      } else {
        if (date <= checkIn!) {
          setCheckIn(date)
          setCheckOut(null)
          setSelectionStep("checkout")
        } else {
          setCheckOut(date)
          setSelectionStep("checkin")
          if (sidebarMode) setShowCalendarOverlay(false)
        }
      }
    },
    [selectionStep, checkIn, sidebarMode],
  )

  const handleReset = useCallback(() => {
    setCheckIn(null)
    setCheckOut(null)
    setSelectionStep("checkin")
  }, [])

  // ── Form handlers ──
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target as HTMLInputElement
    const { name, value, type } = target
    const checked = type === "checkbox" ? target.checked : undefined
    setForm((prev) => ({ ...prev, [name]: checked !== undefined ? checked : value }))
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // Step 2 → Step 3: validate form, create Stripe PaymentIntent
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkIn || !checkOut || !priceBreakdown) return

    const errors = validateForm(form, t.validation)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    // Bot-Schutz: nicht ohne Token absenden (sonst 403 → Fehlerscreen + Datenverlust)
    if (!turnstileToken.current) {
      setErrorMsg(t.errors.securityCheckPending)
      return
    }

    setSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch("/api/stripe/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apartmentId: smoobuId,
          propertyName,
          checkIn: toDateKey(checkIn),
          checkOut: toDateKey(checkOut),
          guests,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          message: form.message.trim() || undefined,
          isBusinessBooking: form.isBusinessBooking,
          company: form.company.trim() || undefined,
          vatId: form.vatId.trim() || undefined,
          street: form.street.trim() || undefined,
          zip: form.zip.trim() || undefined,
          city: form.city.trim() || undefined,
          country: form.country.trim() || undefined,
          totalPrice: priceBreakdown.total,
          paymentOption,
          turnstileToken: turnstileToken.current,
          // Buchungssprache des Gasts – steuert serverseitig Gast-Mails & Smoobu
          locale,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        // API-Meldungen sind deutsch – auf /en die generische Dictionary-Meldung zeigen.
        setErrorMsg(locale === "de" ? (data.error ?? t.errors.paymentGeneric) : t.errors.paymentGeneric)
        setStep("error")
      } else {
        setStripeClientSecret(data.clientSecret)
        setDepositAmount(data.depositAmount)
        setStep("payment")
        scrollToWidget()
      }
    } catch {
      setErrorMsg(t.errors.connectionCheck)
      setStep("error")
    } finally {
      setSubmitting(false)
    }
  }

  // Step 3 → Step 4: payment succeeded → webhook handles Smoobu booking + emails
  const handlePaymentSuccess = (_paymentIntentId: string) => {
    setStep("confirmed")
    scrollToWidget()
  }

  const handlePaymentError = (msg: string) => {
    setErrorMsg(msg)
    setStep("error")
  }

  // ── Render helpers ──
  const datesLabel =
    checkIn && checkOut
      ? `${fmtShort(checkIn, locale)} – ${fmtShort(checkOut, locale)}`
      : checkIn
        ? `${fmtShort(checkIn, locale)} → …`
        : t.labels.chooseDate

  // ══════════════════════════════════════════════════════════════════════════
  // CONFIRMED SCREEN
  // ══════════════════════════════════════════════════════════════════════════
  if (step === "confirmed") {
    if (sidebarMode) {
      return (
        <div ref={widgetRef} className="rounded-2xl border border-cream-200 shadow-card-lg bg-white p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-forest-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-display text-xl text-forest-900 mb-1">{t.confirmed.title}</h3>
          <p className="font-body text-sm text-forest-500 mb-4">
            {t.confirmed.sidebarThanksPre}<strong>{form.firstName}</strong>{t.confirmed.sidebarThanksPost}
          </p>
          <div className="bg-cream-50 rounded-xl border border-cream-200 p-4 text-left space-y-1.5 mb-4">
            <div className="flex justify-between font-body text-sm">
              <span className="text-forest-400">{t.labels.arrival}</span>
              <span className="font-medium text-forest-900">{checkIn ? fmtLong(checkIn, locale) : "–"}</span>
            </div>
            <div className="flex justify-between font-body text-sm">
              <span className="text-forest-400">{t.labels.departure}</span>
              <span className="font-medium text-forest-900">{checkOut ? fmtLong(checkOut, locale) : "–"}</span>
            </div>
            {priceBreakdown && (
              <div className="flex justify-between font-body text-sm border-t border-cream-200 pt-1.5">
                <span className="font-semibold text-forest-800">{t.labels.total}</span>
                <span className="font-bold text-forest-900">{priceBreakdown.total.toLocaleString(nf)} €</span>
              </div>
            )}
          </div>
        </div>
      )
    }
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          {/* Checkmark */}
          <div className="w-20 h-20 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-forest-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="font-display text-3xl text-forest-900 mb-2">
            {t.confirmed.title}
          </h2>
          <p className="font-body text-forest-600 mb-6">
            {t.confirmed.thanksPre}<strong>{form.firstName}</strong>{t.confirmed.thanksAfterName}
            <strong>{propertyName}</strong>{t.confirmed.thanksAfterProperty}<strong>{form.email}</strong>{t.confirmed.thanksAfterEmail}
          </p>
          <p className="font-body text-xs text-forest-400 mb-4 bg-cream-100 rounded-xl px-4 py-3">
            {t.confirmed.deliveryNote}
          </p>

          {/* Summary card */}
          <div className="bg-cream-50 rounded-2xl border border-cream-200 p-5 text-left mb-6">
            <p className="font-body text-xs text-forest-500 uppercase tracking-wider mb-3">
              {t.confirmed.detailsHeading}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between font-body text-sm">
                <span className="text-forest-500">{t.labels.property}</span>
                <span className="font-medium text-forest-900">{propertyName}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-forest-500">{t.labels.arrival}</span>
                <span className="font-medium text-forest-900">{checkIn ? fmtLong(checkIn, locale) : "–"}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-forest-500">{t.labels.departure}</span>
                <span className="font-medium text-forest-900">{checkOut ? fmtLong(checkOut, locale) : "–"}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-forest-500">{t.labels.guests}</span>
                <span className="font-medium text-forest-900">{guests}</span>
              </div>
              {priceBreakdown && (
                <div className="flex justify-between font-body text-sm border-t border-cream-200 pt-2 mt-2">
                  <span className="font-semibold text-forest-800">{t.labels.totalPrice}</span>
                  <span className="font-bold text-forest-900">{priceBreakdown.total.toLocaleString(nf)} €</span>
                </div>
              )}
            </div>
          </div>

          <Link
            href={localizeHref(propertyHref, locale)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-800 text-cream-50 font-body text-sm font-medium hover:bg-forest-700 transition-colors"
          >
            {t.confirmed.backToProperty}
          </Link>
        </motion.div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ERROR SCREEN
  // ══════════════════════════════════════════════════════════════════════════
  if (step === "error") {
    if (sidebarMode) {
      return (
        <div ref={widgetRef} className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-body text-sm font-semibold text-red-700 mb-2">{t.errorScreen.title}</p>
          <p className="font-body text-xs text-red-600 mb-4">{errorMsg}</p>
          <button
            onClick={() => { setStep("form"); setErrorMsg(null) }}
            className="px-4 py-2 rounded-xl bg-forest-800 text-cream-50 font-body text-sm hover:bg-forest-700 transition-colors"
          >
            {t.errorScreen.retry}
          </button>
        </div>
      )
    }
    return (
      <div className="min-h-[40vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="font-display text-2xl text-forest-900 mb-2">{t.errorScreen.title}</h2>
          <p className="font-body text-forest-600 mb-6">{errorMsg}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { setStep("form"); setErrorMsg(null) }}
              className="px-6 py-3 rounded-full bg-forest-800 text-cream-50 font-body text-sm font-medium hover:bg-forest-700 transition-colors"
            >
              {t.errorScreen.retry}
            </button>
            <Link
              href={localizeHref("/kontakt", locale)}
              className="px-6 py-3 rounded-full border border-forest-300 text-forest-700 font-body text-sm font-medium hover:bg-cream-100 transition-colors"
            >
              {t.errorScreen.contact}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SIDEBAR MODE (compact card + floating calendar overlay)
  // ══════════════════════════════════════════════════════════════════════════
  if (sidebarMode) {
    return (
      <>
        {/* ── Floating calendar overlay ── */}
        <AnimatePresence>
          {showCalendarOverlay && (
            <motion.div
              key="cal-overlay-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-forest-900/40 flex justify-end items-start pt-20 pr-6"
              onClick={() => setShowCalendarOverlay(false)}
            >
              <motion.div
                key="cal-overlay-panel"
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden w-auto"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={t.sidebar.overlayTitle}
              >
                {/* Date input row */}
                <div className="p-5 border-b border-cream-100">
                  <h3 className="font-display text-lg text-forest-900 mb-4">{t.sidebar.overlayTitle}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={["rounded-xl border-2 p-3 transition-colors", selectionStep === "checkin" ? "border-forest-700 bg-forest-50" : "border-cream-200"].join(" ")}>
                      <p className="font-body text-[10px] font-bold text-forest-400 uppercase tracking-wider">{t.sidebar.checkInField}</p>
                      <p className={`font-body text-sm font-medium mt-0.5 ${checkIn ? "text-forest-900" : "text-forest-400"}`}>
                        {checkIn ? fmtShort(checkIn, locale) : t.sidebar.dateFormatHint}
                      </p>
                    </div>
                    <div className={["rounded-xl border-2 p-3 transition-colors", selectionStep === "checkout" && checkIn ? "border-forest-700 bg-forest-50" : "border-cream-200"].join(" ")}>
                      <p className="font-body text-[10px] font-bold text-forest-400 uppercase tracking-wider">{t.sidebar.checkOutField}</p>
                      <p className={`font-body text-sm font-medium mt-0.5 ${checkOut ? "text-forest-900" : "text-forest-400"}`}>
                        {checkOut ? fmtShort(checkOut, locale) : t.sidebar.addDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Calendar */}
                <div className="p-5">
                  {loadingAvailability && (
                    <div className="flex items-center gap-2 mb-3 text-xs font-body text-forest-400">
                      <span className="w-3 h-3 border-2 border-forest-300 border-t-forest-700 rounded-full animate-spin" />
                      {t.sidebar.loadingAvailability}
                    </div>
                  )}
                  <BookingCalendar
                    blockedDates={blockedDates}
                    minStayMap={minStayMap}
                    defaultMinStay={minStay}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    selectionStep={selectionStep}
                    onDateClick={handleDateClick}
                    onReset={handleReset}
                    priceMap={priceMap}
                  />
                </div>

                {/* Overlay footer */}
                <div className="px-5 pb-5 pt-3 border-t border-cream-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => { handleReset(); }}
                    className="font-body text-sm text-forest-500 underline hover:text-forest-900 transition-colors"
                  >
                    {t.sidebar.resetDates}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCalendarOverlay(false)}
                    className="px-5 py-2.5 rounded-xl bg-forest-900 text-cream-50 font-body text-sm font-semibold hover:bg-forest-700 transition-colors"
                  >
                    {t.labels.close}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Compact sidebar card ── */}
        <div
          ref={widgetRef}
          className="rounded-2xl border border-cream-200 shadow-[0_6px_32px_rgba(0,0,0,0.10)] bg-white overflow-x-hidden overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 9rem)" }}
        >

        {/* Price header */}
        <div className="px-5 pt-5 pb-4 border-b border-cream-100">
          <div className="flex items-baseline justify-between">
            <div>
              {priceBreakdown ? (
                <>
                  <span className="font-body text-sm text-forest-500">{t.sidebar.totalPriceSpaced}</span>
                  <span className="font-display text-2xl text-forest-900">{priceBreakdown.total.toLocaleString(nf)} €</span>
                </>
              ) : (
                <>
                  <span className="font-body text-sm text-forest-500">{t.labels.from}</span>
                  <span className="font-display text-2xl text-forest-900">{effectivePrice} €</span>
                  <span className="font-body text-sm text-forest-400 ml-1">{t.labels.perNight}</span>
                </>
              )}
            </div>
            {checkIn && checkOut && (
              <button onClick={handleReset} className="font-body text-xs text-forest-400 underline hover:text-forest-700 transition-colors">
                {t.labels.reset}
              </button>
            )}
          </div>
        </div>

        {/* Date inputs – click opens overlay */}
        <div className="px-5 pt-4 pb-3">
          <div
            role="button"
            tabIndex={step === "dates" ? 0 : -1}
            aria-label={t.sidebar.ariaChooseRange}
            className="rounded-xl border-2 border-cream-200 hover:border-forest-400 cursor-pointer transition-colors overflow-hidden mb-2 focus:outline-none focus:ring-2 focus:ring-forest-500"
            onClick={() => { if (step === "dates") { handleReset(); setShowCalendarOverlay(true); } }}
            onKeyDown={(e) => { if (step === "dates" && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); handleReset(); setShowCalendarOverlay(true); } }}
          >
            <div className="grid grid-cols-2 divide-x-2 divide-cream-200">
              <div className="p-3">
                <p className="font-body text-[10px] font-bold uppercase tracking-wider text-forest-700">{t.labels.arrival}</p>
                <p className={`font-body text-sm mt-0.5 ${checkIn ? "text-forest-900 font-medium" : "text-forest-400"}`}>
                  {checkIn ? fmtShort(checkIn, locale) : t.labels.chooseDate}
                </p>
              </div>
              <div className="p-3">
                <p className="font-body text-[10px] font-bold uppercase tracking-wider text-forest-700">{t.labels.departure}</p>
                <p className={`font-body text-sm mt-0.5 ${checkOut ? "text-forest-900 font-medium" : "text-forest-400"}`}>
                  {checkOut ? fmtShort(checkOut, locale) : "–"}
                </p>
              </div>
            </div>
          </div>

          {/* Guest selector */}
          <div className="relative">
            <button type="button" onClick={() => setShowGuestDropdown(!showGuestDropdown)}
              className="w-full rounded-xl border-2 border-cream-200 hover:border-forest-300 px-3 py-2.5 flex items-center justify-between transition-colors">
              <div className="text-left">
                <p className="font-body text-[10px] text-forest-400 uppercase tracking-wider mb-0.5">{t.labels.guests}</p>
                <p className="font-body text-sm text-forest-900 font-medium">{t.labels.guestCount(guests)}</p>
              </div>
              <svg className={`w-4 h-4 text-forest-500 transition-transform ${showGuestDropdown ? "rotate-180" : ""}`} fill="none" viewBox="0 0 16 16">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <AnimatePresence>
              {showGuestDropdown && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-cream-200 shadow-card-lg p-4 z-20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-body text-sm font-medium text-forest-800">{t.labels.guests}</p>
                      <p className="font-body text-xs text-forest-400">{t.labels.maxPersons(maxGuests)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" aria-label={t.labels.ariaFewerGuests} onClick={() => setGuests(Math.max(1, guests - 1))} disabled={guests <= 1 || step === "payment"}
                        className="w-8 h-8 rounded-full border border-cream-300 flex items-center justify-center text-forest-600 hover:border-forest-500 disabled:opacity-30 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      </button>
                      <span className="font-body text-base font-semibold text-forest-900 w-4 text-center">{guests}</span>
                      <button type="button" aria-label={t.labels.ariaMoreGuests} onClick={() => setGuests(Math.min(maxGuests, guests + 1))} disabled={guests >= maxGuests || step === "payment"}
                        className="w-8 h-8 rounded-full border border-cream-300 flex items-center justify-center text-forest-600 hover:border-forest-500 disabled:opacity-30 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                  </div>
                  <button type="button" onClick={() => setShowGuestDropdown(false)}
                    className="mt-3 text-xs font-body text-forest-500 underline hover:text-forest-800 w-full text-right">{t.labels.close}</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CTA */}
        {step === "dates" && (
          <div className="px-5 pb-3">
            <button
              onClick={() => {
                if (!checkIn || !checkOut) setShowCalendarOverlay(true)
                else setStep("form")
              }}
              className="w-full py-3.5 rounded-xl bg-gold-500 text-forest-900 font-body font-semibold text-base hover:bg-gold-400 transition-colors shadow-sm"
            >
              {checkIn && checkOut ? t.sidebar.bookNow : t.sidebar.checkAvailability}
            </button>
          </div>
        )}

        {/* Price breakdown */}
        <AnimatePresence>
          {priceBreakdown && step === "dates" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden px-5 pb-2">
              <div className="border-t border-cream-100 py-3 space-y-1.5">
                <div className="flex justify-between font-body text-sm text-forest-600">
                  <span className="underline underline-offset-2 decoration-forest-300">{priceBreakdown.avgNightly} € × {priceBreakdown.nights} {t.labels.nightsPlural}</span>
                  <span>{priceBreakdown.nightlyTotal} €</span>
                </div>
                {priceBreakdown.extraPersonTotal > 0 && (
                  <div className="flex justify-between font-body text-sm text-forest-600">
                    <span>{t.labels.extraPersonFee}</span>
                    <span>+{priceBreakdown.extraPersonTotal} €</span>
                  </div>
                )}
                <div className="flex justify-between font-body text-sm text-forest-600">
                  <span className="underline underline-offset-2 decoration-forest-300">{t.labels.cleaningFee}</span>
                  <span>{priceBreakdown.cleaningFee} €</span>
                </div>
                <div className="flex justify-between font-body text-sm font-bold text-forest-900 border-t border-cream-200 pt-1.5">
                  <span>{t.labels.total}</span>
                  <span>{priceBreakdown.total.toLocaleString(nf)} €</span>
                </div>
                <p className="text-center font-body text-xs text-forest-400 pt-1">{t.labels.notCharged}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form step */}
        <AnimatePresence>
          {step === "form" && (
            <motion.div key="sidebar-form" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
              className="border-t border-cream-100">
              <div className="px-5 py-4">
                <button type="button" onClick={() => setStep("dates")}
                  className="mb-4 flex items-center gap-1.5 text-sm font-body text-forest-500 hover:text-forest-900 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {t.form.back}
                </button>
                <form onSubmit={handleSubmit} noValidate className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Input label={t.form.firstName} name="firstName" type="text" value={form.firstName} onChange={handleFormChange} error={formErrors.firstName} required autoComplete="given-name" placeholder={t.form.phFirstName} />
                    <Input label={t.form.lastName} name="lastName" type="text" value={form.lastName} onChange={handleFormChange} error={formErrors.lastName} required autoComplete="family-name" placeholder={t.form.phLastName} />
                  </div>
                  <Input label={t.form.emailShort} name="email" type="email" value={form.email} onChange={handleFormChange} error={formErrors.email} required autoComplete="email" placeholder={t.form.phEmail} />
                  <Input label={t.form.phoneShort} name="phone" type="tel" value={form.phone} onChange={handleFormChange} error={formErrors.phone} required autoComplete="tel" placeholder={t.form.phPhone} />
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" name="isBusinessBooking" checked={form.isBusinessBooking} onChange={handleFormChange} className="w-4 h-4 rounded border-cream-300 accent-forest-700 cursor-pointer" />
                    <span className="font-body text-xs text-forest-700">{t.form.businessToggle}</span>
                  </label>
                  {form.isBusinessBooking && (
                    <div className="space-y-2 rounded-xl border border-cream-200 bg-cream-50 p-3">
                      <p className="font-body text-xs font-medium text-forest-500 uppercase tracking-wider">{t.form.billingHeading}</p>
                      <Input label={t.form.company} name="company" type="text" value={form.company} onChange={handleFormChange} autoComplete="organization" placeholder={t.form.phCompany} />
                      <Input label={t.form.vatId} name="vatId" type="text" value={form.vatId} onChange={handleFormChange} autoComplete="off" placeholder={t.form.phVatId} />
                      <Input label={t.form.street} name="street" type="text" value={form.street} onChange={handleFormChange} autoComplete="street-address" placeholder={t.form.phStreet} />
                      <div className="grid grid-cols-2 gap-2">
                        <Input label={t.form.zip} name="zip" type="text" value={form.zip} onChange={handleFormChange} autoComplete="postal-code" placeholder={t.form.phZip} />
                        <Input label={t.form.city} name="city" type="text" value={form.city} onChange={handleFormChange} autoComplete="address-level2" placeholder={t.form.phCity} />
                      </div>
                      <Input label={t.form.country} name="country" type="text" value={form.country} onChange={handleFormChange} autoComplete="country-name" placeholder={t.form.phCountry} />
                    </div>
                  )}
                  <div>
                    <label className="block font-body text-xs font-medium text-forest-700 mb-1">{t.form.messageShort} <span className="text-forest-400 font-normal">{t.form.optional}</span></label>
                    <textarea name="message" value={form.message} onChange={handleFormChange} rows={2} placeholder={t.form.phMessageShort} className="w-full rounded-xl border border-cream-300 px-3.5 py-2.5 font-body text-sm text-forest-900 bg-white placeholder:text-forest-300 focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none" />
                  </div>
                  {priceBreakdown && (
                    <div>
                      <p className="font-body text-xs font-medium text-forest-700 uppercase tracking-wider mb-2">{t.form.paymentHeading}</p>
                      <div className="space-y-2">
                        {([
                          { value: "50" as PaymentOption, label: t.form.deposit50Label, sub: t.form.subNow(Math.round(priceBreakdown.total * 0.5).toLocaleString(nf)) },
                          { value: "100" as PaymentOption, label: t.form.full100Label, sub: t.form.subNow(priceBreakdown.total.toLocaleString(nf)) },
                        ] as const).map((opt) => (
                          <button key={opt.value} type="button" onClick={() => setPaymentOption(opt.value)}
                            className={["flex items-center gap-3 w-full rounded-xl border px-3 py-2.5 text-left transition-colors", paymentOption === opt.value ? "border-forest-700 bg-forest-50" : "border-cream-300"].join(" ")}>
                            <span className={["w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center", paymentOption === opt.value ? "border-forest-700" : "border-cream-400"].join(" ")}>
                              {paymentOption === opt.value && <span className="w-2 h-2 rounded-full bg-forest-700" />}
                            </span>
                            <div>
                              <p className="font-body text-sm font-semibold text-forest-900">{opt.label}</p>
                              <p className="font-body text-xs text-forest-500">{opt.sub}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xs font-body text-forest-400 leading-relaxed">
                    {t.form.legalSidebar.pre}
                    <Link href={localizeHref("/datenschutz", locale)} className="underline">{t.form.legalSidebar.privacy}</Link>
                    {t.form.legalSidebar.mid}
                    <Link href={localizeHref("/stornierung", locale)} className="underline">{t.form.legalSidebar.cancellation}</Link>
                    {t.form.legalSidebar.post}
                  </p>
                  <Turnstile
                    siteKey={TURNSTILE_SITE_KEY}
                    options={{ appearance: "interaction-only", size: "flexible", language: locale }}
                    onSuccess={(token) => { turnstileToken.current = token; setTurnstileReady(true) }}
                    onExpire={() => { turnstileToken.current = ""; setTurnstileReady(false) }}
                  />
                  {errorMsg && (
                    <p className="font-body text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{errorMsg}</p>
                  )}
                  <button type="submit" disabled={submitting || !turnstileReady}
                    className="w-full py-3.5 rounded-xl bg-forest-800 text-cream-50 font-body font-semibold text-sm hover:bg-forest-700 disabled:opacity-60 transition-colors shadow-md flex items-center justify-center gap-2">
                    {submitting ? <><span className="w-4 h-4 border-2 border-cream-50/40 border-t-cream-50 rounded-full animate-spin" />{t.form.preparing}</> : !turnstileReady ? t.form.securityRunning : t.form.continueToPaymentArrow}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment step */}
        {step === "payment" && stripeClientSecret && priceBreakdown && (
          <div className="border-t border-cream-100 px-5 py-4">
            <PaymentStep
              clientSecret={stripeClientSecret}
              depositAmount={depositAmount}
              totalAmount={priceBreakdown.total}
              checkIn={checkIn}
              checkOut={checkOut}
              propertyName={propertyName}
              guests={guests}
              paymentOption={paymentOption}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onBack={() => setStep("form")}
            />
          </div>
        )}

        {/* Trust badges */}
        {step === "dates" && (
          <div className="px-5 pb-5 pt-1 border-t border-cream-100 space-y-2">
            {t.sidebarTrust.map((b, i) => (
              <div key={b.title} className="flex items-center gap-2.5">
                <span className="text-base">{["🔒", "💰"][i]}</span>
                <div>
                  <span className="font-body text-xs font-semibold text-forest-800">{b.title} · </span>
                  <span className="font-body text-xs text-forest-400">{b.text}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // MAIN BOOKING UI
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div ref={widgetRef} className="min-h-screen bg-cream-50 pb-28 lg:pb-0 overflow-x-hidden">
      {/* ── Two-column layout ── */}
      <div className="container-site py-8 lg:py-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-14 items-start">

          {/* ══ LEFT: Calendar / Form ══════════════════════════════════════ */}
          <div className="lg:col-span-7 xl:col-span-7">
            <AnimatePresence mode="wait">

              {/* ── DATES STEP ── */}
              {step === "dates" && (
                <motion.div
                  key="dates"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Loading skeleton */}
                  {loadingAvailability && (
                    <div className="flex items-center gap-2 mb-4 text-xs font-body text-forest-400">
                      <span className="w-3 h-3 border-2 border-forest-300 border-t-forest-700 rounded-full animate-spin" />
                      {t.widget.loadingAvailabilityLong}
                    </div>
                  )}

                  <BookingCalendar
                    blockedDates={blockedDates}
                    minStayMap={minStayMap}
                    defaultMinStay={minStay}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    selectionStep={selectionStep}
                    onDateClick={handleDateClick}
                    onReset={handleReset}
                    priceMap={priceMap}
                  />

                  {/* Mobile controls below calendar */}
                  <div className="mt-6 lg:hidden space-y-3">

                    {/* Guest counter – only inline when fixed bar is hidden (multi-widget page) */}
                    {hideMobileBar && (
                      <div className="flex items-center justify-between bg-cream-100 rounded-2xl px-4 py-3">
                        <span className="font-body text-sm text-forest-700">{t.labels.guests}</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setGuests((g) => Math.max(1, g - 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-forest-300 text-forest-700 hover:bg-forest-100 transition-colors"
                            aria-label={t.labels.ariaFewerGuests}
                          >
                            <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                          </button>
                          <span className="font-body text-base font-semibold text-forest-900 w-5 text-center">{guests}</span>
                          <button
                            type="button"
                            onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-forest-300 text-forest-700 hover:bg-forest-100 transition-colors"
                            aria-label={t.labels.ariaMoreGuests}
                          >
                            <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Price breakdown – visible once dates are selected */}
                    {checkIn && checkOut && priceBreakdown && (
                      <div className="bg-white rounded-2xl border border-cream-200 px-4 py-3 space-y-1.5">
                        <div className="flex justify-between font-body text-sm text-forest-700">
                          <span>{priceBreakdown.avgNightly} € × {priceBreakdown.nights} {t.labels.nightsPlural}</span>
                          <span>{priceBreakdown.nightlyTotal} €</span>
                        </div>
                        {priceBreakdown.extraGuests > 0 && (
                          <div className="flex justify-between font-body text-sm text-gold-700">
                            <span>{t.widget.extraPersShort(priceBreakdown.extraGuests)} × {extraPersonFee} € × {priceBreakdown.nights} {t.labels.nightsPlural}</span>
                            <span>+{priceBreakdown.extraPersonTotal} €</span>
                          </div>
                        )}
                        <div className="flex justify-between font-body text-sm text-forest-700">
                          <span>{t.labels.cleaningShort}</span>
                          <span>{priceBreakdown.cleaningFee} €</span>
                        </div>
                        <div className="flex justify-between font-body text-sm font-bold text-forest-900 pt-1.5 border-t border-cream-200">
                          <span>{t.labels.total}</span>
                          <span>{priceBreakdown.total.toLocaleString(nf)} €</span>
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    {checkIn && checkOut && (
                      <button
                        onClick={() => setStep("form")}
                        className="w-full py-4 rounded-2xl bg-forest-800 text-cream-50 font-body font-semibold text-base hover:bg-forest-700 transition-colors shadow-lg"
                      >
                        {t.widget.continueToBooking}
                      </button>
                    )}
                  </div>

                  <TrustBadges />
                </motion.div>
              )}

              {/* ── FORM STEP ── */}
              {step === "form" && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Back button */}
                  <button
                    type="button"
                    onClick={() => setStep("dates")}
                    className="mb-6 flex items-center gap-2 text-sm font-body text-forest-600 hover:text-forest-900 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t.form.backToCalendar}
                  </button>

                  <h2 className="font-display text-2xl text-forest-900 mb-6">
                    {t.form.yourDetails}
                  </h2>

                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {/* Name row */}
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label={t.form.firstName}
                        name="firstName"
                        type="text"
                        value={form.firstName}
                        onChange={handleFormChange}
                        error={formErrors.firstName}
                        required
                        autoComplete="given-name"
                        placeholder={t.form.phFirstName}
                      />
                      <Input
                        label={t.form.lastName}
                        name="lastName"
                        type="text"
                        value={form.lastName}
                        onChange={handleFormChange}
                        error={formErrors.lastName}
                        required
                        autoComplete="family-name"
                        placeholder={t.form.phLastName}
                      />
                    </div>

                    <Input
                      label={t.form.emailFull}
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleFormChange}
                      error={formErrors.email}
                      required
                      autoComplete="email"
                      placeholder={t.form.phEmail}
                    />

                    <Input
                      label={t.form.phoneFull}
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleFormChange}
                      error={formErrors.phone}
                      required
                      autoComplete="tel"
                      placeholder={t.form.phPhone}
                    />

                    {/* Business booking toggle */}
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="isBusinessBooking"
                        checked={form.isBusinessBooking}
                        onChange={handleFormChange}
                        className="w-4 h-4 rounded border-cream-300 text-forest-700 accent-forest-700 cursor-pointer"
                      />
                      <span className="font-body text-sm text-forest-700">{t.form.businessToggle}</span>
                    </label>

                    {/* Company fields */}
                    {form.isBusinessBooking && (
                      <div className="space-y-3 rounded-xl border border-cream-200 bg-cream-50 p-4">
                        <p className="font-body text-xs font-medium text-forest-500 uppercase tracking-wider">{t.form.billingHeading}</p>
                        <Input
                          label={t.form.company}
                          name="company"
                          type="text"
                          value={form.company}
                          onChange={handleFormChange}
                          autoComplete="organization"
                          placeholder={t.form.phCompany}
                        />
                        <Input
                          label={t.form.vatId}
                          name="vatId"
                          type="text"
                          value={form.vatId}
                          onChange={handleFormChange}
                          autoComplete="off"
                          placeholder={t.form.phVatId}
                        />
                        <Input
                          label={t.form.street}
                          name="street"
                          type="text"
                          value={form.street}
                          onChange={handleFormChange}
                          autoComplete="street-address"
                          placeholder={t.form.phStreet}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            label={t.form.zip}
                            name="zip"
                            type="text"
                            value={form.zip}
                            onChange={handleFormChange}
                            autoComplete="postal-code"
                            placeholder={t.form.phZip}
                          />
                          <Input
                            label={t.form.city}
                            name="city"
                            type="text"
                            value={form.city}
                            onChange={handleFormChange}
                            autoComplete="address-level2"
                            placeholder={t.form.phCity}
                          />
                        </div>
                        <Input
                          label={t.form.country}
                          name="country"
                          type="text"
                          value={form.country}
                          onChange={handleFormChange}
                          autoComplete="country-name"
                          placeholder={t.form.phCountry}
                        />
                      </div>
                    )}

                    {/* Optional message */}
                    <div>
                      <label className="block font-body text-xs font-medium text-forest-700 mb-1">
                        {t.form.messageFull}{" "}
                        <span className="text-forest-400 font-normal">{t.form.optional}</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleFormChange}
                        rows={3}
                        placeholder={t.form.phMessageFull}
                        className="w-full rounded-xl border border-cream-300 px-3.5 py-2.5 font-body text-sm text-forest-900 bg-white placeholder:text-forest-300 transition-colors hover:border-forest-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Zahlungsoption */}
                    {priceBreakdown && (
                      <div>
                        <p className="font-body text-xs font-medium text-forest-700 uppercase tracking-wider mb-2">
                          {t.form.paymentOptionHeading}
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {([
                            {
                              value: "50" as PaymentOption,
                              label: t.form.deposit50Label,
                              sub: t.form.subDeposit(Math.round(priceBreakdown.total * 0.5).toLocaleString(nf)),
                            },
                            {
                              value: "100" as PaymentOption,
                              label: t.form.full100Label,
                              sub: t.form.subFull(priceBreakdown.total.toLocaleString(nf)),
                            },
                          ] as const).map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setPaymentOption(opt.value)}
                              className={[
                                "flex items-start gap-3 w-full rounded-xl border px-4 py-3 text-left transition-colors",
                                paymentOption === opt.value
                                  ? "border-forest-700 bg-forest-50"
                                  : "border-cream-300 hover:border-forest-300",
                              ].join(" ")}
                            >
                              <span className={[
                                "mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                                paymentOption === opt.value
                                  ? "border-forest-700"
                                  : "border-cream-400",
                              ].join(" ")}>
                                {paymentOption === opt.value && (
                                  <span className="w-2 h-2 rounded-full bg-forest-700" />
                                )}
                              </span>
                              <div>
                                <p className="font-body text-sm font-semibold text-forest-900">{opt.label}</p>
                                <p className="font-body text-xs text-forest-500 mt-0.5">{opt.sub}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* DSGVO note */}
                    <p className="text-xs font-body text-forest-400 leading-relaxed">
                      {t.form.legalFull.pre}
                      <Link href={localizeHref("/datenschutz", locale)} className="underline hover:text-forest-700">
                        {t.form.legalFull.privacy}
                      </Link>
                      {t.form.legalFull.mid}
                      <Link href={localizeHref("/stornierung", locale)} className="underline hover:text-forest-700">
                        {t.form.legalFull.cancellation}
                      </Link>
                      {t.form.legalFull.post}
                    </p>

                    {/* Bot-Schutz (Cloudflare Turnstile) – unsichtbar, sofern keine Interaktion nötig */}
                    <Turnstile
                      siteKey={TURNSTILE_SITE_KEY}
                      options={{ appearance: "interaction-only", size: "flexible", language: locale }}
                      onSuccess={(token) => { turnstileToken.current = token; setTurnstileReady(true) }}
                      onExpire={() => { turnstileToken.current = ""; setTurnstileReady(false) }}
                    />

                    {errorMsg && (
                      <p className="font-body text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{errorMsg}</p>
                    )}

                    {/* Submit → goes to payment step */}
                    <button
                      type="submit"
                      disabled={submitting || !turnstileReady}
                      className="w-full py-4 rounded-2xl bg-forest-800 text-cream-50 font-body font-semibold text-base hover:bg-forest-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-3"
                    >
                      {submitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-cream-50/40 border-t-cream-50 rounded-full animate-spin" />
                          {t.form.preparing}
                        </>
                      ) : !turnstileReady ? (
                        t.form.securityRunning
                      ) : (
                        <>
                          {t.form.continueToPayment}
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                            <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ── PAYMENT STEP ── */}
              {step === "payment" && stripeClientSecret && priceBreakdown && (
                <PaymentStep
                  clientSecret={stripeClientSecret}
                  depositAmount={depositAmount}
                  totalAmount={priceBreakdown.total}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  propertyName={propertyName}
                  guests={guests}
                  paymentOption={paymentOption}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onBack={() => setStep("form")}
                />
              )}

            </AnimatePresence>
          </div>

          {/* ══ RIGHT: Sticky Booking Panel ═══════════════════════════════ */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-5">
            <div className="sticky top-24">
              <StickyPanel
                propertyName={propertyName}
                priceFrom={effectivePrice}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
                maxGuests={maxGuests}
                showGuestDropdown={showGuestDropdown}
                setShowGuestDropdown={setShowGuestDropdown}
                setGuests={setGuests}
                priceBreakdown={priceBreakdown}
                extraPersonFee={extraPersonFee}
                step={step}
                onContinue={() => setStep("form")}
                onReset={handleReset}
                selectionStep={selectionStep}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ══ MOBILE FIXED BOTTOM BAR ══════════════════════════════════════════ */}
      {!hideMobileBar && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-cream-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-30">
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Price / date info */}
            <div className="flex-1 min-w-0">
              {priceBreakdown ? (
                <>
                  <p className="font-body text-sm font-bold text-forest-900 leading-tight">
                    {priceBreakdown.total.toLocaleString(nf)} €{" "}
                    <span className="font-normal text-forest-500">{t.widget.totalWord}</span>
                  </p>
                  <p className="font-body text-xs text-forest-500 truncate">
                    {fmtShort(checkIn!, locale)} – {fmtShort(checkOut!, locale)}{" · "}
                    {priceBreakdown.nights} {t.labels.nightsPlural}
                    {priceBreakdown.extraGuests > 0 && (
                      <span className="text-gold-600">
                        {" · "}{t.widget.extraPersShort(priceBreakdown.extraGuests)}
                      </span>
                    )}
                  </p>
                </>
              ) : checkIn ? (
                <>
                  <p className="font-body text-sm font-bold text-forest-900 leading-tight">
                    {t.widget.fromPerNightBar(effectivePrice)}
                  </p>
                  <p className="font-body text-xs text-forest-500">{t.widget.chooseDeparture}</p>
                </>
              ) : (
                <>
                  <p className="font-body text-sm font-bold text-forest-900 leading-tight">
                    {t.widget.fromPerNightBar(effectivePrice)}
                  </p>
                  <p className="font-body text-xs text-forest-500">{t.labels.chooseDate}</p>
                </>
              )}
            </div>

            {/* CTA */}
            {step === "dates" ? (
              <button
                onClick={() => checkIn && checkOut && setStep("form")}
                disabled={!checkIn || !checkOut}
                className="flex-shrink-0 px-5 py-3 rounded-xl bg-forest-800 text-cream-50 font-body font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-forest-700 transition-colors"
              >
                {checkIn && checkOut ? t.widget.continueShort : t.labels.chooseDate}
              </button>
            ) : step === "form" ? (
              <button
                onClick={() => document.querySelector<HTMLButtonElement>('button[type="submit"]')?.click()}
                disabled={submitting}
                className="flex-shrink-0 px-5 py-3 rounded-xl bg-forest-800 text-cream-50 font-body font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-forest-700 transition-colors"
              >
                {submitting ? "…" : t.widget.bookShort}
              </button>
            ) : null}

            {/* Guest counter (compact) */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-body text-[10px] text-forest-400 leading-none">{t.labels.guests}</span>
              <div className="flex items-center gap-1 bg-cream-100 rounded-lg px-2 py-1.5">
                <button
                  type="button"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  disabled={step === "payment"}
                  className="w-6 h-6 flex items-center justify-center text-forest-600 hover:text-forest-900 disabled:opacity-30"
                  aria-label={t.labels.ariaFewerGuests}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
                <span className="font-body text-sm font-medium text-forest-800 w-4 text-center">{guests}</span>
                <button
                  type="button"
                  onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
                  disabled={step === "payment"}
                  className="w-6 h-6 flex items-center justify-center text-forest-600 hover:text-forest-900 disabled:opacity-30"
                  aria-label={t.labels.ariaMoreGuests}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sticky Panel (desktop right column) ─────────────────────────────────────

interface StickyPanelProps {
  propertyName: string
  priceFrom: number
  checkIn: Date | null
  checkOut: Date | null
  guests: number
  maxGuests: number
  showGuestDropdown: boolean
  setShowGuestDropdown: (v: boolean) => void
  setGuests: (n: number) => void
  priceBreakdown: PriceBreakdown | null
  extraPersonFee: number
  step: Step
  onContinue: () => void
  onReset: () => void
  selectionStep: SelectionStep
}

function StickyPanel({
  priceFrom,
  checkIn,
  checkOut,
  guests,
  maxGuests,
  showGuestDropdown,
  setShowGuestDropdown,
  setGuests,
  priceBreakdown,
  extraPersonFee,
  step,
  onContinue,
  onReset,
  selectionStep,
}: StickyPanelProps) {
  const datesSelected = checkIn && checkOut
  const locale = useLocale()
  const t = getDict(locale).booking
  const nf = numLocale(locale)

  return (
    <div className="rounded-2xl border border-cream-200 shadow-card-lg bg-white overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-cream-100">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="font-display text-2xl text-forest-900">
              {t.widget.fromPrice(priceFrom)}
            </span>
            <span className="font-body text-sm text-forest-400 ml-1">{t.labels.perNight}</span>
          </div>
          {datesSelected && (
            <button
              onClick={onReset}
              className="text-xs font-body text-forest-400 underline hover:text-forest-700 transition-colors"
            >
              {t.labels.reset}
            </button>
          )}
        </div>
      </div>

      <div className="p-5 space-y-3">
        {/* Date boxes */}
        <div className="grid grid-cols-2 gap-2">
          <div
            role="button"
            tabIndex={0}
            aria-label={t.widget.ariaResetCheckin}
            className={[
              "rounded-xl border p-3 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-forest-500",
              selectionStep === "checkin" && !checkIn
                ? "border-forest-700 bg-forest-50"
                : "border-cream-200 hover:border-forest-300",
            ].join(" ")}
            onClick={() => onReset()}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onReset(); } }}
          >
            <p className="font-body text-[10px] text-forest-400 uppercase tracking-wider mb-0.5">
              {t.labels.arrival}
            </p>
            <p className={`font-body text-sm ${checkIn ? "text-forest-900 font-medium" : "text-forest-400"}`}>
              {checkIn ? fmtShort(checkIn, locale) : t.labels.select}
            </p>
          </div>
          <div
            className={[
              "rounded-xl border p-3 transition-colors",
              selectionStep === "checkout" && checkIn
                ? "border-forest-700 bg-forest-50"
                : "border-cream-200",
            ].join(" ")}
          >
            <p className="font-body text-[10px] text-forest-400 uppercase tracking-wider mb-0.5">
              {t.labels.departure}
            </p>
            <p className={`font-body text-sm ${checkOut ? "text-forest-900 font-medium" : "text-forest-400"}`}>
              {checkOut ? fmtShort(checkOut, locale) : checkIn ? t.labels.select : "–"}
            </p>
          </div>
        </div>

        {/* Guest selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowGuestDropdown(!showGuestDropdown)}
            className="w-full rounded-xl border border-cream-200 hover:border-forest-300 p-3 flex items-center justify-between transition-colors"
          >
            <div className="text-left">
              <p className="font-body text-[10px] text-forest-400 uppercase tracking-wider mb-0.5">{t.labels.guests}</p>
              <p className="font-body text-sm text-forest-900 font-medium">{t.labels.guestCount(guests)}</p>
            </div>
            <svg
              className={`w-4 h-4 text-forest-500 transition-transform ${showGuestDropdown ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 16 16"
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <AnimatePresence>
            {showGuestDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-cream-200 shadow-card-lg p-4 z-20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body text-sm font-medium text-forest-800">{t.labels.guests}</p>
                    <p className="font-body text-xs text-forest-400">{t.labels.maxPersons(maxGuests)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={t.labels.ariaFewerGuests}
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1 || step === "payment"}
                      className="w-8 h-8 rounded-full border border-cream-300 flex items-center justify-center text-forest-600 hover:border-forest-500 transition-colors disabled:opacity-30"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </button>
                    <span className="font-body text-base font-semibold text-forest-900 w-4 text-center">{guests}</span>
                    <button
                      type="button"
                      aria-label={t.labels.ariaMoreGuests}
                      onClick={() => setGuests(Math.min(maxGuests, guests + 1))}
                      disabled={guests >= maxGuests || step === "payment"}
                      className="w-8 h-8 rounded-full border border-cream-300 flex items-center justify-center text-forest-600 hover:border-forest-500 transition-colors disabled:opacity-30"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGuestDropdown(false)}
                  className="mt-3 text-xs font-body text-forest-500 underline hover:text-forest-800 w-full text-right"
                >
                  {t.labels.close}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA Button */}
        {step === "dates" ? (
          <button
            onClick={onContinue}
            disabled={!datesSelected}
            className="w-full py-3.5 rounded-xl bg-forest-800 text-cream-50 font-body font-semibold text-sm hover:bg-forest-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {datesSelected ? t.widget.continueToBooking : t.widget.chooseDateInCalendar}
          </button>
        ) : (
          <div className="rounded-xl bg-forest-50 border border-forest-100 px-4 py-3">
            <p className="font-body text-xs text-forest-600">
              {step === "payment" ? t.widget.paymentHint : t.widget.formHint}
            </p>
          </div>
        )}

        {/* Price breakdown (appears only when dates selected) */}
        <AnimatePresence>
          {priceBreakdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-cream-100 pt-3 space-y-2">
                <div className="flex justify-between font-body text-sm text-forest-600">
                  <span>
                    {priceBreakdown.avgNightly.toLocaleString(nf)} € × {priceBreakdown.nights}{" "}
                    {t.labels.nightWord(priceBreakdown.nights)}
                  </span>
                  <span>{priceBreakdown.nightlyTotal.toLocaleString(nf)} €</span>
                </div>
                {priceBreakdown.extraPersonTotal > 0 && (
                  <div className="flex justify-between font-body text-sm text-forest-600">
                    <span>
                      {t.labels.extraPersonFee} ({priceBreakdown.extraGuests} {t.labels.personWord(priceBreakdown.extraGuests)} × {extraPersonFee} € × {priceBreakdown.nights} {t.labels.nightWord(priceBreakdown.nights)})
                    </span>
                    <span>{priceBreakdown.extraPersonTotal.toLocaleString(nf)} €</span>
                  </div>
                )}
                <div className="flex justify-between font-body text-sm text-forest-600">
                  <span>{t.labels.cleaningFee}</span>
                  <span>{priceBreakdown.cleaningFee.toLocaleString(nf)} €</span>
                </div>
                <div className="flex justify-between font-body text-sm font-bold text-forest-900 border-t border-cream-200 pt-2">
                  <span>{t.labels.total}</span>
                  <span>{priceBreakdown.total.toLocaleString(nf)} €</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust note – nur außerhalb des Zahlungsschritts anzeigen */}
        {step !== "payment" && (
          <p className="text-center font-body text-xs text-forest-400">
            {t.labels.notCharged}
          </p>
        )}
      </div>
    </div>
  )
}
