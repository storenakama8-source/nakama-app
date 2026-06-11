"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, MessageCircle, LayoutGrid } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { PageShell } from "@/components/shared/PageShell";
import { site } from "@/data/site";

export default function CartPage() {
  const { theme } = useTheme();
  const isBlack = theme === "black-dragon";
  const glassBg = isBlack ? "rgba(14,14,14,0.72)" : "rgba(248,243,233,0.78)";
  const whatsappHref = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}`;

  return (
    <PageShell>
      <section
        style={{
          minHeight: "80svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(3rem,8vw,6rem) clamp(1.5rem,5vw,4rem)",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          style={{ maxWidth: 520 }}
        >
          {/* Icon */}
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            border: "1px solid rgba(185,154,91,0.28)",
            backgroundColor: isBlack ? "rgba(185,154,91,0.06)" : "rgba(185,154,91,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 2rem",
          }}>
            <ShoppingBag size={28} strokeWidth={1.3} style={{ color: "var(--gold)", opacity: 0.75 }} />
          </div>

          {/* Labels */}
          <p className="arabic-kicker" style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>
            سلة التسوق
          </p>
          <p style={{ color: "var(--gold)", opacity: 0.68, fontSize: "0.72rem", letterSpacing: "0.38em", textTransform: "uppercase", marginBottom: "1.2rem" }}>
            カート
          </p>

          <h1 className="font-heading" style={{ fontSize: "clamp(2rem,5vw,3.2rem)", lineHeight: 0.95, letterSpacing: "0.04em", color: "var(--text)", marginBottom: "1.5rem" }}>
            YOUR CART
          </h1>

          <div style={{ width: 40, height: 1, backgroundColor: "var(--gold)", opacity: 0.3, margin: "0 auto 1.5rem" }} />

          {/* Empty state card */}
          <div style={{
            background: glassBg,
            border: "1px solid rgba(185,154,91,0.2)",
            borderRadius: 14,
            padding: "2rem",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            marginBottom: "2rem",
          }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1rem" }}>
              Your cart is currently empty.
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.65, opacity: 0.8 }}>
              Orders are confirmed by direct contact. No online payment required.
              Browse the collection and reach us on WhatsApp to place your order — we&apos;ll confirm and deliver to you across Morocco.
            </p>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <Link
              href="/catalogue"
              className="flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                height: 50, borderRadius: 8,
                backgroundColor: "var(--gold)", color: "var(--bg)",
                fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = ""; }}
            >
              <LayoutGrid size={13} />
              VIEW CATALOGUE
            </Link>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                height: 50, borderRadius: 8,
                border: "1px solid rgba(185,154,91,0.4)", color: "var(--gold)",
                fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase",
              }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "var(--gold)"; el.style.color = "var(--bg)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "transparent"; el.style.color = "var(--gold)"; }}
            >
              <MessageCircle size={13} />
              ORDER ON WHATSAPP
            </a>
          </div>

          <p style={{ color: "var(--text-muted)", fontSize: "0.68rem", marginTop: "1.5rem", opacity: 0.45, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Free delivery · Cash on delivery · Morocco only
          </p>
        </motion.div>
      </section>
    </PageShell>
  );
}
