"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Menu, X, ChevronRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/components/providers/ThemeProvider";

const NAV_LINKS = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "About",     href: "/about"     },
  { label: "Quality",   href: "/quality"   },
  { label: "Contact",   href: "/contact"   },
];

const DRAGONS = [
  {
    slug:  "black-dragon" as const,
    ja:    "黒い龍",
    ar:    "التنين الأسود",
    label: "BLACK DRAGON",
    bg:    "linear-gradient(145deg,#0d0d0d 0%,#1a1206 55%,#0a0a0a 100%)",
    textColor: "#F4F1EA",
  },
  {
    slug:  "white-dragon" as const,
    ja:    "白い龍",
    ar:    "التنين الأبيض",
    label: "WHITE DRAGON",
    bg:    "linear-gradient(145deg,#f7f2e8 0%,#efe6d7 55%,#f5edd8 100%)",
    textColor: "#6f5e4a",
  },
] as const;

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router   = useRouter();
  const isBlack  = theme === "black-dragon";
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleDragonChange = (slug: "black-dragon" | "white-dragon") => {
    setTheme(slug);
    setMenuOpen(false);
    if (pathname.startsWith("/product/")) {
      router.push(`/product/${slug}`);
    } else {
      router.push(`/product/${slug}`);
    }
  };

  const headerBg  = scrolled ? (isBlack ? "rgba(5,5,5,0.72)" : "rgba(247,242,232,0.82)") : "transparent";
  const goldColor = "var(--gold)";
  const iconColor = "var(--text)";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: headerBg,
          borderBottom: scrolled ? "1px solid rgba(185,154,91,0.22)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        }}
      >
        <div className="max-w-screen-2xl mx-auto px-5 md:px-8 h-16 md:h-[76px] flex items-center">

          {/* LEFT: desktop nav / mobile hamburger */}
          <div className="flex items-center w-1/3">
            <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-[0.65rem] tracking-[0.2em] uppercase transition-colors duration-300"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = goldColor; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <button
              className="md:hidden p-1 -ml-1 transition-colors duration-300"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              style={{ color: iconColor }}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>

          {/* CENTER: logo */}
          <div className="flex flex-1 justify-center">
            <Link href="/" aria-label="Go to homepage" style={{ display: "inline-flex", alignItems: "center" }}>
              <Image
                src={isBlack ? "/images/logo/logo-light.png" : "/images/logo/logo-dark.png"}
                alt="Nakama Store Morocco"
                width={160}
                height={48}
                priority
                style={{ height: "clamp(32px, 5.5vw, 42px)", width: "auto", objectFit: "contain", maxWidth: "clamp(110px, 20vw, 165px)" }}
              />
            </Link>
          </div>

          {/* RIGHT: theme toggle + cart + contact */}
          <div className="flex items-center justify-end gap-3 md:gap-4 w-1/3">
            <div className="hidden md:block">
              <ThemeToggle compact />
            </div>

            <Link
              href="/cart"
              className="p-1.5 transition-colors duration-300"
              aria-label="Go to cart"
              style={{ color: iconColor }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = goldColor; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = iconColor; }}
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
            </Link>

            <Link
              href="/contact"
              className="hidden md:inline-flex items-center transition-all duration-300"
              style={{ height: 34, padding: "0 14px", borderRadius: 4, border: "1px solid rgba(185,154,91,.45)", color: goldColor, fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "var(--gold)"; el.style.color = "var(--bg)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "transparent"; el.style.color = goldColor; }}
            >
              CONTACT US
            </Link>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
          style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        />
      )}

      {/* Mobile drawer */}
      <div
        className="fixed top-0 left-0 bottom-0 z-50 md:hidden flex flex-col"
        style={{
          width: 290,
          backgroundColor: isBlack ? "rgba(5,5,5,0.97)" : "rgba(247,242,232,0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(185,154,91,0.18)",
          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Drawer header */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(185,154,91,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <Image
              src={isBlack ? "/images/logo/logo-light.png" : "/images/logo/logo-dark.png"}
              alt="Nakama"
              width={120}
              height={36}
              style={{ height: 32, width: "auto", objectFit: "contain" }}
            />
          </Link>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{ color: "var(--text-muted)" }}>
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ padding: "1.5rem 1.5rem 0", flex: 1, overflowY: "auto" }}>
          <p style={{ color: "var(--gold)", fontSize: "0.52rem", letterSpacing: "0.28em", textTransform: "uppercase", opacity: 0.7, marginBottom: "0.75rem" }}>
            NAVIGATION
          </p>
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between transition-colors duration-200"
              style={{ color: "var(--text-muted)", fontSize: "0.9rem", letterSpacing: "0.06em", padding: "0.75rem 0", borderBottom: "1px solid rgba(185,154,91,0.1)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = goldColor; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
            >
              {label}
              <ChevronRight size={14} strokeWidth={1.5} style={{ opacity: 0.4 }} />
            </Link>
          ))}

          <Link
            href="/cart"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between transition-colors duration-200"
            style={{ color: "var(--text-muted)", fontSize: "0.85rem", letterSpacing: "0.04em", padding: "0.75rem 0", borderBottom: "1px solid rgba(185,154,91,0.1)" }}
          >
            Cart
            <ChevronRight size={14} strokeWidth={1.5} style={{ opacity: 0.4 }} />
          </Link>
        </nav>

        {/* Dragon cards */}
        <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid rgba(185,154,91,0.15)" }}>
          <p style={{ color: "var(--gold)", fontSize: "0.48rem", letterSpacing: "0.34em", textTransform: "uppercase", opacity: 0.62, marginBottom: "0.85rem" }}>
            CHOOSE YOUR DRAGON
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
            {DRAGONS.map(({ slug, ja, ar, label, bg, textColor }) => {
              const isActive = theme === slug;
              return (
                <button
                  key={slug}
                  onClick={() => handleDragonChange(slug)}
                  style={{
                    background: bg,
                    borderRadius: 10,
                    padding: "0.85rem 0.5rem",
                    border: isActive ? "1.5px solid var(--gold)" : "1px solid rgba(185,154,91,0.2)",
                    boxShadow: isActive ? "0 0 14px rgba(185,154,91,0.18), inset 0 0 8px rgba(185,154,91,0.06)" : "none",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.35s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Active glow pip */}
                  {isActive && (
                    <div style={{
                      position: "absolute", top: 7, right: 7,
                      width: 5, height: 5, borderRadius: "50%",
                      backgroundColor: "var(--gold)",
                      boxShadow: "0 0 6px var(--gold)",
                    }} />
                  )}

                  {/* Arabic */}
                  <p style={{
                    fontFamily: "var(--font-arabic-calligraphy, serif)",
                    color: "var(--gold)",
                    fontSize: "1.35rem",
                    lineHeight: 1,
                    marginBottom: "0.3rem",
                    opacity: isActive ? 1 : 0.72,
                  }}>
                    {ar}
                  </p>

                  {/* Japanese */}
                  <p style={{
                    fontSize: "0.44rem",
                    letterSpacing: "0.22em",
                    color: isActive ? "var(--gold)" : "rgba(185,154,91,0.55)",
                    marginBottom: "0.35rem",
                    transition: "color 0.3s",
                  }}>
                    {ja}
                  </p>

                  {/* Label */}
                  <p style={{
                    fontFamily: "var(--font-cinzel, serif)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: isActive ? "var(--gold)" : textColor,
                    fontWeight: isActive ? 600 : 400,
                    opacity: isActive ? 1 : 0.72,
                    transition: "all 0.3s",
                  }}>
                    {label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
