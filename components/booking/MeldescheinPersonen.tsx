'use client'

// Meldeschein je Person (§ 29 Abs. 2 Satz 1 BMG): Jede:r ausländische Erwachsene,
// der nicht als Ehe-/Lebenspartner:in oder minderjähriges Kind auf einem anderen
// Schein steht (typisch: Monteur-Kolleg:innen), braucht einen eigenen Meldeschein
// mit eigener Bestätigung.
//
// Der erste Meldeschein einer Buchung läuft wie bisher ohne Kennung. Wählt
// jemand „weitere Person“, erzeugt die Seite ein zufälliges Schein-Token und
// schickt es bei jeder Aktion dieses Scheins mit; das Dashboard legt dazu einen
// eigenen Schein an. Ein Token schreibt nie den ersten Schein. Damit ein anderes
// Gerät den ersten Schein nicht versehentlich überschreibt, merkt sich das Gerät,
// auf dem er begonnen wurde, das hier (`haupt`); die übrigen schicken beim
// Schreiben `nurWennFrei` (MeldescheinWidget.tsx).
// Die Helfer ohne React (Ablage der Tokens, Zuordnung zur Status-Antwort, Wahl
// beim Laden) liegen in lib/meldeschein-scheine.ts, mit Tests; hier nur der
// Block „Weitere“ unter dem fertigen Schein.

import { heuteIso, vortag, type ScheinStatus } from '@/lib/meldeschein-scheine'

/** Status-Zusatz des Dashboards; fehlt er, kennt das Dashboard noch keine weiteren Scheine. */
export type WeitereInfo = { moeglich: boolean; begonnen: boolean; ersterOffen?: boolean; ersterUeberQr?: boolean; anzahl?: number; bestaetigt?: number }

type Texte = {
  titel: string
  text: string
  knopf: string
  stand: (n: number, x: number) => string
  voll: string
  abVortag: (datum: string) => string
  diesesHandy: string
  staende: Record<ScheinStatus, string>
  bestaetigen: string
  fortsetzen: string
}

/** Ein Schein auf diesem Gerät für die Liste „Auf diesem Handy“ (der erste Schein ohne Vornamen). */
export type ListenEintrag = { key: string; label: string; status: ScheinStatus; aktiv: boolean; bestaetigen?: () => void; fortsetzen?: () => void }

/**
 * Block unter dem fertigen Schein: Scheine auf diesem Handy (mit Vornamen, nur
 * zu eigenen Tokens), die Zahl der übrigen (ohne Namen) und der Knopf für die
 * nächste Person.
 */
export function WeiterePersonen({ t, weitere, eintraege, arrival, departure, sendet, datum, stil, onNeu }: {
  t: Texte
  weitere: WeitereInfo
  eintraege: ListenEintrag[]
  arrival?: string
  departure?: string
  sendet: boolean
  datum: (iso?: string) => string
  stil: { sekundaer: string; klein: string; lbl: string }
  onNeu: () => void
}) {
  const heute = heuteIso()
  if (departure && heute > departure) return null
  const zuFrueh = Boolean(arrival && heute < vortag(arrival))
  const andere = weitere.anzahl ?? 0
  const link = 'font-body text-sm font-semibold text-forest-800 underline underline-offset-4 disabled:opacity-60'

  return (
    <div className="mt-8 border-t border-cream-200 pt-6 text-left">
      {eintraege.length > 1 && (
        <div className="mb-5">
          <p className={stil.lbl}>{t.diesesHandy}</p>
          <ul className="space-y-2">
            {eintraege.map((e) => (
              <li key={e.key} className="flex items-center justify-between gap-3 rounded-2xl bg-cream-50 px-4 py-3">
                <span className="font-body text-sm text-forest-800">
                  {e.label}
                  <span className="text-forest-600"> · {t.staende[e.status]}</span>
                </span>
                {!e.aktiv && e.bestaetigen && <button className={link} disabled={sendet} onClick={e.bestaetigen}>{t.bestaetigen}</button>}
                {!e.aktiv && e.fortsetzen && <button className={link} disabled={sendet} onClick={e.fortsetzen}>{t.fortsetzen}</button>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {andere > 0 && <p className={`${stil.klein} mb-4`}>{t.stand(andere, weitere.bestaetigt ?? 0)}</p>}
      <h3 className="font-display text-xl text-forest-900 mb-2">{t.titel}</h3>
      {zuFrueh ? (
        <p className="font-body text-sm text-forest-600 leading-relaxed">{t.abVortag(datum(arrival ? vortag(arrival) : undefined))}</p>
      ) : weitere.moeglich ? (
        <>
          <p className="font-body text-sm text-forest-600 leading-relaxed">{t.text}</p>
          <button className={`${stil.sekundaer} mt-4`} disabled={sendet} onClick={onNeu}>{t.knopf}</button>
        </>
      ) : (
        <p className="font-body text-sm text-forest-600 leading-relaxed">{t.voll}</p>
      )}
    </div>
  )
}
