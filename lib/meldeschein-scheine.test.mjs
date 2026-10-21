// Regressionstests zur Codex-Gegenprüfung vom 21.10.2026 (W1–W4, zweite Runde) für
// lib/meldeschein-scheine.ts. Ohne Netz, ohne Browser: localStorage und
// sessionStorage sind Attrappen, jede Prüfung lädt das Modul frisch (eigener
// Modulzustand, wie ein neu geladener Tab).
//
//   node --test lib/meldeschein-scheine.test.mjs

import test from 'node:test'
import assert from 'node:assert/strict'

const SCHLUESSEL = 'sarfi-meldeschein-scheine'

/** Storage-Attrappe. `voll`: Schreiben des Eintrags scheitert, die kleine Probe passt noch (Quote fast erschöpft). */
class Ablage {
  constructor() { this.daten = new Map(); this.voll = false; this.gesperrt = false }
  getItem(k) { if (this.gesperrt) throw new Error('SecurityError'); return this.daten.has(k) ? this.daten.get(k) : null }
  setItem(k, v) {
    if (this.gesperrt) throw new Error('SecurityError')
    if (this.voll && k === SCHLUESSEL) throw new Error('QuotaExceededError')
    this.daten.set(k, String(v))
  }
  removeItem(k) { if (this.gesperrt) throw new Error('SecurityError'); this.daten.delete(k) }
}

let n = 0
async function frisch(lokal, sitzung) {
  globalThis.window = { localStorage: lokal, sessionStorage: sitzung }
  return import(`./meldeschein-scheine.ts?tab=${++n}`)
}

const tok = (c) => c.repeat(43)
const [T1, T2, T3] = [tok('a'), tok('b'), tok('c')]
const K = 'B6|2026-10-21'
const BIS = '2099-01-01'

// ── W3 ──────────────────────────────────────────────────────────────────

test('W3: nach einem Schreibfehler gilt die Kopie im Arbeitsspeicher, der Ersatzspeicher hält die Tokens über ein Neuladen', async () => {
  const lokal = new Ablage()
  const sitzung = new Ablage()
  const m = await frisch(lokal, sitzung)
  m.scheinSpeicher.merken(K, BIS, T1)
  assert.equal(m.speicherArt(), 'dauerhaft')
  // Die Probe passt noch, der Eintrag nicht mehr.
  lokal.voll = true
  m.scheinSpeicher.merken(K, BIS, T2)
  assert.deepEqual(m.scheinSpeicher.eigene(K), [T1, T2], 'der eingereichte Schein ist auf dieser Seite nicht verloren')
  assert.equal(m.speicherArt(), 'sitzung', 'gespeichert nur noch für diesen Tab')

  // Neu laden im selben Tab: localStorage hat den alten Stand, sessionStorage den neuen.
  const neu = await frisch(lokal, sitzung)
  assert.deepEqual(neu.scheinSpeicher.eigene(K), [T1, T2])

  // Scheitert auch der Ersatz, bleibt nur der Arbeitsspeicher.
  sitzung.voll = true
  neu.scheinSpeicher.merken(K, BIS, T3)
  assert.deepEqual(neu.scheinSpeicher.eigene(K), [T1, T2, T3])
  assert.equal(neu.speicherArt(), null)
})

test('W3: ohne Schreibfehler bleibt alles wie bisher, Vergessen wirkt auch nach dem Neuladen', async () => {
  const lokal = new Ablage()
  const sitzung = new Ablage()
  const m = await frisch(lokal, sitzung)
  m.scheinSpeicher.merken(K, BIS, T1)
  m.scheinSpeicher.merken(K, BIS, T2)
  m.scheinSpeicher.vergessen(K, T1)
  assert.equal(sitzung.daten.size, 0, 'der Ersatz bleibt leer, solange localStorage schreibt')
  assert.deepEqual((await frisch(lokal, sitzung)).scheinSpeicher.eigene(K), [T2])
})

// ── W4 ──────────────────────────────────────────────────────────────────

test('W4: Nur sessionStorage ist nicht dauerhaft — ein weiterer Schein bekommt den Hinweis, der Hauptschein bleibt wie bisher', async () => {
  const lokal = new Ablage()
  lokal.gesperrt = true
  const m = await frisch(lokal, new Ablage())
  assert.equal(m.speicherArt(), 'sitzung')
  assert.equal(m.speicherHinweis('sitzung', true), 'sitzung')
  assert.equal(m.speicherHinweis(null, true), 'nichts')
  assert.equal(m.speicherHinweis('dauerhaft', true), 'keiner')
  // Hauptschein: Die buchende Person bekommt die Erinnerung, Hinweis wie bisher nur ohne jeden Speicher.
  assert.equal(m.speicherHinweis('sitzung', false), 'keiner')
  assert.equal(m.speicherHinweis(null, false), 'nichts')
})

// ── W2 ──────────────────────────────────────────────────────────────────

