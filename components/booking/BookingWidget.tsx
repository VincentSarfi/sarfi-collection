"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import BookingCalendar, { toDateKey, fmtShort, fmtLong, type SelectionStep } from "./BookingCalendar"
import PaymentStep from "./PaymentStep"
import type { AvailabilityMap } from "@/lib/smoobu"
import type { NightRate } from "@/lib/pricelabs"

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
}

type Step = "dates" | "form" | "payment" | "confirmed" | "error"
type PaymentOption = "50" | "100"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
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

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.firstName.trim()) errors.firstName = "Vorname erforderlich"
  if (!data.lastName.trim()) errors.lastName = "Nachname erforderlich"
  if (!data.email.trim()) {
    errors.email = "E-Mail erforderlich"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Ungültige E-Mail-Adresse"
  }
  if (!data.phone.trim()) errors.phone = "Telefonnummer erforderlich"
  return errors
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TrustBadges() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
      {[
        { emoji: "🔒", title: "Sichere Buchung", text: "SSL-verschlüsselt" },
        { emoji: "💬", title: "Persönliche Betreuung", text: "Direkt vom Gastgeber" },
        { emoji: "💰", title: "Keine Gebühren", text: "Günstiger als Portale" },
      ].map((b) => (
        <div
          key={b.title}
          className="flex items-center gap-3 p-3 rounded-xl bg-cream-50 border border-cream-200"
        >
          <span className="text-xl">{b.emoji}</span>
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
}: BookingWidgetProps) {
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

  const [availabilityMap, setAvailabilityMap] = useState<AvailabilityMap>({})
  const [loadingAvailability, setLoadingAvailability] = useState(true)

  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [bookingId, setBookingId] = useState<number | null>(null)
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

  // Effective display price: PriceLabs recommended_base_price if available, else priceFrom
  const effectivePrice = useMemo(() => {
    const first = Object.values(plPriceMap)[0]
    return first && first.price > 0 ? first.price : priceFrom
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
          // Clicked before or on checkIn → restart
          setCheckIn(date)
          setCheckOut(null)
          setSelectionStep("checkout")
        } else {
          setCheckOut(date)
          setSelectionStep("checkin") // selection complete
        }
      }
    },
    [selectionStep, checkIn],
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
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // Step 2 → Step 3: validate form, create Stripe PaymentIntent
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkIn || !checkOut || !priceBreakdown) return

    const errors = validateForm(form)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
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
          totalPrice: priceBreakdown.total,
          paymentOption,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? "Fehler beim Zahlungsvorgang. Bitte versuche es erneut.")
        setStep("error")
      } else {
        setStripeClientSecret(data.clientSecret)
        setDepositAmount(data.depositAmount)
        setStep("payment")
        scrollToWidget()
      }
    } catch {
      setErrorMsg("Verbindungsfehler. Bitte überprüfe deine Internetverbindung.")
      setStep("error")
    } finally {
      setSubmitting(false)
    }
  }

  // Step 3 → Step 4: payment succeeded → create Smoobu booking
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!checkIn || !checkOut || !priceBreakdown) return

    try {
      const res = await fetch("/api/smoobu/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apartmentId: smoobuId,
          checkIn: toDateKey(checkIn),
          checkOut: toDateKey(checkOut),
          guests,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          message: form.message.trim() || undefined,
          totalPrice: priceBreakdown.total,
          paymentIntentId,
        }),
      })
      const data = await res.json()
      if (res.ok) setBookingId(data.id)
    } catch (err) {
      console.error('[booking] Client-side Smoobu booking failed (webhook will retry):', err)
    }

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
      ? `${fmtShort(checkIn)} – ${fmtShort(checkOut)}`
      : checkIn
        ? `${fmtShort(checkIn)} → …`
        : "Datum wählen"

  // ══════════════════════════════════════════════════════════════════════════
  // CONFIRMED SCREEN
  // ══════════════════════════════════════════════════════════════════════════
  if (step === "confirmed") {
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
            Buchung eingegangen!
          </h2>
          <p className="font-body text-forest-600 mb-6">
            Vielen Dank, <strong>{form.firstName}</strong>! Deine Buchungsanfrage für{" "}
            <strong>{propertyName}</strong> wurde übermittelt. Du erhältst in Kürze eine
            Bestätigung per E-Mail an <strong>{form.email}</strong>.
          </p>
          {!bookingId && (
            <p className="font-body text-xs text-forest-400 mb-4 bg-cream-100 rounded-xl px-4 py-3">
              Deine Buchung wird gerade verarbeitet. Falls du innerhalb von 10 Minuten keine E-Mail erhältst, melde dich bitte direkt bei uns.
            </p>
          )}

          {/* Summary card */}
          <div className="bg-cream-50 rounded-2xl border border-cream-200 p-5 text-left mb-6">
            <p className="font-body text-xs text-forest-500 uppercase tracking-wider mb-3">
              Buchungsdetails
            </p>
            <div className="space-y-2">
              <div className="flex justify-between font-body text-sm">
                <span className="text-forest-500">Unterkunft</span>
                <span className="font-medium text-forest-900">{propertyName}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-forest-500">Anreise</span>
                <span className="font-medium text-forest-900">{checkIn ? fmtLong(checkIn) : "–"}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-forest-500">Abreise</span>
                <span className="font-medium text-forest-900">{checkOut ? fmtLong(checkOut) : "–"}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-forest-500">Gäste</span>
                <span className="font-medium text-forest-900">{guests}</span>
              </div>
              {priceBreakdown && (
                <div className="flex justify-between font-body text-sm border-t border-cream-200 pt-2 mt-2">
                  <span className="font-semibold text-forest-800">Gesamtpreis</span>
                  <span className="font-bold text-forest-900">{priceBreakdown.total.toLocaleString("de-DE")} €</span>
                </div>
              )}
              {bookingId && (
                <div className="flex justify-between font-body text-xs pt-1">
                  <span className="text-forest-400">Buchungs-ID</span>
                  <span className="text-forest-500 font-mono">#{bookingId}</span>
                </div>
              )}
            </div>
          </div>

          <Link
            href={propertyHref}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-800 text-cream-50 font-body text-sm font-medium hover:bg-forest-700 transition-colors"
          >
            ← Zurück zur Unterkunft
          </Link>
        </motion.div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ERROR SCREEN
  // ══════════════════════════════════════════════════════════════════════════
  if (step === "error") {
    return (
      <div className="min-h-[40vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="font-display text-2xl text-forest-900 mb-2">Fehler bei der Buchung</h2>
          <p className="font-body text-forest-600 mb-6">{errorMsg}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { setStep("form"); setErrorMsg(null) }}
              className="px-6 py-3 rounded-full bg-forest-800 text-cream-50 font-body text-sm font-medium hover:bg-forest-700 transition-colors"
            >
              Erneut versuchen
            </button>
            <Link
              href="/kontakt"
              className="px-6 py-3 rounded-full border border-forest-300 text-forest-700 font-body text-sm font-medium hover:bg-cream-100 transition-colors"
            >
              Kontakt aufnehmen
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // MAIN BOOKING UI
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div ref={widgetRef} className="min-h-screen bg-cream-50 pb-28 lg:pb-0">
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
                      Verfügbarkeiten werden geladen…
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
                        <span className="font-body text-sm text-forest-700">Gäste</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setGuests((g) => Math.max(1, g - 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-forest-300 text-forest-700 hover:bg-forest-100 transition-colors"
                            aria-label="Weniger Gäste"
                          >
                            <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                          </button>
                          <span className="font-body text-base font-semibold text-forest-900 w-5 text-center">{guests}</span>
                          <button
                            type="button"
                            onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-forest-300 text-forest-700 hover:bg-forest-100 transition-colors"
                            aria-label="Mehr Gäste"
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
                          <span>{priceBreakdown.avgNightly} € × {priceBreakdown.nights} Nächte</span>
                          <span>{priceBreakdown.nightlyTotal} €</span>
                        </div>
                        {priceBreakdown.extraGuests > 0 && (
                          <div className="flex justify-between font-body text-sm text-gold-700">
                            <span>+{priceBreakdown.extraGuests} Pers. × {extraPersonFee} € × {priceBreakdown.nights} Nächte</span>
                            <span>+{priceBreakdown.extraPersonTotal} €</span>
                          </div>
                        )}
                        <div className="flex justify-between font-body text-sm text-forest-700">
                          <span>Reinigung</span>
                          <span>{priceBreakdown.cleaningFee} €</span>
                        </div>
                        <div className="flex justify-between font-body text-sm font-bold text-forest-900 pt-1.5 border-t border-cream-200">
                          <span>Gesamt</span>
                          <span>{priceBreakdown.total.toLocaleString("de-DE")} €</span>
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    {checkIn && checkOut && (
                      <button
                        onClick={() => setStep("form")}
                        className="w-full py-4 rounded-2xl bg-forest-800 text-cream-50 font-body font-semibold text-base hover:bg-forest-700 transition-colors shadow-lg"
                      >
                        Weiter zur Buchung →
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
                    Zurück zum Kalender
                  </button>

                  <h2 className="font-display text-2xl text-forest-900 mb-6">
                    Deine Angaben
                  </h2>

                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {/* Name row */}
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Vorname"
                        name="firstName"
                        type="text"
                        value={form.firstName}
                        onChange={handleFormChange}
                        error={formErrors.firstName}
                        required
                        autoComplete="given-name"
                        placeholder="Max"
                      />
                      <Input
                        label="Nachname"
                        name="lastName"
                        type="text"
                        value={form.lastName}
                        onChange={handleFormChange}
                        error={formErrors.lastName}
                        required
                        autoComplete="family-name"
                        placeholder="Mustermann"
                      />
                    </div>

                    <Input
                      label="E-Mail-Adresse"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleFormChange}
                      error={formErrors.email}
                      required
                      autoComplete="email"
                      placeholder="max@beispiel.de"
                    />

                    <Input
                      label="Telefonnummer"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleFormChange}
                      error={formErrors.phone}
                      required
                      autoComplete="tel"
                      placeholder="+49 123 456789"
                    />

                    {/* Optional message */}
                    <div>
                      <label className="block font-body text-xs font-medium text-forest-700 mb-1">
                        Nachricht an den Gastgeber{" "}
                        <span className="text-forest-400 font-normal">(optional)</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleFormChange}
                        rows={3}
                        placeholder="Besondere Wünsche, Anreisezeit, …"
                        className="w-full rounded-xl border border-cream-300 px-3.5 py-2.5 font-body text-sm text-forest-900 bg-white placeholder:text-forest-300 transition-colors hover:border-forest-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Zahlungsoption */}
                    {priceBreakdown && (
                      <div>
                        <p className="font-body text-xs font-medium text-forest-700 uppercase tracking-wider mb-2">
                          Zahlungsoption
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {([
                            {
                              value: "50" as PaymentOption,
                              label: "50% Anzahlung",
                              sub: `${Math.round(priceBreakdown.total * 0.5).toLocaleString("de-DE")} € jetzt · Rest 14 Tage vor Anreise`,
                            },
                            {
                              value: "100" as PaymentOption,
                              label: "100% Vollzahlung",
                              sub: `${priceBreakdown.total.toLocaleString("de-DE")} € jetzt · Keine weiteren Zahlungen`,
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
                      Mit deiner Buchung stimmst du unseren{" "}
                      <Link href="/datenschutz" className="underline hover:text-forest-700">
                        Datenschutzhinweisen
                      </Link>{" "}
                      zu. Deine Daten werden ausschließlich zur Buchungsabwicklung verwendet.
                    </p>

                    {/* Submit → goes to payment step */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-2xl bg-forest-800 text-cream-50 font-body font-semibold text-base hover:bg-forest-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-3"
                    >
                      {submitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-cream-50/40 border-t-cream-50 rounded-full animate-spin" />
                          Wird vorbereitet…
                        </>
                      ) : (
                        <>
                          Weiter zur Zahlung
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
                    {priceBreakdown.total.toLocaleString("de-DE")} €{" "}
                    <span className="font-normal text-forest-500">gesamt</span>
                  </p>
                  <p className="font-body text-xs text-forest-500 truncate">
                    {fmtShort(checkIn!)} – {fmtShort(checkOut!)}{" · "}
                    {priceBreakdown.nights} Nächte
                    {priceBreakdown.extraGuests > 0 && (
                      <span className="text-gold-600">
                        {" · "}+{priceBreakdown.extraGuests} Pers.
                      </span>
                    )}
                  </p>
                </>
              ) : checkIn ? (
                <>
                  <p className="font-body text-sm font-bold text-forest-900 leading-tight">
                    Ab {effectivePrice} € / Nacht
                  </p>
                  <p className="font-body text-xs text-forest-500">Abreise wählen</p>
                </>
              ) : (
                <>
                  <p className="font-body text-sm font-bold text-forest-900 leading-tight">
                    Ab {effectivePrice} € / Nacht
                  </p>
                  <p className="font-body text-xs text-forest-500">Datum wählen</p>
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
                {checkIn && checkOut ? "Weiter →" : "Datum wählen"}
              </button>
            ) : step === "form" ? (
              <button
                onClick={() => document.querySelector<HTMLButtonElement>('button[type="submit"]')?.click()}
                disabled={submitting}
                className="flex-shrink-0 px-5 py-3 rounded-xl bg-forest-800 text-cream-50 font-body font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-forest-700 transition-colors"
              >
                {submitting ? "…" : "Buchen"}
              </button>
            ) : null}

            {/* Guest counter (compact) */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-body text-[10px] text-forest-400 leading-none">Gäste</span>
              <div className="flex items-center gap-1 bg-cream-100 rounded-lg px-2 py-1.5">
                <button
                  type="button"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="w-6 h-6 flex items-center justify-center text-forest-600 hover:text-forest-900"
                  aria-label="Weniger Gäste"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
                <span className="font-body text-sm font-medium text-forest-800 w-4 text-center">{guests}</span>
                <button
                  type="button"
                  onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
                  className="w-6 h-6 flex items-center justify-center text-forest-600 hover:text-forest-900"
                  aria-label="Mehr Gäste"
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

  return (
    <div className="rounded-2xl border border-cream-200 shadow-card-lg bg-white overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-cream-100">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="font-display text-2xl text-forest-900">
              ab {priceFrom} €
            </span>
            <span className="font-body text-sm text-forest-400 ml-1">/ Nacht</span>
          </div>
          {datesSelected && (
            <button
              onClick={onReset}
              className="text-xs font-body text-forest-400 underline hover:text-forest-700 transition-colors"
            >
              Zurücksetzen
            </button>
          )}
        </div>
      </div>

      <div className="p-5 space-y-3">
        {/* Date boxes */}
        <div className="grid grid-cols-2 gap-2">
          <div
            className={[
              "rounded-xl border p-3 cursor-pointer transition-colors",
              selectionStep === "checkin" && !checkIn
                ? "border-forest-700 bg-forest-50"
                : "border-cream-200 hover:border-forest-300",
            ].join(" ")}
            onClick={() => onReset()}
          >
            <p className="font-body text-[10px] text-forest-400 uppercase tracking-wider mb-0.5">
              Anreise
            </p>
            <p className={`font-body text-sm ${checkIn ? "text-forest-900 font-medium" : "text-forest-400"}`}>
              {checkIn ? fmtShort(checkIn) : "Wählen"}
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
              Abreise
            </p>
            <p className={`font-body text-sm ${checkOut ? "text-forest-900 font-medium" : "text-forest-400"}`}>
              {checkOut ? fmtShort(checkOut) : checkIn ? "Wählen" : "–"}
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
              <p className="font-body text-[10px] text-forest-400 uppercase tracking-wider mb-0.5">Gäste</p>
              <p className="font-body text-sm text-forest-900 font-medium">{guests} {guests === 1 ? "Gast" : "Gäste"}</p>
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
                    <p className="font-body text-sm font-medium text-forest-800">Gäste</p>
                    <p className="font-body text-xs text-forest-400">max. {maxGuests} Personen</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                      className="w-8 h-8 rounded-full border border-cream-300 flex items-center justify-center text-forest-600 hover:border-forest-500 transition-colors disabled:opacity-30"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </button>
                    <span className="font-body text-base font-semibold text-forest-900 w-4 text-center">{guests}</span>
                    <button
                      type="button"
                      onClick={() => setGuests(Math.min(maxGuests, guests + 1))}
                      disabled={guests >= maxGuests}
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
                  Schließen
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
            {datesSelected ? "Weiter zur Buchung →" : "Datum im Kalender wählen"}
          </button>
        ) : (
          <div className="rounded-xl bg-forest-50 border border-forest-100 px-4 py-3">
            <p className="font-body text-xs text-forest-600">
              Fülle das Formular links aus und bestätige die Buchung.
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
                    {priceBreakdown.avgNightly.toLocaleString("de-DE")} € × {priceBreakdown.nights}{" "}
                    {priceBreakdown.nights === 1 ? "Nacht" : "Nächte"}
                  </span>
                  <span>{priceBreakdown.nightlyTotal.toLocaleString("de-DE")} €</span>
                </div>
                {priceBreakdown.extraPersonTotal > 0 && (
                  <div className="flex justify-between font-body text-sm text-forest-600">
                    <span>
                      Personenaufschlag ({priceBreakdown.extraGuests} {priceBreakdown.extraGuests === 1 ? "Person" : "Personen"} × {extraPersonFee} € × {priceBreakdown.nights} {priceBreakdown.nights === 1 ? "Nacht" : "Nächte"})
                    </span>
                    <span>{priceBreakdown.extraPersonTotal.toLocaleString("de-DE")} €</span>
                  </div>
                )}
                <div className="flex justify-between font-body text-sm text-forest-600">
                  <span>Reinigungsgebühr</span>
                  <span>{priceBreakdown.cleaningFee.toLocaleString("de-DE")} €</span>
                </div>
                <div className="flex justify-between font-body text-sm font-bold text-forest-900 border-t border-cream-200 pt-2">
                  <span>Gesamt</span>
                  <span>{priceBreakdown.total.toLocaleString("de-DE")} €</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust note */}
        <p className="text-center font-body text-xs text-forest-400">
          Du wirst noch nicht belastet
        </p>
      </div>
    </div>
  )
}
