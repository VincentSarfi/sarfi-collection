"use client"

/**
 * Gutschein-Kauf in drei Schritten: Wert & Personalisierung → Zahlung
 * (Stripe Elements, gleiche Optik wie der Buchungs-Checkout) → Bestätigung.
 * Der Gutschein selbst kommt per Mail (Webhook bei payment_intent.succeeded);
 * die Bestätigung hier verspricht deshalb nur "Mail ist unterwegs".
 */

import { useEffect, useRef, useState } from "react"
import { Turnstile } from "@marsidev/react-turnstile"
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
// "/pure": js.stripe.com erst beim Betreten des Zahlungsschritts laden (DSGVO)
import { loadStripe } from "@stripe/stripe-js/pure"
import { STRIPE_APPEARANCE } from "@/components/booking/PaymentStep"

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAADCAIuxW7h0ePfOM"

// Grenzen/Presets gespiegelt aus lib/voucher.ts – kein Import, damit kein
// Server-Code (crypto) ins Client-Bundle wandert. Der Server validiert eh.
const MIN_EUR = 50
const MAX_EUR = 2500
const PRESETS = [100, 200, 300, 500]

type Step = "form" | "payment" | "confirmed"

export default function GutscheinWidget() {
  const [step, setStep] = useState<Step>("form")
  const [amount, setAmount] = useState<number>(200)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [buyerName, setBuyerName] = useState("")
  const [email, setEmail] = useState("")
  const [recipient, setRecipient] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [stripePromise] = useState(() =>
    typeof window === "undefined"
      ? null
      : loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""),
  )
  const turnstileToken = useRef("")
  const [turnstileReady, setTurnstileReady] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)

  const effectiveAmount = customAmount !== "" ? parseInt(customAmount, 10) : amount
  const amountValid =
    Number.isInteger(effectiveAmount) && effectiveAmount >= MIN_EUR && effectiveAmount <= MAX_EUR

  // Rückkehr von Redirect-Zahlarten (PayPal, Klarna …)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const piClientSecret = params.get("payment_intent_client_secret")
    if (!piClientSecret || params.get("sc_widget") !== "gutschein") return

    const url = new URL(window.location.href)
    for (const p of ["payment_intent", "payment_intent_client_secret", "redirect_status", "source_type", "sc_widget"]) {
      url.searchParams.delete(p)
    }
    window.history.replaceState({}, "", url.toString())

    let cancelled = false
    ;(async () => {
      try {
        const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "")
        if (!stripeJs) throw new Error("Stripe.js nicht geladen")
        const { paymentIntent } = await stripeJs.retrievePaymentIntent(piClientSecret)
        if (cancelled) return
        if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing") {
          setStep("confirmed")
        } else {
          setErrorMsg("Die Zahlung wurde nicht abgeschlossen. Bitte versuche es erneut.")
          setStep("form")
        }
      } catch {
        if (cancelled) return
        setErrorMsg("Der Zahlungsstatus konnte nicht geprüft werden. Falls du bezahlt hast, kommt die Gutschein-Mail in Kürze – ansonsten melde dich gern.")
        setStep("form")
      }
      widgetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    })()
    return () => { cancelled = true }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amountValid || submitting) return
    if (!turnstileToken.current) {
      setErrorMsg("Bot-Schutz lädt noch – einen Moment bitte.")
      return
    }
    setSubmitting(true)
    setErrorMsg(null)
    try {
      const res = await fetch("/api/stripe/voucher-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: effectiveAmount,
          buyerName,
          email,
          recipient: recipient || undefined,
          message: message || undefined,
          turnstileToken: turnstileToken.current,
          locale: "de",
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.clientSecret) {
        setErrorMsg(data.error ?? "Zahlung konnte nicht vorbereitet werden.")
        return
      }
      setClientSecret(data.clientSecret)
      setStep("payment")
      widgetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    } catch {
      setErrorMsg("Verbindungsfehler. Bitte versuche es erneut.")
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm text-forest-900 placeholder:text-forest-300 focus:outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/10 transition-colors"
  const labelCls =
    "block font-body text-xs font-medium text-forest-700 uppercase tracking-wider mb-1.5"

  return (
    <div ref={widgetRef} className="rounded-3xl bg-white border border-cream-200 shadow-card p-6 sm:p-8">
      {step === "confirmed" ? (
        <div className="text-center py-8">
          <span className="inline-flex w-14 h-14 rounded-full bg-forest-100 items-center justify-center text-2xl mb-4">✓</span>
          <h2 className="font-display text-2xl text-forest-900 mb-2">Danke für deinen Kauf!</h2>
          <p className="font-body text-sm text-forest-600 max-w-md mx-auto leading-relaxed">
            Dein Gutschein ist unterwegs: Du bekommst ihn in wenigen Minuten per
            E-Mail – mit Gutscheincode und einem Link zur Druckansicht.
            Keine Mail erhalten? Schau im Spam-Ordner nach oder schreib uns an
            hallo@sarfi-collection.de.
          </p>
        </div>
      ) : step === "payment" && clientSecret && stripePromise ? (
        <>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl text-forest-900">Zahlung</h2>
            <span className="font-body text-sm text-forest-600">
              Gutschein über <strong className="text-forest-900">{effectiveAmount} €</strong>
            </span>
          </div>
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance: STRIPE_APPEARANCE, locale: "de" }}
          >
            <VoucherCheckout
              amount={effectiveAmount}
              onError={(msg) => setErrorMsg(msg)}
              onSuccess={() => {
                setStep("confirmed")
                widgetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
              }}
              onBack={() => { setClientSecret(null); setStep("form") }}
            />
          </Elements>
          {errorMsg && (
            <p className="mt-4 font-body text-sm text-red-600" role="alert">{errorMsg}</p>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className={labelCls}>Gutscheinwert</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { setAmount(p); setCustomAmount("") }}
                  className={`px-5 py-2.5 rounded-full font-body text-sm font-semibold border-2 transition-colors ${
                    customAmount === "" && amount === p
                      ? "bg-forest-900 text-cream-50 border-forest-900"
                      : "bg-white text-forest-800 border-cream-300 hover:border-forest-400"
                  }`}
                >
                  {p} €
                </button>
              ))}
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  min={MIN_EUR}
                  max={MAX_EUR}
                  step={1}
                  placeholder="Wunschbetrag"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className={`w-40 px-4 py-2.5 pr-8 rounded-full font-body text-sm font-semibold border-2 focus:outline-none transition-colors ${
                    customAmount !== ""
                      ? "border-forest-900 text-forest-900"
                      : "border-cream-300 text-forest-800"
                  }`}
                  aria-label={`Wunschbetrag in Euro (${MIN_EUR} bis ${MAX_EUR})`}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-body text-sm text-forest-400 pointer-events-none">€</span>
              </div>
            </div>
            {customAmount !== "" && !amountValid && (
              <p className="font-body text-xs text-red-600">
                Bitte einen ganzen Betrag zwischen {MIN_EUR} € und {MAX_EUR} € wählen.
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="v-buyer" className={labelCls}>Dein Name *</label>
              <input id="v-buyer" required maxLength={100} value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)} placeholder="Max Mustermann" className={inputCls} />
            </div>
            <div>
              <label htmlFor="v-email" className={labelCls}>Deine E-Mail *</label>
              <input id="v-email" type="email" required maxLength={254} value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="max@beispiel.de" className={inputCls} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="v-recipient" className={labelCls}>Für (optional)</label>
              <input id="v-recipient" maxLength={80} value={recipient}
                onChange={(e) => setRecipient(e.target.value)} placeholder="Name des/der Beschenkten" className={inputCls} />
            </div>
            <div>
              <label htmlFor="v-message" className={labelCls}>Persönliche Nachricht (optional)</label>
              <input id="v-message" maxLength={300} value={message}
                onChange={(e) => setMessage(e.target.value)} placeholder="Alles Gute zum Geburtstag!" className={inputCls} />
            </div>
          </div>

          <p className="font-body text-xs text-forest-500 leading-relaxed">
            Der Gutschein kommt sofort nach der Zahlung per E-Mail an dich – als
            Code plus druckfertige Gutschein-Karte. Gültig bis zum 31.12. des
            dritten Jahres nach dem Kauf, einlösbar für alle Unterkünfte.
          </p>

          {errorMsg && (
            <p className="font-body text-sm text-red-600" role="alert">{errorMsg}</p>
          )}

          <Turnstile
            siteKey={TURNSTILE_SITE_KEY}
            options={{ size: "flexible" }}
            onSuccess={(token) => { turnstileToken.current = token; setTurnstileReady(true) }}
            onExpire={() => { turnstileToken.current = ""; setTurnstileReady(false) }}
          />

          <button
            type="submit"
            disabled={submitting || !amountValid || !turnstileReady}
            className="w-full py-4 rounded-2xl bg-gold-500 text-forest-900 font-body font-semibold text-base hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-forest-900/30 border-t-forest-900 rounded-full animate-spin" />
                Wird vorbereitet …
              </>
            ) : !turnstileReady ? (
              "Sicherheitsprüfung läuft …"
            ) : (
              `Gutschein über ${amountValid ? effectiveAmount : "–"} € kaufen →`
            )}
          </button>
        </form>
      )}
    </div>
  )
}

