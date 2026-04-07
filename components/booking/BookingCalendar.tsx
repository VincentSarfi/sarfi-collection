"use client"

import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ─── Date utilities (no external library needed) ──────────────────────────────

/** Returns YYYY-MM-DD for a Date */
export const toDateKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

/** Add N days to a Date (returns new Date) */
const addDays = (d: Date, n: number): Date =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)

/** True if two dates are the same calendar day */
const sameDay = (a: Date, b: Date): boolean => toDateKey(a) === toDateKey(b)

/** Formatted short display: "12. Jun" */
export const fmtShort = (d: Date): string =>
  d.toLocaleDateString("de-DE", { day: "numeric", month: "short" })

/** Formatted long display: "12.06.2025" */
export const fmtLong = (d: Date): string =>
  d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })

/** Month name + year: "Juni 2025" */
const fmtMonthYear = (d: Date): string =>
  d.toLocaleDateString("de-DE", { month: "long", year: "numeric" })

/** Returns all Date objects for the calendar grid of a given month (Mon-first, padded) */
function buildMonthGrid(year: number, month: number): Array<Date | null> {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  // Monday = 0, ..., Sunday = 6
  const startPad = (firstDay.getDay() + 6) % 7
  const grid: Array<Date | null> = []
  for (let i = 0; i < startPad; i++) grid.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) {
    grid.push(new Date(year, month, d))
  }
  // Pad to complete last row
  while (grid.length % 7 !== 0) grid.push(null)
  return grid
}

// ─── Props ────────────────────────────────────────────────────────────────────

export type SelectionStep = "checkin" | "checkout"

interface BookingCalendarProps {
  /** Set of blocked date strings (YYYY-MM-DD) */
  blockedDates: Set<string>
  /** Minimum nights map: YYYY-MM-DD → minStay */
  minStayMap: Record<string, number>
  /** Default min stay (fallback) */
  defaultMinStay: number
  checkIn: Date | null
  checkOut: Date | null
  selectionStep: SelectionStep
  onDateClick: (date: Date) => void
  /** Called on reset (click already-selected checkIn) */
  onReset: () => void
  /** Nightly prices map: YYYY-MM-DD → EUR (optional, for display) */
  priceMap?: Record<string, number>
}

// ─── Day Classifier ───────────────────────────────────────────────────────────

type DayClass = {
  disabled: boolean
  isCheckIn: boolean
  isCheckOut: boolean
  isInRange: boolean
  isRangeStart: boolean
  isRangeEnd: boolean
  isToday: boolean
  isBlocked: boolean
  isPast: boolean
}

function classifyDay(
  day: Date,
  today: Date,
  checkIn: Date | null,
  checkOut: Date | null,
  hoverDate: Date | null,
  blockedDates: Set<string>,
  selectionStep: SelectionStep,
  minStayMap: Record<string, number>,
  defaultMinStay: number,
): DayClass {
  const key = toDateKey(day)
  const isPast = day < today && !sameDay(day, today)
  const isBlocked = blockedDates.has(key)
  const isToday = sameDay(day, today)
  const isCheckIn = !!checkIn && sameDay(day, checkIn)
  const isCheckOut = !!checkOut && sameDay(day, checkOut)

  // Range display (confirmed selection)
  let isInRange = false
  let isRangeStart = false
  let isRangeEnd = false
  if (checkIn && checkOut) {
    isInRange = day > checkIn && day < checkOut
    isRangeStart = sameDay(day, checkIn)
    isRangeEnd = sameDay(day, checkOut)
  } else if (checkIn && hoverDate && selectionStep === "checkout") {
    const rangeEnd = hoverDate > checkIn ? hoverDate : null
    if (rangeEnd) {
      isInRange = day > checkIn && day < rangeEnd
      isRangeStart = sameDay(day, checkIn)
      isRangeEnd = sameDay(day, rangeEnd)
    }
  }

  // Disable logic
  let disabled = isPast || isBlocked
  if (!disabled && selectionStep === "checkout" && checkIn) {
    const checkInKey = toDateKey(checkIn)
    const minStay = minStayMap[checkInKey] ?? defaultMinStay
    const minCheckout = addDays(checkIn, minStay)
    if (day < minCheckout) {
      disabled = true // Before minimum stay
    } else {
      // Disable if any night in [checkIn, day) is blocked
      const cursor = new Date(checkIn)
      while (cursor < day) {
        const ck = toDateKey(cursor)
        if (blockedDates.has(ck) && !sameDay(cursor, checkIn)) {
          disabled = true
          break
        }
        cursor.setDate(cursor.getDate() + 1)
      }
    }
  }

  return { disabled, isCheckIn, isCheckOut, isInRange, isRangeStart, isRangeEnd, isToday, isBlocked, isPast }
}