test('W2: Zuordnung nur über die Stelle des Tokens in der Anfrage, nie über eine gemerkte Nr.; Unbekannte werden genannt', async () => {
  const m = await frisch(new Ablage(), new Ablage())
  const fremd = tok('x') // Token eines anderen Aufenthalts auf diesem Gerät
  // T1 hatte früher Nr. 3 (zwei Stunden ohne Einreichen verworfen); Nr. 3 gehört jetzt T2.
  const r = m.zuordnen([T1, fremd, T2], [T1, T2], [{ i: 2, nr: 3, status: 'eingereicht' }])
  assert.deepEqual(r.eigene.map((e) => [e.token, e.nr]), [[T2, 3]])
  assert.deepEqual(r.unbekannt, [T1], 'das alte Token kennt der Server nicht')
  assert.deepEqual(r.ungeprueft, [])
  // Ein Treffer auf ein Token, das nicht zu diesem Aufenthalt gehört, zählt nicht; nicht mitgeschickte sind ungeprüft.
  const s = m.zuordnen([fremd], [T1], [{ i: 0, nr: 2, status: 'offen' }, { i: 7, nr: 4, status: 'offen' }])
  assert.deepEqual([s.eigene, s.unbekannt, s.ungeprueft], [[], [], [T1]])
})

// ── W1 ──────────────────────────────────────────────────────────────────

test('W1: Erinnerungslink — eigene offene Scheine eines Geräts ohne Vermerk gehen vor, sonst wie bisher der Hauptschein', async () => {
  const m = await frisch(new Ablage(), new Ablage())
  const eigen = { token: T1, nr: 2, status: 'eingereicht' }
  const basis = { vorher: { token: null, nr: null }, erinnerung: true, hauptStatus: 'eingereicht' }
  // Buchende Person mit eigenem weiterem Schein, der Kollege hat den Hauptschein auf seinem Handy eingereicht.
  assert.deepEqual(m.startWahl({ ...basis, liste: [eigen], hier: false }), { art: 'eigener', e: eigen })
  assert.deepEqual(m.startWahl({ ...basis, liste: [{ ...eigen, status: 'offen' }], hier: false }), { art: 'eigener', e: { ...eigen, status: 'offen' } })
  // Mit Vermerk wie bisher direkt der Hauptschein.
  assert.deepEqual(m.startWahl({ ...basis, liste: [], hier: true }), { art: 'erster' })
  // Ohne Erinnerung unverändert.
  assert.deepEqual(m.startWahl({ ...basis, erinnerung: false, liste: [], hier: false }), { art: 'neu' })
  assert.deepEqual(m.startWahl({ ...basis, erinnerung: false, liste: [eigen], hier: true }), { art: 'eigener', e: eigen })
  // Hauptschein nicht eingereicht: Die Erinnerung zählt nicht.
  assert.deepEqual(m.startWahl({ ...basis, hauptStatus: 'erhalten', liste: [], hier: false }), { art: 'neu' })
})

// ── Gegenprüfung 21.10.2026, zweite Runde ───────────────────────────────

test('Erinnerung ohne Vermerk (Hauptschein über den Vorlagen-Link, im Bestand oder auf einem anderen Gerät): direkt zur Bestätigung, nie über den Familiennamen', async () => {
  const m = await frisch(new Ablage(), new Ablage())
  const basis = { vorher: { token: null, nr: null }, erinnerung: true, hauptStatus: 'eingereicht', hier: false }
  // Nichts auf dem Gerät: Bestand (eingereicht mit der alten Seite) und Vorlage-Hauptschein in einem anderen Browser.
  assert.deepEqual(m.startWahl({ ...basis, liste: [] }), { art: 'erster' })
  // Nur erledigte eigene Scheine: kein offener, also der Hauptschein (eine schon benutzte Karte lehnt das Dashboard mit eigene_karte ab).
  assert.deepEqual(m.startWahl({ ...basis, liste: [{ token: T1, nr: 2, status: 'erhalten' }, { token: T2, nr: 3, status: 'entfaellt' }] }), { art: 'erster' })
  // Wahlmöglichkeiten gibt es nur noch drei; „name“ entsteht nie mehr.
  for (const hier of [true, false]) for (const liste of [[], [{ token: T1, nr: 2, status: 'eingereicht' }]]) {
    assert.notEqual(m.startWahl({ ...basis, hier, liste }).art, 'name')
  }
})

test('Geteiltes Handy: Die Erinnerung öffnet den Hauptschein des Geräts, das ihn begonnen hat, nicht den offenen Schein des Kollegen', async () => {
  const m = await frisch(new Ablage(), new Ablage())
  const piotr = { token: T2, nr: 2, status: 'eingereicht', vorname: 'Piotr' }
  const basis = { vorher: { token: null, nr: null }, hauptStatus: 'eingereicht', hier: true, liste: [piotr] }
  assert.deepEqual(m.startWahl({ ...basis, erinnerung: true }), { art: 'erster' })
  // Ohne Erinnerung wie bisher der zuletzt offene eigene Schein (a991f48).
  assert.deepEqual(m.startWahl({ ...basis, erinnerung: false }), { art: 'eigener', e: piotr })
  // Wer auf dieser Seite gerade einen Schein bearbeitet und neu lädt, bleibt dort, auch mit e=1.
  assert.deepEqual(m.startWahl({ ...basis, erinnerung: true, vorher: { token: T2, nr: 2 } }), { art: 'eigener', e: piotr })
})