// ─── Zahlschritt (innerhalb <Elements>) ──────────────────────────────────────

function VoucherCheckout({
  amount,
  onSuccess,
  onError,
  onBack,
}: {
  amount: number
  onSuccess: () => void
  onError: (msg: string) => void
  onBack: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setProcessing(true)
    try {
      const returnUrl = new URL(window.location.href)
      returnUrl.searchParams.set("sc_widget", "gutschein")
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: { return_url: returnUrl.toString() },
      })
      if (error) {
        onError(error.message ?? "Die Zahlung ist fehlgeschlagen.")
      } else if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing") {
        onSuccess()
      } else {
        onError("Unerwarteter Zahlungsstatus – bitte versuche es erneut.")
      }
    } catch {
      onError("Verbindung zu Stripe fehlgeschlagen. Bitte erneut versuchen.")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement
        options={{
          layout: "accordion",
          paymentMethodOrder: ["apple_pay", "google_pay", "paypal", "card", "klarna"],
          wallets: { applePay: "auto", googlePay: "auto" },
        }}
      />
      <div className="flex flex-col gap-3 pt-2">
        <button
          type="submit"
          disabled={!stripe || !elements || processing}
          className="w-full py-4 rounded-2xl bg-forest-800 text-cream-50 font-body font-semibold text-base hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
        >
          {processing ? (
            <>
              <span className="w-5 h-5 border-2 border-cream-50/40 border-t-cream-50 rounded-full animate-spin" />
              Zahlung läuft …
            </>
          ) : (
            `${amount} € jetzt bezahlen`
          )}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={processing}
          className="font-body text-sm text-forest-600 underline underline-offset-2 hover:text-forest-900 transition-colors disabled:opacity-50"
        >
          Zurück
        </button>
        <p className="font-body text-xs text-forest-400 text-center">
          🔒 Sichere Zahlung über Stripe · Der Gutschein kommt direkt nach der Zahlung per E-Mail
        </p>
      </div>
    </form>
  )
}