// ─── Day Styles ───────────────────────────────────────────────────────────────

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]

function getDayButtonClasses(cls: DayClass): string {
  const base =
    "relative h-9 w-full text-sm font-body select-none transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-inset"

  if (cls.disabled) {
    return `${base} text-cream-300 cursor-not-allowed ${cls.isBlocked ? "line-through" : ""}`
  }
  if (cls.isCheckIn || cls.isCheckOut) {
    return `${base} bg-forest-800 text-cream-50 font-semibold rounded-full z-10 cursor-pointer hover:bg-forest-700`
  }
  if (cls.isInRange) {
    return `${base} bg-forest-100 text-forest-900 cursor-pointer hover:bg-forest-200`
  }
  return `${base} text-forest-900 cursor-pointer hover:bg-forest-100 hover:rounded-full`
}

function getRangeHighlight(cls: DayClass): string | null {
  if (cls.isRangeStart && cls.isRangeEnd) return null
  if (cls.isRangeStart) return "absolute inset-y-0 right-0 left-1/2 bg-forest-100 -z-10"
  if (cls.isRangeEnd) return "absolute inset-y-0 left-0 right-1/2 bg-forest-100 -z-10"
  if (cls.isInRange) return "absolute inset-0 bg-forest-100 -z-10"
  return null
}

// ─── Month View ───────────────────────────────────────────────────────────────

interface MonthViewProps {
  year: number
  month: number
  today: Date
  checkIn: Date | null
  checkOut: Date | null
  hoverDate: Date | null
  selectionStep: SelectionStep
  blockedDates: Set<string>
  minStayMap: Record<string, number>
  defaultMinStay: number
  priceMap?: Record<string, number>
  onDateClick: (d: Date) => void
  onDateHover: (d: Date | null) => void
  showWeekdays?: boolean
}

