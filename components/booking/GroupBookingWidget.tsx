"use client"

// Gruppenbuchung Haus Schönblick: mehrere Apartments, ein Zeitraum, eine
// Zahlung. Nutzt dieselben Bausteine wie die Einzelbuchung (BookingCalendar,
// PaymentStep, /api/smoobu/availability, /api/pricelabs/rates) und die
// geteilte Logik aus lib/group-booking.ts – der Server rechnet in
// /api/stripe/group-payment-intent mit identischen Funktionen nach.

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Turnstile } from "@marsidev/react-turnstile"
import BookingCalendar, { toDateKey, fmtLong, type SelectionStep } from "./BookingCalendar"
import PaymentStep from "./PaymentStep"
import { BOOKING_WINDOW_DAYS, bookingWindowEndDate } from "@/lib/booking-window"
import {
  GROUP_APARTMENT_IDS,
  GROUP_MAX_GUESTS,
  capacityOf,
  distributeGuests,
  quoteGroup,
  suggestCombination,
} from "@/lib/group-booking"
import { PROPERTY_CONFIGS, resolveSmoobuId } from "@/config/properties.config"
import type { AvailabilityMap } from "@/lib/smoobu"
import type { NightRate } from "@/lib/pricelabs"
import { getDict, localizeHref } from "@/lib/i18n"
import { useLocale } from "@/lib/i18n/LocaleProvider"
import { IconUsers, IconArrowRight } from "@/components/ui/Icons"

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAADCAIuxW7h0ePfOM"

// Marker für die Redirect-Rückkehr (sc_widget), s. BookingWidget
const GROUP_WIDGET_ID = "gruppe"

type Step = "dates" | "form" | "payment" | "confirmed" | "error"

type AptData = {
  availability: AvailabilityMap
  rates: Record<string, NightRate>
}

