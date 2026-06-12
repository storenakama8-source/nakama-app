"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Phone, MapPin, Building2,
  Minus, Plus, Loader2,
  ShieldCheck, Truck, CreditCard, Package,
} from "lucide-react";
import type { WCProduct } from "@/lib/woocommerce";
import { formatPrice } from "@/lib/woocommerce";
import { useTheme } from "@/components/providers/ThemeProvider";

/* ── helpers ─────────────────────────────────────────────── */
const NAMES: Record<string, { en: string; ar: string; ja: string }> = {
  "black-dragon": { en: "BLACK DRAGON", ar: "التنين الأسود", ja: "黒い龍" },
  "white-dragon": { en: "WHITE DRAGON", ar: "التنين الأبيض", ja: "白い龍" },
};

function parsePrice(raw: string | null | undefined): number {
  const s = formatPrice(raw);
  if (!s) return 1399;
  return parseInt(s.replace(/[^0-9]/g, ""), 10) || 1399;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

/* ── FormField ───────────────────────────────────────────── */
function FormField({
  label, Icon, type = "text", value, onChange, error, placeholder, autoComplete,
}: {
  label: string; Icon: React.ElementType; type?: string;
  value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string; autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label style={{ fontSize: "0.5rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold)", opacity: focused ? 1 : 0.72, transition: "opacity .2s" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <Icon size={14} strokeWidth={1.5} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: focused ? "var(--gold)" : "var(--text-muted)", transition: "color .2s", pointerEvents: "none" }} />
        <input
          type={type} value={value} placeholder={placeholder} autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%", height: 50, paddingLeft: 40, paddingRight: 14, borderRadius: 10,
            border: error ? "1.5px solid #ef4444" : focused ? "1.5px solid var(--gold)" : "1px solid rgba(185,154,91,0.24)",
            backgroundColor: focused ? "rgba(185,154,91,0.06)" : "rgba(185,154,91,0.03)",
            color: "var(--text)", fontSize: "0.9rem", outline: "none",
            transition: "border-color .2s, background .2s",
            fontFamily: "var(--font-inter, sans-serif)",
          }}
        />
      </div>
      {error && <p style={{ fontSize: "0.58rem", color: "#ef4444" }}>{error}</p>}
    </div>
  );
}

/* ── Component ───────────────────────────────────────────── */
interface Props { slug: string; wcProduct: WCProduct | null; initialQty?: number; }