function MonthView({
  year,
  month,
  today,
  checkIn,
  checkOut,
  hoverDate,
  selectionStep,
  blockedDates,
  minStayMap,
  defaultMinStay,
  priceMap,
  onDateClick,
  onDateHover,
  showWeekdays = true,
}: MonthViewProps) {
  const grid = useMemo(() => buildMonthGrid(year, month), [year, month])

  return (
    <div className="min-w-0">
      {/* Month heading */}
      <p className="text-center font-display text-base font-semibold text-forest-900 mb-3">
        {fmtMonthYear(new Date(year, month, 1))}
      </p>

      {/* Weekday headers */}
      {showWeekdays && (
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((wd) => (
            <div
              key={wd}
              className="h-8 flex items-center justify-center text-xs font-body text-forest-400 font-medium"
            >
              {wd}
            </div>
          ))}
        </div>
      )}

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {grid.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className="h-9" />
          }

          const cls = classifyDay(
            day, today, checkIn, checkOut, hoverDate,
            blockedDates, selectionStep, minStayMap, defaultMinStay,
          )
          const highlight = getRangeHighlight(cls)
          const price = priceMap?.[toDateKey(day)]

          return (
            <div key={toDateKey(day)} className="relative flex items-center justify-center">
              {/* Range background strip */}
              {highlight && <span className={highlight} />}

              <button
                type="button"
                disabled={cls.disabled}
                className={getDayButtonClasses(cls)}
                onClick={() => !cls.disabled && onDateClick(day)}
                onMouseEnter={() => !cls.disabled && onDateHover(day)}
                onMouseLeave={() => onDateHover(null)}
                aria-label={`${fmtLong(day)}${cls.isBlocked ? " (belegt)" : ""}${cls.disabled ? " (nicht verfügbar)" : ""}`}
                aria-pressed={cls.isCheckIn || cls.isCheckOut}
              >
                <span className="flex flex-col items-center justify-center leading-tight">
                  <span>{day.getDate()}</span>
                  {price !== undefined && !cls.disabled && (
                    <span className="text-[9px] text-forest-400 leading-none mt-0.5">
                      {price}€
                    </span>
                  )}
                </span>
                {cls.isToday && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-500" />
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Calendar ────────────────────────────────────────────────────────────

export default function BookingCalendar({
  blockedDates,
  minStayMap,
  defaultMinStay,
  checkIn,
  checkOut,
  selectionStep,
  onDateClick,
  onReset,
  priceMap,
}: BookingCalendarProps) {
  const today = useMemo(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  }, [])

  // Start showing current month
  const [viewYear, setViewYear] = useState<number>(today.getFullYear())
  const [viewMonth, setViewMonth] = useState<number>(today.getMonth())
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [slideDir, setSlideDir] = useState<1 | -1>(1)

  const secondMonth = viewMonth === 11 ? 0 : viewMonth + 1
  const secondYear = viewMonth === 11 ? viewYear + 1 : viewYear

  const handlePrev = useCallback(() => {
    const prevDate = new Date(viewYear, viewMonth - 1, 1)
    if (prevDate < today) return // don't go before current month
    setSlideDir(-1)
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }, [viewYear, viewMonth, today])

  const handleNext = useCallback(() => {
    setSlideDir(1)
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }, [viewMonth])

  // Prevent going back to past months
  const canGoPrev = useMemo(() => {
    return new Date(viewYear, viewMonth - 1, 1) >= new Date(today.getFullYear(), today.getMonth(), 1)
  }, [viewYear, viewMonth, today])

  const handleDateClick = useCallback(
    (day: Date) => {
      if (selectionStep === "checkin" && checkIn && sameDay(day, checkIn)) {
        onReset()
      } else {
        onDateClick(day)
      }
    },
    [selectionStep, checkIn, onDateClick, onReset],
  )

  const slideVariants = {
    enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
  }

  return (
    <div className="select-none">
      {/* Instruction hint */}
      <p className="text-xs font-body text-forest-500 mb-4 min-h-[1.25rem]">
        {!checkIn
          ? "Anreisedatum wählen"
          : selectionStep === "checkout"
            ? "Abreisedatum wählen"
            : checkIn && checkOut
              ? `${fmtShort(checkIn)} → ${fmtShort(checkOut)}`
              : ""}
      </p>

      {/* Navigation row */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrev}
          disabled={!canGoPrev}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-cream-300 text-forest-600 hover:bg-cream-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Vorheriger Monat"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={handleNext}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-cream-300 text-forest-600 hover:bg-cream-100 transition-colors"
          aria-label="Nächster Monat"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Calendar grid: 2 months on lg+, 1 on mobile */}
      <AnimatePresence mode="popLayout" custom={slideDir}>
        <motion.div
          key={`${viewYear}-${viewMonth}`}
          custom={slideDir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
        >
          <MonthView
            year={viewYear}
            month={viewMonth}
            today={today}
            checkIn={checkIn}
            checkOut={checkOut}
            hoverDate={hoverDate}
            selectionStep={selectionStep}
            blockedDates={blockedDates}
            minStayMap={minStayMap}
            defaultMinStay={defaultMinStay}
            priceMap={priceMap}
            onDateClick={handleDateClick}
            onDateHover={setHoverDate}
          />
          {/* Second month (desktop only via CSS, but always rendered for accessibility) */}
          <div className="hidden lg:block">
            <MonthView
              year={secondYear}
              month={secondMonth}
              today={today}
              checkIn={checkIn}
              checkOut={checkOut}
              hoverDate={hoverDate}
              selectionStep={selectionStep}
              blockedDates={blockedDates}
              minStayMap={minStayMap}
              defaultMinStay={defaultMinStay}
              priceMap={priceMap}
              onDateClick={handleDateClick}
              onDateHover={setHoverDate}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-5 flex items-center gap-5 text-xs font-body text-forest-500">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-forest-800 inline-block" />
          Gewählt
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-forest-100 inline-block" />
          Zeitraum
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-cream-200 inline-block line-through text-center text-cream-400 text-[9px] leading-4">
            ×
          </span>
          Belegt
        </span>
      </div>
    </div>
  )
}
