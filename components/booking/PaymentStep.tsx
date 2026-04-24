"use client"

import { useState } from "react"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { motion } from "framer-motion"
import { fmtShort, fmtLong } from "./BookingCalendar"

// Load Stripe once outside component to avoid re-initialisation
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
)

// ─── Stripe appearance (matches site design) ─────────────────────────────────

const STRIPE_APPEARANCE = {
  theme: "stripe" as const,
  variables: {
    colorPrimary: "#1e3d27",
    colorBackground: "#ffffff",
    colorText: "#0b1a10",
    colorDanger: "#ef4444",
    fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
    borderRadius: "12px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "1px solid #e8d5a8",
      boxShadow: "none",
      padding: "12px 14px",
    },
    ".Input:focus": {
      border: "1px solid #1e3d27",
      boxShadow: "0 0 0 3px rgba(30, 61, 39, 0.1)",
    },
    ".Label": {
      fontSize: "12px",
      fontWeight: "500",
      color: "#3a6e47",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    },
  },
}

// ─── Inner checkout form ──────────────────────────────────────────────────────

interface CheckoutFormProps {
  depositAmount: number
  totalAmount: number
  paymentOption: "50" | "100"
  onSuccess: (paymentIntentId: string) => void
  onError: (msg: string) => void
  onBack: () => void
}

function CheckoutForm({
  depositAmount,
  totalAmount,
  paymentOption,
  onSuccess,
  onError,
  onBack,
}: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: `${window.location.origin}/booking/bestaetigung`,
        },
      })

      if (error) {
        onError(
          error.message ??
            "Zahlung fehlgeschlagen. Bitte prüfe deine Kartendaten.",
        )
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess(paymentIntent.id)
      } else {
        onError("Unerwarteter Zahlungsstatus. Bitte versuche es erneut.")
      }
    } catch {
      onError("Verbindungsfehler. Bitte versuche es erneut.")
    } finally {
      setProcessing(false)
    }
  }

  const isFullPay = paymentOption === "100"
  const remaining = totalAmount - depositAmount

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Deposit / full-pay explanation */}
      <div className="rounded-xl bg-forest-50 border border-forest-100 p-4">
        <p className="font-body text-sm text-forest-700 leading-relaxed">
          {isFullPay ? (
            <>
              Du zahlst jetzt den{" "}
              <strong className="text-forest-900">vollen Betrag ({depositAmount.toLocaleString("de-DE")} €)</strong>.
              {" "}Nach der Zahlung ist die Buchung vollständig beglichen – keine weiteren Zahlungen nötig.
            </>
          ) : (
            <>
              Du zahlst jetzt die{" "}
              <strong className="text-forest-900">50% Anzahlung ({depositAmount.toLocaleString("de-DE")} €)</strong>.
              Den Restbetrag von{" "}
              <strong className="text-forest-900">{remaining.toLocaleString("de-DE")} €</strong>{" "}
              begleichst du 14 Tage vor Anreise oder nach Absprache mit dem Gastgeber.
            </>
          )}
        </p>
      </div>

      {/* Stripe Payment Element */}
      <div>
        <p className="font-body text-xs font-medium text-forest-700 uppercase tracking-wider mb-3">
          Zahlungsdaten
        </p>
        <PaymentElement
          options={{
            layout: "accordion",
            wallets: { applePay: "auto", googlePay: "auto" },
          }}
        />
      </div>

      {/* Error is handled by parent */}

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-2">
        <button
          type="submit"
          disabled={!stripe || !elements || processing}
          className="w-full py-4 rounded-2xl bg-forest-800 text-cream-50 font-body font-semibold text-base hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-3"
        >
          {processing ? (
            <>
              <span className="w-5 h-5 border-2 border-cream-50/40 border-t-cream-50 rounded-full animate-spin" />
              Zahlung wird verarbeitet…
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <rect x="1.5" y="4.5" width="15" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M1.5 7.5h15" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              {depositAmount.toLocaleString("de-DE")} € {isFullPay ? "jetzt bezahlen" : "jetzt anzahlen"}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={processing}
          className="text-sm font-body text-forest-500 hover:text-forest-800 transition-colors disabled:opacity-40"
        >
          ← Zurück zu meinen Angaben
        </button>
      </div>

      {/* Security note */}
      <p className="text-center font-body text-xs text-forest-400 flex items-center justify-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M6 1L1.5 3v3c0 2.76 1.95 5.34 4.5 6 2.55-.66 4.5-3.24 4.5-6V3L6 1z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
        </svg>
        SSL-verschlüsselt · Gesichert durch Stripe
      </p>
    </form>
  )
}

// ─── PaymentStep (public) ─────────────────────────────────────────────────────

interface PaymentStepProps {
  clientSecret: string
  depositAmount: number
  totalAmount: number
  checkIn: Date | null
  checkOut: Date | null
  propertyName: string
  guests: number
  paymentOption: "50" | "100"
  onSuccess: (paymentIntentId: string) => void
  onError: (msg: string) => void
  onBack: () => void
}

export default function PaymentStep({
  clientSecret,
  depositAmount,
  totalAmount,
  checkIn,
  checkOut,
  propertyName,
  guests,
  paymentOption,
  onSuccess,
  onError,
  onBack,
}: PaymentStepProps) {
  const isFullPay = paymentOption === "100"
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.25 }}
    >
      {/* Booking summary */}
      <div className="mb-6">
        <h2 className="font-body text-xl font-semibold text-forest-900 mb-4">
          {isFullPay ? "Vollzahlung" : "Anzahlung"}
        </h2>
        <div className="rounded-xl border border-cream-200 bg-cream-50 p-4 space-y-2">
          <div className="flex justify-between font-body text-sm">
            <span className="text-forest-500">Unterkunft</span>
            <span className="font-medium text-forest-900">{propertyName}</span>
          </div>
          {checkIn && checkOut && (
            <>
              <div className="flex justify-between font-body text-sm">
                <span className="text-forest-500">Anreise</span>
                <span className="font-medium text-forest-900">{fmtLong(checkIn)}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-forest-500">Abreise</span>
                <span className="font-medium text-forest-900">{fmtLong(checkOut)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between font-body text-sm">
            <span className="text-forest-500">Gäste</span>
            <span className="font-medium text-forest-900">{guests}</span>
          </div>
          <div className="border-t border-cream-200 pt-2 mt-1 space-y-1">
            <div className="flex justify-between font-body text-sm text-forest-600">
              <span>Gesamtpreis</span>
              <span>{totalAmount.toLocaleString("de-DE")} €</span>
            </div>
            <div className="flex justify-between font-body text-sm font-bold text-forest-900">
              <span>{isFullPay ? "Vollzahlung heute (100%)" : "Anzahlung heute (50%)"}</span>
              <span className="text-forest-800">{depositAmount.toLocaleString("de-DE")} €</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Elements */}
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: STRIPE_APPEARANCE,
          locale: "de",
        }}
      >
        <CheckoutForm
          depositAmount={depositAmount}
          totalAmount={totalAmount}
          paymentOption={paymentOption}
          onSuccess={onSuccess}
          onError={onError}
          onBack={onBack}
        />
      </Elements>
    </motion.div>
  )
}