export default function GroupBookingWidget() {
  const locale = useLocale()
  const dict = getDict(locale).booking
  const t = dict.group
  const nf = locale === "en" ? "en-GB" : "de-DE"

  // ── Daten aller 5 Apartments laden ──
  const [aptData, setAptData] = useState<Record<string, AptData>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const today = new Date()
      const endDate = new Date(today)
      endDate.setDate(today.getDate() + BOOKING_WINDOW_DAYS)
      const start = today.toISOString().split("T")[0]
      const end = endDate.toISOString().split("T")[0]

      const entries = await Promise.all(
        GROUP_APARTMENT_IDS.map(async (id) => {
          const smoobuId = resolveSmoobuId(PROPERTY_CONFIGS[id])
          const [availability, rates] = await Promise.all([
            fetch(`/api/smoobu/availability?propertyId=${smoobuId}&startDate=${start}&endDate=${end}`)
              .then((r) => (r.ok ? r.json() : {}))
              .catch(() => ({})),
            fetch(`/api/pricelabs/rates?listingId=${smoobuId}&startDate=${start}&endDate=${end}`)
              .then((r) => (r.ok ? r.json() : {}))
              .catch(() => ({})),
          ])
          return [id, { availability, rates }] as const
        }),
      )
      if (!cancelled) {
        setAptData(Object.fromEntries(entries))
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // ── Auswahl-State ──
  const [guests, setGuests] = useState(10)
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [selectionStep, setSelectionStep] = useState<SelectionStep>("checkin")
  const [selectedApts, setSelectedApts] = useState<string[]>([])
  const [userTouchedApts, setUserTouchedApts] = useState(false)
  const [step, setStep] = useState<Step>("dates")
  const [errorMsg, setErrorMsg] = useState("")

  // ── Formular-State ──
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [paymentOption, setPaymentOption] = useState<"50" | "100">("50")
  const [submitting, setSubmitting] = useState(false)
  const turnstileToken = useRef("")
  const [turnstileReady, setTurnstileReady] = useState(false)

  // ── Stripe-State ──
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [depositAmount, setDepositAmount] = useState(0)
  const [serverTotal, setServerTotal] = useState(0)
  const [redirectReturn, setRedirectReturn] = useState(false)

  const widgetRef = useRef<HTMLDivElement>(null)
  const scrollToWidget = useCallback(() => {
    widgetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  const maxDate = useMemo(() => bookingWindowEndDate(), [])

  // ── Rückkehr von Redirect-Zahlarten (PayPal, Klarna …) ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const piClientSecret = params.get("payment_intent_client_secret")
    if (!piClientSecret || params.get("sc_widget") !== GROUP_WIDGET_ID) return

    const url = new URL(window.location.href)
    for (const p of ["payment_intent", "payment_intent_client_secret", "redirect_status", "source_type", "sc_widget"]) {
      url.searchParams.delete(p)
    }
    window.history.replaceState({}, "", url.toString())

    let cancelled = false
    ;(async () => {
      const errs = getDict(locale).booking.errors
      try {
        const { loadStripe } = await import("@stripe/stripe-js/pure")
        const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "")
        if (!stripeJs) throw new Error("Stripe.js nicht geladen")
        const { paymentIntent } = await stripeJs.retrievePaymentIntent(piClientSecret)
        if (cancelled) return
        if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing") {
          setRedirectReturn(true)
          setStep("confirmed")
        } else {
          setErrorMsg(errs.redirectFailed)
          setStep("error")
        }
      } catch {
        if (cancelled) return
        setErrorMsg(errs.redirectUnknown)
        setStep("error")
      }
      scrollToWidget()
    })()
    return () => { cancelled = true }
  }, [locale, scrollToWidget])

  // ── Abgeleitete Daten ──

  // Freie Apartments je Tag → Tag blockiert, wenn Kapazität < Gruppengröße
  const groupBlockedDates = useMemo<Set<string>>(() => {
    const blocked = new Set<string>()
    const allDates = new Set<string>()
    for (const id of GROUP_APARTMENT_IDS) {
      for (const d of Object.keys(aptData[id]?.availability ?? {})) allDates.add(d)
    }
    for (const date of allDates) {
      let cap = 0
      for (const id of GROUP_APARTMENT_IDS) {
        const day = aptData[id]?.availability?.[date]
        if (day && day.available) cap += PROPERTY_CONFIGS[id].maxGuests
      }
      if (cap < guests) blocked.add(date)
    }
    return blocked
  }, [aptData, guests])

  // Konservativer Mindestaufenthalt je Tag: max über alle Apartments
  const minStayMap = useMemo<Record<string, number>>(() => {
    const m: Record<string, number> = {}
    for (const id of GROUP_APARTMENT_IDS) {
      for (const [date, day] of Object.entries(aptData[id]?.availability ?? {})) {
        if (day.minimumStay > 1) m[date] = Math.max(m[date] ?? 0, day.minimumStay)
      }
      for (const [date, night] of Object.entries(aptData[id]?.rates ?? {})) {
        if (night.minStay > 1) m[date] = Math.max(m[date] ?? 0, night.minStay)
      }
    }
    return m
  }, [aptData])

  const nightsKeys = useMemo<string[]>(() => {
    if (!checkIn || !checkOut) return []
    const keys: string[] = []
    const cursor = new Date(checkIn)
    while (cursor < checkOut) {
      keys.push(toDateKey(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    return keys
  }, [checkIn, checkOut])

  // Kombinierte Nachtpreise je Apartment: PriceLabs vor Smoobu (wie Einzelbuchung)
  const rateMaps = useMemo<Record<string, Record<string, number>>>(() => {
    const maps: Record<string, Record<string, number>> = {}
    for (const id of GROUP_APARTMENT_IDS) {
      const m: Record<string, number> = {}
      for (const [date, day] of Object.entries(aptData[id]?.availability ?? {})) {
        if (day.price > 0) m[date] = day.price
      }
      for (const [date, night] of Object.entries(aptData[id]?.rates ?? {})) {
        if (night.price > 0) m[date] = night.price
      }
      maps[id] = m
    }
    return maps
  }, [aptData])

  // Für den ganzen Aufenthalt freie Apartments
  const availableApts = useMemo<string[]>(() => {
    if (nightsKeys.length === 0) return []
    return GROUP_APARTMENT_IDS.filter((id) =>
      nightsKeys.every((key) => aptData[id]?.availability?.[key]?.available !== false),
    )
  }, [aptData, nightsKeys])

  // Empfohlene Kombination vorauswählen, solange der Gast nicht selbst wählt
  useEffect(() => {
    if (nightsKeys.length === 0 || userTouchedApts) return
    const suggestion = suggestCombination(availableApts, guests, nightsKeys, rateMaps)
    setSelectedApts(suggestion ?? [])
  }, [availableApts, guests, nightsKeys, rateMaps, userTouchedApts])

  const guestsByApartment = useMemo(
    () => distributeGuests(selectedApts, guests),
    [selectedApts, guests],
  )

  const quote = useMemo(() => {
    if (nightsKeys.length === 0 || selectedApts.length === 0 || !guestsByApartment) return null
    return quoteGroup(selectedApts, guestsByApartment, nightsKeys, rateMaps)
  }, [selectedApts, guestsByApartment, nightsKeys, rateMaps])

  const selectedCapacity = capacityOf(selectedApts)
  const capacityOk = selectedCapacity >= guests && selectedApts.length >= 2

  // ── Kalender-Handler (wie BookingWidget) ──
  const handleDateClick = useCallback((date: Date) => {
    if (selectionStep === "checkin") {
      setCheckIn(date)
      setCheckOut(null)
      setSelectionStep("checkout")
    } else {
      if (checkIn && date > checkIn) {
        setCheckOut(date)
        setSelectionStep("checkin")
        setUserTouchedApts(false) // neue Daten → Empfehlung neu anwenden
      } else {
        setCheckIn(date)
        setCheckOut(null)
        setSelectionStep("checkout")
      }
    }
  }, [selectionStep, checkIn])

  const handleReset = useCallback(() => {
    setCheckIn(null)
    setCheckOut(null)
    setSelectionStep("checkin")
    setSelectedApts([])
    setUserTouchedApts(false)
  }, [])

  const toggleApartment = (id: string) => {
    setUserTouchedApts(true)
    setSelectedApts((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id].sort(),
    )
  }

  // ── Buchung abschicken ──
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkIn || !checkOut || !quote || !capacityOk) return
    if (!turnstileToken.current) {
      setErrorMsg(dict.errors.securityCheckPending)
      return
    }
    setSubmitting(true)
    setErrorMsg("")
    try {
      const res = await fetch("/api/stripe/group-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apartmentIds: selectedApts,
          checkIn: toDateKey(checkIn),
          checkOut: toDateKey(checkOut),
          guests,
          firstName,
          lastName,
          email,
          phone,
          message,
          totalPrice: quote.total,
          paymentOption,
          turnstileToken: turnstileToken.current,
          locale,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setErrorMsg(json.error ?? dict.errors.paymentGeneric)
        if (res.status === 409) {
          // Apartment zwischenzeitlich belegt → zurück zur Auswahl
          setStep("dates")
          setUserTouchedApts(false)
          scrollToWidget()
        }
        return
      }
      setClientSecret(json.clientSecret)
      setDepositAmount(json.depositAmount)
      setServerTotal(json.totalAmount)
      setStep("payment")
      scrollToWidget()
    } catch {
      setErrorMsg(dict.errors.connectionCheck)
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm text-forest-900 placeholder:text-forest-300 focus:outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/10"
  const labelCls =
    "block font-body text-xs font-medium uppercase tracking-wider text-forest-500 mb-1.5"

  return (
    <div ref={widgetRef} className="scroll-mt-24">
      <AnimatePresence mode="wait">

        {/* ── Schritt: Bestätigt ── */}
        {step === "confirmed" && (
          <motion.div key="confirmed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-forest-200 bg-forest-50 p-8 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="font-display text-2xl text-forest-900 mb-2">{t.confirmedHeading}</h2>
            <p className="font-body text-sm text-forest-600 max-w-md mx-auto">
              {t.confirmedText}
              {redirectReturn ? ` ${dict.confirmed.deliveryNote}` : ""}
            </p>
          </motion.div>
        )}

        {/* ── Schritt: Fehler ── */}
        {step === "error" && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-body text-sm text-red-700 mb-4">{errorMsg}</p>
            <button
              onClick={() => { setStep("dates"); setErrorMsg("") }}
              className="px-5 py-2.5 rounded-xl bg-forest-900 text-cream-50 font-body text-sm font-semibold hover:bg-forest-800 transition-colors"
            >
              {dict.form.back}
            </button>
          </motion.div>
        )}

        {/* ── Schritt: Zahlung ── */}
        {step === "payment" && clientSecret && (
          <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl">
            <h2 className="font-display text-xl text-forest-900 mb-4">{t.payHeading}</h2>
            {/* Apartment-Aufstellung über dem Stripe-Formular */}
            {quote && (
              <div className="mb-4 rounded-xl border border-cream-200 bg-white p-4 space-y-1.5">
                <p className="font-body text-xs uppercase tracking-wider text-forest-400 mb-2">{t.summaryApartments}</p>
                {quote.apartments.map((a) => (
                  <div key={a.id} className="flex justify-between font-body text-sm">
                    <span className="text-forest-700">{a.name} · {t.occupancyLine(a.guests)}</span>
                    <span className="text-forest-900 font-medium">{a.total.toLocaleString(nf)} €</span>
                  </div>
                ))}
              </div>
            )}
            <PaymentStep
              apartmentId={GROUP_WIDGET_ID}
              clientSecret={clientSecret}
              depositAmount={depositAmount}
              totalAmount={serverTotal}
              checkIn={checkIn}
              checkOut={checkOut}
              propertyName={`Haus Schönblick (${selectedApts.map((id) => PROPERTY_CONFIGS[id].name.replace("Apartment ", "")).join(", ")})`}
              guests={guests}
              paymentOption={paymentOption}
              onSuccess={() => { setStep("confirmed"); scrollToWidget() }}
              onError={(msg) => { setErrorMsg(msg); setStep("error"); scrollToWidget() }}
              onBack={() => setStep("form")}
            />
          </motion.div>
        )}

        {/* ── Schritt: Formular ── */}
        {step === "form" && (
          <motion.div key="form" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="max-w-xl">
            <h2 className="font-display text-xl text-forest-900 mb-4">{t.formHeading}</h2>
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} htmlFor="g-firstname">{dict.form.firstName}</label>
                  <input id="g-firstname" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={dict.form.phFirstName} className={inputCls} autoComplete="given-name" />
                </div>
                <div>
                  <label className={labelCls} htmlFor="g-lastname">{dict.form.lastName}</label>
                  <input id="g-lastname" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={dict.form.phLastName} className={inputCls} autoComplete="family-name" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} htmlFor="g-email">{dict.form.emailFull}</label>
                  <input id="g-email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={dict.form.phEmail} className={inputCls} autoComplete="email" />
                </div>
                <div>
                  <label className={labelCls} htmlFor="g-phone">{dict.form.phoneFull}</label>
                  <input id="g-phone" required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={dict.form.phPhone} className={inputCls} autoComplete="tel" />
                </div>
              </div>
              <div>
                <label className={labelCls} htmlFor="g-message">{dict.form.messageFull} {dict.form.optional}</label>
                <textarea id="g-message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={dict.form.phMessageFull} className={inputCls} />
              </div>

              {/* Zahlungsoption */}
              <div className="grid grid-cols-2 gap-3">
                {(["50", "100"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPaymentOption(opt)}
                    className={[
                      "rounded-xl border-2 p-3 text-left transition-colors",
                      paymentOption === opt ? "border-forest-700 bg-forest-50" : "border-cream-200 bg-white hover:border-cream-300",
                    ].join(" ")}
                  >
                    <span className="block font-body text-sm font-semibold text-forest-900">
                      {opt === "50" ? dict.form.deposit50Label : dict.form.full100Label}
                    </span>
                    <span className="block font-body text-xs text-forest-500 mt-0.5">
                      {quote
                        ? (opt === "50"
                            ? dict.form.subDeposit(Math.round(quote.total / 2).toLocaleString(nf))
                            : dict.form.subFull(quote.total.toLocaleString(nf)))
                        : ""}
                    </span>
                  </button>
                ))}
              </div>

              {/* Summe */}
              {quote && (
                <div className="rounded-xl bg-cream-100 border border-cream-200 p-4 flex justify-between items-center">
                  <span className="font-body text-sm text-forest-600">
                    {t.totalLabel} · {t.nightsSummary(quote.nights)}
                  </span>
                  <span className="font-display text-xl text-forest-900">{quote.total.toLocaleString(nf)} €</span>
                </div>
              )}

              {errorMsg && <p className="font-body text-sm text-red-600">{errorMsg}</p>}

              {/* Rechtshinweis: AGB-Einbeziehung (§ 305 Abs. 2 BGB) + Datenschutz-Info */}
              <p className="text-xs font-body text-forest-400 leading-relaxed">
                {dict.form.legalFull.pre}
                <Link href={localizeHref("/agb", locale)} className="underline hover:text-forest-700">{dict.form.legalFull.terms}</Link>
                {dict.form.legalFull.mid}
                <Link href={localizeHref("/agb#stornierung", locale)} className="underline hover:text-forest-700">{dict.form.legalFull.cancellation}</Link>
                {dict.form.legalFull.post}
                <Link href={localizeHref("/datenschutz", locale)} className="underline hover:text-forest-700">{dict.form.legalFull.privacy}</Link>
                {dict.form.legalFull.end}
              </p>

              <Turnstile
                siteKey={TURNSTILE_SITE_KEY}
                onSuccess={(token) => { turnstileToken.current = token; setTurnstileReady(true) }}
                onExpire={() => { turnstileToken.current = ""; setTurnstileReady(false) }}
                options={{ size: "flexible" }}
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep("dates"); scrollToWidget() }}
                  className="px-5 py-3 rounded-xl border-2 border-cream-300 font-body text-sm font-semibold text-forest-700 hover:bg-cream-100 transition-colors"
                >
                  {dict.form.back}
                </button>
                <button
                  type="submit"
                  disabled={submitting || !turnstileReady}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-forest-900 text-cream-50 font-body text-sm font-semibold hover:bg-forest-800 transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <><span className="w-4 h-4 border-2 border-cream-50/40 border-t-cream-50 rounded-full animate-spin" />{dict.form.preparing}</>
                  ) : !turnstileReady ? dict.form.securityRunning : dict.form.continueToPaymentArrow}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ── Schritt: Zeitraum + Apartments ── */}
        {step === "dates" && (
          <motion.div key="dates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
            <div>
              {/* Gruppengröße */}
              <div className="mb-6">
                <label className={labelCls} htmlFor="g-guests">{t.guestsLabel}</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-cream-300 bg-white">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(2, g - 1))}
                      className="w-11 h-11 font-body text-lg text-forest-700 hover:bg-cream-100 rounded-l-xl transition-colors"
                      aria-label="−"
                    >−</button>
                    <span id="g-guests" className="w-12 text-center font-body text-base font-semibold text-forest-900">{guests}</span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(GROUP_MAX_GUESTS, g + 1))}
                      className="w-11 h-11 font-body text-lg text-forest-700 hover:bg-cream-100 rounded-r-xl transition-colors"
                      aria-label="+"
                    >+</button>
                  </div>
                  <span className="font-body text-sm text-forest-500 flex items-center gap-1.5">
                    <IconUsers size={15} /> {t.guestsHint(GROUP_MAX_GUESTS)}
                  </span>
                </div>
              </div>

              {/* Kalender */}
              <h2 className="font-display text-lg text-forest-900 mb-1">{t.datesHeading}</h2>
              <p className="font-body text-xs text-forest-400 mb-4">{t.datesHint}</p>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <span className="w-6 h-6 border-2 border-forest-200 border-t-forest-700 rounded-full animate-spin" />
                </div>
              ) : (
                <BookingCalendar
                  blockedDates={groupBlockedDates}
                  minStayMap={minStayMap}
                  defaultMinStay={2}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  selectionStep={selectionStep}
                  onDateClick={handleDateClick}
                  onReset={handleReset}
                  maxDate={maxDate}
                />
              )}

              {/* Apartment-Auswahl */}
              {checkIn && checkOut && (
                <div className="mt-8">
                  <h2 className="font-display text-lg text-forest-900 mb-1">{t.aptsHeading}</h2>
                  {availableApts.length === 0 || capacityOf(availableApts) < guests ? (
                    <p className="font-body text-sm text-red-600 mt-2">{t.aptsNoneAvailable}</p>
                  ) : (
                    <>
                      <p className="font-body text-xs text-forest-400 mb-4">
                        {t.aptsAvailable(availableApts.length)} · {userTouchedApts ? "" : t.recommendedApplied}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {availableApts.map((id) => {
                          const cfg = PROPERTY_CONFIGS[id]
                          const isSelected = selectedApts.includes(id)
                          const aptGuests = guestsByApartment?.[id]
                          // Basispreis dieses Apartments für den Zeitraum
                          const q = quoteGroup([id], { [id]: cfg.baseOccupancy }, nightsKeys, rateMaps)
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => toggleApartment(id)}
                              aria-pressed={isSelected}
                              className={[
                                "rounded-xl border-2 p-4 text-left transition-all",
                                isSelected
                                  ? "border-gold-500 ring-2 ring-gold-400/30 bg-white"
                                  : "border-cream-200 bg-white hover:border-cream-300",
                              ].join(" ")}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-body text-sm font-semibold text-forest-900">{cfg.name}</span>
                                {isSelected && <span className="text-gold-600 text-sm font-semibold">✓</span>}
                              </div>
                              <p className="font-body text-xs text-forest-500">
                                {t.capacityShort(cfg.maxGuests)}
                                {isSelected && aptGuests ? ` · ${t.occupancyLine(aptGuests)}` : ""}
                              </p>
                              <p className="font-body text-xs text-forest-400 mt-1">
                                {q.apartments[0].total.toLocaleString(nf)} € {t.inclCleaning}
                              </p>
                            </button>
                          )
                        })}
                      </div>
                      {!capacityOk && selectedApts.length > 0 && selectedCapacity < guests && (
                        <p className="font-body text-sm text-red-600 mt-3">
                          {t.tooFewCapacity(guests - selectedCapacity)}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ── Zusammenfassung (Sidebar) ── */}
            <div className="lg:sticky lg:top-24 rounded-2xl border border-cream-200 bg-white p-6 shadow-card">
              <p className="font-body text-xs uppercase tracking-wider text-gold-600 mb-1">{t.kicker}</p>
              <h3 className="font-display text-lg text-forest-900 mb-4">{t.heading}</h3>

              {checkIn && checkOut ? (
                <div className="space-y-2 font-body text-sm">
                  <div className="flex justify-between">
                    <span className="text-forest-500">{dict.labels.arrival}</span>
                    <span className="font-medium text-forest-900">{fmtLong(checkIn, locale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest-500">{dict.labels.departure}</span>
                    <span className="font-medium text-forest-900">{fmtLong(checkOut, locale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest-500">{dict.labels.guests}</span>
                    <span className="font-medium text-forest-900">{guests}</span>
                  </div>

                  {quote && capacityOk && (
                    <>
                      <div className="border-t border-cream-200 pt-3 mt-3 space-y-1.5">
                        {quote.apartments.map((a) => (
                          <div key={a.id} className="flex justify-between">
                            <span className="text-forest-600">{a.name} · {t.occupancyLine(a.guests)}</span>
                            <span className="text-forest-900">{a.total.toLocaleString(nf)} €</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-cream-200 pt-3 mt-3 flex justify-between items-baseline">
                        <span className="text-forest-600">{t.totalLabel}<br /><span className="text-xs text-forest-400">{t.nightsSummary(quote.nights)} · {t.inclCleaning}</span></span>
                        <span className="font-display text-2xl text-forest-900">{quote.total.toLocaleString(nf)} €</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setStep("form"); setErrorMsg(""); scrollToWidget() }}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gold-500 text-forest-900 font-body text-sm font-bold hover:bg-gold-400 transition-colors"
                      >
                        {t.continueButton}
                        <IconArrowRight size={15} />
                      </button>
                    </>
                  )}
                  {selectedApts.length === 1 && (
                    <p className="text-xs text-forest-400 pt-2">{t.tooFewCapacity(Math.max(1, guests - selectedCapacity))}</p>
                  )}
                </div>
              ) : (
                <p className="font-body text-sm text-forest-500">{dict.calendar.hintCheckin}</p>
              )}

              {/* Vorteile */}
              <ul className="mt-5 pt-4 border-t border-cream-200 space-y-2">
                {[t.benefit1, t.benefit2, t.benefit3].map((b) => (
                  <li key={b} className="flex items-start gap-2 font-body text-xs text-forest-500">
                    <span className="text-gold-600 mt-px">✓</span>{b}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
