"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { IconMenu, IconX, IconChevronDown } from "@/components/ui/Icons";
import SarfiLogo from "@/components/ui/SarfiLogo";

const navLinks = [
  { label: "HAUS28", href: "/haus28" },
  {
    label: "Haus Schönblick",
    href: "/schoenblick",
    children: [
      { label: "Apartment B7 – Neu ✦", href: "/schoenblick/b7" },
      { label: "Apartment B5", href: "/schoenblick/b5" },
      { label: "Apartment B6", href: "/schoenblick/b6" },
      { label: "Apartment B8", href: "/schoenblick/b8" },
      { label: "Apartment A2", href: "/schoenblick/a2" },
    ],
  },
  { label: "Ausflugsziele", href: "/ausflugsziele" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Kontakt", href: "/kontakt" },
];

export default function Header() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [dropdown,  setDropdown]  = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect scroll for header bg
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdown(null);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isHome = pathname === "/";

  // On hero pages header starts transparent
  const headerBg = scrolled
    ? "bg-forest-900/95 backdrop-blur-md shadow-lg"
    : isHome
    ? "bg-transparent"
    : "bg-forest-900/95 backdrop-blur-md";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${headerBg}`}
      role="banner"
    >
      <div className="container-site flex h-16 md:h-18 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="SARFI Collection – Startseite"
        >
          <SarfiLogo
            markOnly
            variant="light"
            className="h-9 w-auto transition-opacity group-hover:opacity-75"
          />
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl md:text-2xl font-semibold tracking-wide text-cream-50 group-hover:text-gold-300 transition-colors">
              SARFI
            </span>
            <span className="font-body text-[10px] tracking-[0.2em] uppercase text-cream-50/60 group-hover:text-gold-300/80 transition-colors">
              Collection
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Hauptnavigation"
          ref={dropdownRef}
        >
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.href} className="relative">
                <button
                  onClick={() =>
                    setDropdown(dropdown === link.href ? null : link.href)
                  }
                  className="flex items-center gap-1 px-4 py-2 text-sm font-body text-cream-50/80 hover:text-cream-50 transition-colors rounded-full hover:bg-cream-50/10"
                  aria-expanded={dropdown === link.href}
                  aria-haspopup="true"
                >
                  {link.label}
                  <IconChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      dropdown === link.href ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {dropdown === link.href && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 top-full mt-2 min-w-[200px] rounded-xl bg-forest-900 border border-cream-50/10 shadow-card-lg py-2"
                      role="menu"
                    >
                      <Link
                        href={link.href}
                        className="block px-4 py-2 text-sm text-cream-50/70 hover:text-cream-50 hover:bg-cream-50/10 transition-colors font-body"
                        role="menuitem"
                      >
                        Alle Apartments
                      </Link>
                      <div className="my-1 border-t border-cream-50/10" />
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-cream-50/80 hover:text-cream-50 hover:bg-cream-50/10 transition-colors font-body"
                          role="menuitem"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-body rounded-full transition-colors ${
                  pathname.startsWith(link.href)
                    ? "text-gold-300 bg-cream-50/10"
                    : "text-cream-50/80 hover:text-cream-50 hover:bg-cream-50/10"
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Button
            href="/haus28/buchen"
            variant="gold"
            size="sm"
            className="hidden sm:inline-flex"
            aria-label="Jetzt buchen"
          >
            Jetzt buchen
          </Button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-cream-50 hover:bg-cream-50/10 transition-colors"
            aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <IconX size={20} /> : <IconMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-forest-900 border-t border-cream-50/10"
          >
            <nav className="container-site py-4 flex flex-col gap-1" aria-label="Mobile Navigation">
              {navLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className={`block px-4 py-3 text-base font-body rounded-lg transition-colors ${
                      pathname.startsWith(link.href)
                        ? "text-gold-300 bg-cream-50/10"
                        : "text-cream-50/80 hover:text-cream-50 hover:bg-cream-50/10"
                    }`}
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="pl-4 flex flex-col gap-0.5 mt-0.5">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm font-body text-cream-50/60 hover:text-cream-50/90 hover:bg-cream-50/5 rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 border-t border-cream-50/10 mt-2">
                <Button href="/haus28/buchen" variant="gold" size="md" fullWidth>
                  Jetzt buchen
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