export default function CheckoutClient({ slug, wcProduct, initialQty = 1 }: Props) {
  const router    = useRouter();
  const { theme } = useTheme();
  const isBlack   = theme === "black-dragon";
  const names   = NAMES[slug] ?? NAMES["black-dragon"];
  const unit    = parsePrice(wcProduct?.price);
  const imgSrc  = wcProduct?.image?.sourceUrl ?? null;

  const [fullName, setFullName] = useState("");
  const [phone,    setPhone]    = useState("");
  const [city,     setCity]     = useState("");
  const [address,  setAddress]  = useState("");
  const [qty,      setQty]      = useState(initialQty);
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [loading,  setLoading]  = useState(false);
  const [apiErr,   setApiErr]   = useState("");

  const total = useMemo(() => unit * qty, [unit, qty]);

  function validate() {
    const e: Record<string, string> = {};
    if (fullName.trim().length < 2) e.fullName = "Required.";
    if (phone.trim().length < 9)    e.phone    = "Enter a valid number.";
    if (city.trim().length < 2)     e.city     = "Required.";
    if (address.trim().length < 5)  e.address  = "Enter your full address.";
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setApiErr("");
    try {
      const res  = await fetch("/api/order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body:   JSON.stringify({ model: slug, quantity: qty, fullName, phone, city, address }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setApiErr(data.error ?? "Something went wrong."); return; }
      router.push(`/thank-you?orderId=${data.orderId}&name=${encodeURIComponent(fullName)}&product=${slug}&qty=${qty}&total=${total}`);
    } catch { setApiErr("Network error. Please try again."); }
    finally  { setLoading(false); }
  }

  /* design tokens */
  const bg          = isBlack ? "#050505" : "#F7F2E8";
  const cardBg      = isBlack ? "rgba(18,18,18,0.95)"    : "rgba(255,252,245,0.96)";
  const cardBorder  = "rgba(185,154,91,0.22)";
  const sectionLine = "rgba(185,154,91,0.12)";
  const summaryBg   = isBlack ? "rgba(185,154,91,0.06)"  : "rgba(185,154,91,0.09)";
  const imgFilter   = isBlack
    ? "drop-shadow(0 24px 48px rgba(0,0,0,.70)) drop-shadow(0 0 18px rgba(185,154,91,.12))"
    : "drop-shadow(0 18px 36px rgba(95,65,30,.24))";

  return (
    <div style={{ minHeight: "100svh", backgroundColor: bg, transition: "background .4s", paddingTop: "76px" }}>

      {/* ── main ── */}
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "clamp(1.5rem,4vh,3rem) clamp(1rem,4vw,2rem)" }}>
        <form onSubmit={submit} noValidate>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}
            className="lg:grid-cols-[1fr_380px]">

            {/* ════ LEFT — form card ════ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              style={{ borderRadius: 18, border: `1px solid ${cardBorder}`, backgroundColor: cardBg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", overflow: "hidden" }}
            >
              {/* Section: Contact */}
              <div style={{ padding: "1.75rem 1.75rem 1.5rem" }}>
                <p style={{ fontSize: "0.5rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.72, marginBottom: "1.25rem" }}>
                  CONTACT INFORMATION
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
                  className="sm:grid-cols-2 grid-cols-1">
                  <FormField label="Full Name"    Icon={User}  value={fullName} onChange={setFullName} error={errors.fullName} placeholder="Younes"      autoComplete="name" />
                  <FormField label="Phone Number" Icon={Phone} value={phone}    onChange={setPhone}    error={errors.phone}    placeholder="+212 6XX XXX XXX"   autoComplete="tel" type="tel" />
                </div>
              </div>

              <div style={{ height: 1, backgroundColor: sectionLine, margin: "0 1.75rem" }} />

              {/* Section: Delivery */}
              <div style={{ padding: "1.5rem 1.75rem 1.75rem" }}>
                <p style={{ fontSize: "0.5rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.72, marginBottom: "1.25rem" }}>
                  DELIVERY INFORMATION
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
                  className="sm:grid-cols-2 grid-cols-1">
                  <FormField label="City"             Icon={Building2} value={city}    onChange={setCity}    error={errors.city}    placeholder="Casablanca"               autoComplete="address-level2" />
                  <FormField label="Delivery Address" Icon={MapPin}    value={address} onChange={setAddress} error={errors.address} placeholder="123 Rue Example, Appt 4" autoComplete="street-address" />
                </div>
              </div>

              <div style={{ height: 1, backgroundColor: sectionLine }} />

              {/* Section: Quantity */}
              <div style={{ padding: "1.5rem 1.75rem 1.75rem" }}>
                <p style={{ fontSize: "0.5rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.72, marginBottom: "1.25rem" }}>
                  QUANTITY
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "1.75rem", flexWrap: "wrap" }}>

                  {/* Stepper */}
                  <div style={{ display: "inline-flex", alignItems: "center", border: `1px solid rgba(185,154,91,0.32)`, borderRadius: 12, overflow: "hidden" }}>
                    <button type="button" onClick={() => setQty((q) => Math.max(q - 1, 1))} disabled={qty <= 1}
                      style={{ width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", border: "none", borderRight: `1px solid rgba(185,154,91,0.2)`, backgroundColor: "transparent", color: qty <= 1 ? "rgba(185,154,91,0.28)" : "var(--gold)", cursor: qty <= 1 ? "default" : "pointer", transition: "background .2s" }}
                      onMouseEnter={(e) => { if (qty > 1) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(185,154,91,0.1)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                    >
                      <Minus size={17} strokeWidth={2} />
                    </button>
                    <div style={{ minWidth: 68, height: 52, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                      <AnimatePresence mode="wait">
                        <motion.span key={qty}
                          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="font-heading"
                          style={{ display: "block", fontSize: "1.6rem", lineHeight: 1, color: "var(--text)" }}
                        >
                          {qty}
                        </motion.span>
                      </AnimatePresence>
                      <span style={{ fontSize: "0.42rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", opacity: 0.5 }}>
                        {qty === 1 ? "UNIT" : "UNITS"}
                      </span>
                    </div>
                    <button type="button" onClick={() => setQty((q) => Math.min(q + 1, 20))} disabled={qty >= 20}
                      style={{ width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", border: "none", borderLeft: `1px solid rgba(185,154,91,0.2)`, backgroundColor: "transparent", color: qty >= 20 ? "rgba(185,154,91,0.28)" : "var(--gold)", cursor: qty >= 20 ? "default" : "pointer", transition: "background .2s" }}
                      onMouseEnter={(e) => { if (qty < 20) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(185,154,91,0.1)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                    >
                      <Plus size={17} strokeWidth={2} />
                    </button>
                  </div>

                  {/* Live total */}
                  <div>
                    <p style={{ fontSize: "0.44rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.6, marginBottom: 3 }}>
                      ORDER TOTAL
                    </p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <AnimatePresence mode="wait">
                        <motion.span key={total}
                          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="font-heading"
                          style={{ fontSize: "2.2rem", lineHeight: 1, color: "var(--text)" }}
                        >
                          {fmt(total)}
                        </motion.span>
                      </AnimatePresence>
                      <span style={{ color: "var(--gold)", fontSize: "0.62rem", letterSpacing: "0.2em" }}>DH</span>
                    </div>
                    {qty > 1 && (
                      <p style={{ fontSize: "0.58rem", color: "var(--text-muted)", opacity: 0.55, marginTop: 2 }}>
                        {fmt(unit)} DH × {qty}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ height: 1, backgroundColor: sectionLine }} />

              {/* CTA */}
              <div style={{ padding: "1.5rem 1.75rem" }}>
                {apiErr && (
                  <p style={{ fontSize: "0.7rem", color: "#ef4444", marginBottom: "1rem", padding: "0.6rem 0.9rem", borderRadius: 8, border: "1px solid rgba(239,68,68,0.24)", backgroundColor: "rgba(239,68,68,0.06)" }}>
                    {apiErr}
                  </p>
                )}
                <button type="submit" disabled={loading}
                  style={{
                    width: "100%", height: 54, borderRadius: 12, border: "none",
                    backgroundColor: loading ? "rgba(185,154,91,0.5)" : "var(--gold)",
                    color: "var(--bg)", fontSize: "0.68rem", letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 700,
                    cursor: loading ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    transition: "filter .25s",
                    fontFamily: "var(--font-inter, sans-serif)",
                    boxShadow: loading ? "none" : "0 4px 24px rgba(185,154,91,0.24)",
                  }}
                  onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = ""; }}
                >
                  {loading
                    ? <><Loader2 size={17} strokeWidth={2} className="animate-spin" /> PLACING ORDER…</>
                    : <>CONFIRM ORDER  →</>
                  }
                </button>

                {/* Trust row */}
                <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
                  {([
                    [ShieldCheck, "Secure"],
                    [Truck,       "Free delivery"],
                    [CreditCard,  "Cash on delivery"],
                    [Package,     "Packaged safely"],
                  ] as const).map(([Icon, label]) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Icon size={11} strokeWidth={1.5} style={{ color: "var(--gold)", opacity: 0.45 }} />
                      <span style={{ fontSize: "0.58rem", color: "var(--text-muted)", opacity: 0.55 }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ════ RIGHT — order summary card ════ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Product card */}
              <div style={{ borderRadius: 18, border: `1px solid ${cardBorder}`, backgroundColor: cardBg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", overflow: "hidden" }}>

                {/* Image zone */}
                <div style={{
                  position: "relative", height: 220, overflow: "hidden",
                  background: isBlack
                    ? "linear-gradient(180deg, #0d0d0d 0%, #111108 100%)"
                    : "linear-gradient(180deg, #f0e8d4 0%, #e8dcc8 100%)",
                }}>
                  {/* Subtle bg */}
                  <div style={{ position: "absolute", inset: 0, backgroundImage: `url(/images/hero/hero-${isBlack ? "black" : "white"}-desktop.png)`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.18 }} />
                  {imgSrc ? (
                    <img src={imgSrc} alt={names.en} style={{
                      position: "absolute", bottom: -10, left: "50%", transform: "translateX(-50%)",
                      height: 210, width: "auto", objectFit: "contain", filter: imgFilter,
                    }} />
                  ) : (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <p style={{ color: "var(--gold)", opacity: 0.28, fontSize: "0.56rem", letterSpacing: "0.24em" }}>IMAGE</p>
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div style={{ padding: "1.25rem 1.5rem" }}>
                  <p className="arabic-kicker" style={{ fontSize: "1.45rem", marginBottom: 2 }}>{names.ar}</p>
                  <p style={{ fontSize: "0.58rem", letterSpacing: "0.3em", color: "var(--gold)", opacity: 0.65, marginBottom: 6 }}>{names.ja}</p>
                  <p className="font-heading" style={{ fontSize: "1.05rem", letterSpacing: "0.08em", color: "var(--text)" }}>{names.en}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.7rem", marginTop: 4, opacity: 0.65 }}>
                    {fmt(unit)} DH / unit · Decorative wood · 103 cm
                  </p>
                </div>
              </div>

              {/* Order summary */}
              <div style={{ borderRadius: 16, border: `1px solid ${cardBorder}`, backgroundColor: cardBg, padding: "1.25rem 1.5rem" }}>
                <p style={{ fontSize: "0.46rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.62, marginBottom: "1rem" }}>
                  ORDER SUMMARY
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "0.9rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      {names.en} × {qty}
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.span key={total}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ color: "var(--text)", fontSize: "0.8rem" }}
                      >
                        {fmt(total)} DH
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Delivery</span>
                    <span style={{ color: "#22c55e", fontSize: "0.8rem", fontWeight: 600 }}>FREE</span>
                  </div>
                </div>

                <div style={{ height: 1, backgroundColor: sectionLine, marginBottom: "0.9rem" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ color: "var(--gold)", fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>TOTAL</span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                    <AnimatePresence mode="wait">
                      <motion.span key={total}
                        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="font-heading"
                        style={{ fontSize: "1.9rem", color: "var(--text)", lineHeight: 1 }}
                      >
                        {fmt(total)}
                      </motion.span>
                    </AnimatePresence>
                    <span style={{ color: "var(--gold)", fontSize: "0.58rem", letterSpacing: "0.2em" }}>DH</span>
                  </div>
                </div>
              </div>

              {/* Payment note */}
              <div style={{ borderRadius: 12, border: `1px solid ${cardBorder}`, backgroundColor: summaryBg, padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {([
                  [Truck,       "Free delivery across Morocco"],
                  [CreditCard,  "Cash on delivery — no online payment"],
                  [Package,     "Secure & premium packaging"],
                ] as const).map(([Icon, label]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(185,154,91,0.28)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={12} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </form>
      </div>
    </div>
  );
}
