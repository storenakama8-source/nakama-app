"use client";

import { motion } from "framer-motion";
import { Leaf, Shield, Ruler, Star, Truck, Package, CheckCircle, Droplets } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { PageShell } from "@/components/shared/PageShell";
import { SectionHeader } from "@/components/shared/SectionHeader";

const SPECS = [
  { Icon: Leaf,    label: "MATERIAL",  value: "Decorative Wood",   note: "Shaped and finished for visual display" },
  { Icon: Star,    label: "FINISH",    value: "Lacquered Detail",  note: "Smooth lacquered surface with elegant detail work" },
  { Icon: Shield,  label: "PURPOSE",   value: "Display Only",      note: "Crafted exclusively for room decoration and collection" },
  { Icon: Ruler,   label: "LENGTH",    value: "103 cm",            note: "Full-size decorative katana proportions" },
  { Icon: Package, label: "PACKAGING", value: "Secure & Premium",  note: "Delivered safely in protective packaging" },
  { Icon: Truck,   label: "DELIVERY",  value: "Free Across Morocco", note: "Delivered to your door at no extra cost" },
];

const CARE = [
  { Icon: Droplets,     tip: "Keep dry",          detail: "Avoid moisture and humidity. Do not expose to rain or wet surfaces." },
  { Icon: Leaf,         tip: "Clean gently",      detail: "Wipe with a soft dry cloth. Avoid harsh chemicals or abrasive materials." },
  { Icon: Shield,       tip: "Display safely",    detail: "Use a proper wall mount or display stand. Keep out of reach of children." },
  { Icon: CheckCircle,  tip: "Handle with care",  detail: "Hold by the handle when moving. Avoid impacts on the lacquered surface." },
];

const TRUST = [
  "Free Delivery Across Morocco",
  "Cash on Delivery",
  "Quality Check Before Shipping",
  "Secure Packaging",
];

export default function QualityPage() {
  const { theme } = useTheme();
  const isBlack = theme === "black-dragon";
  const glassBg = isBlack ? "rgba(14,14,14,0.72)" : "rgba(248,243,233,0.72)";

  return (
    <PageShell>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          minHeight: "48svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(3rem,8vw,7rem) clamp(1.5rem,5vw,4rem)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `url(/images/hero/hero-${isBlack ? "black" : "white"}-desktop.png)`,
          backgroundSize: "cover", backgroundPosition: "center", opacity: 0.14,
          transition: "opacity 0.6s ease",
        }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, backgroundColor: "var(--bg)", opacity: 0.76 }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <SectionHeader
            ar="تفاصيل الصنع"
            ja="品質"
            en="QUALITY FOR DISPLAY"
            sub="Every detail is designed for visual impact and lasting display. Decorative wood, lacquered finishes, and collector-level presentation — built to be seen."
            size="lg"
          />
        </div>
      </section>

      {/* Specs grid */}
      <section style={{ padding: "clamp(2.5rem,5vw,4.5rem) clamp(1.5rem,5vw,4rem)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "clamp(1rem,2vw,1.5rem)",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {SPECS.map(({ Icon, label, value, note }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.08 }}
              style={{
                background: glassBg,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(185,154,91,0.2)",
                borderRadius: 12,
                padding: "1.5rem",
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start",
                transition: "border-color 0.3s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(185,154,91,0.52)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(185,154,91,0.2)"; }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                border: "1px solid rgba(185,154,91,0.28)",
                backgroundColor: isBlack ? "rgba(185,154,91,0.08)" : "rgba(185,154,91,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={15} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
              </div>
              <div>
                <p style={{ color: "var(--gold)", fontSize: "0.56rem", letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.85, marginBottom: "0.2rem" }}>{label}</p>
                <p className="font-heading" style={{ color: "var(--text)", fontSize: "1.05rem", letterSpacing: "0.04em", marginBottom: "0.35rem" }}>{value}</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", lineHeight: 1.55 }}>{note}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Care instructions */}
      <section style={{ padding: "0 clamp(1.5rem,5vw,4rem) clamp(2.5rem,5vw,4.5rem)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: "clamp(1.5rem,3vw,2.5rem)" }}
          >
            <p style={{ color: "var(--gold)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.75 }}>
              CARE GUIDE
            </p>
            <h2 className="font-heading" style={{ fontSize: "clamp(1.6rem,3vw,2.5rem)", letterSpacing: "0.04em", color: "var(--text)", marginTop: "0.5rem", lineHeight: 1 }}>
              KEEP IT PERFECT
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "clamp(0.8rem,2vw,1.25rem)" }}>
            {CARE.map(({ Icon, tip, detail }, i) => (
              <motion.div
                key={tip}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                style={{
                  background: glassBg,
                  border: "1px solid rgba(185,154,91,0.16)",
                  borderRadius: 10,
                  padding: "1.25rem",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.6rem" }}>
                  <Icon size={14} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
                  <p style={{ color: "var(--gold)", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>{tip}</p>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.80rem", lineHeight: 1.6 }}>{detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section
        style={{
          borderTop: "1px solid rgba(185,154,91,0.14)",
          padding: "2rem clamp(1.5rem,5vw,4rem)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "2rem",
        }}
      >
        {TRUST.map((t) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle size={13} style={{ color: "var(--gold)", opacity: 0.7 }} />
            <span style={{ color: "var(--text-muted)", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>{t}</span>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
