"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, MessageCircle, LayoutGrid, Phone } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { site } from "@/data/site";

function fmtAmount(n: number): string {
  return n.toLocaleString("en-US");
}

const PRODUCT_LABELS: Record<string, { en: string; ar: string; ja: string }> = {
  "black-dragon": { en: "Black Dragon", ar: "التنين الأسود", ja: "黒い龍" },
  "white-dragon": { en: "White Dragon", ar: "التنين الأبيض", ja: "白い龍" },
};

function ThankYouContent() {
  const params  = useSearchParams();
  const { theme } = useTheme();
  const isBlack = theme === "black-dragon";

  const orderId  = params.get("orderId")  ?? `NK-${Date.now()}`;
  const name     = params.get("name")     ?? "Customer";
  const product  = params.get("product")  ?? "black-dragon";
  const qty      = parseInt(params.get("qty") ?? "1", 10);
  const totalRaw = parseInt(params.get("total") ?? "1399", 10);

  const labels = PRODUCT_LABELS[product] ?? PRODUCT_LABELS["black-dragon"];

  const waMsg  = encodeURIComponent(
    `🗡️ *Order Confirmation — Nakama Store Morocco*\n\nOrder ID: ${orderId}\nProduct: ${labels.en}\nQty: ${qty}\nTotal: ${fmtAmount(totalRaw)} DH\n\nPlease confirm my order. شكراً!`
  );
  const waHref = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${waMsg}`;

  const glassBg   = isBlack ? "rgba(14,14,14,0.80)" : "rgba(247,242,232,0.88)";
  const bgKey     = product === "white-dragon" ? "white" : "black";

  const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const item:    Variants = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } } };

  return (
    <div style={{ minHeight: "100svh", backgroundColor: "var(--bg)", position: "relative", overflow: "hidden" }}>

      {/* Background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src={`/images/hero/hero-${bgKey}-desktop.png`}
          alt=""
          aria-hidden
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: isBlack
            ? "rgba(0,0,0,0.72)"
            : "rgba(248,243,235,0.82)",
        }} />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "clamp(2rem,6vw,5rem) clamp(1.25rem,5vw,3rem)" }}>
        <motion.div
          variants={stagger} initial="hidden" animate="visible"
          style={{ maxWidth: 620, width: "100%", display: "flex", flexDirection: "column", gap: "1.75rem" }}
        >
          {/* Check icon */}
          <motion.div variants={item} style={{ display: "flex", justifyContent: "center" }}>
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
              style={{
                width: 80, height: 80, borderRadius: "50%",
                border: "2px solid var(--gold)",
                background: "radial-gradient(circle at center, rgba(185,154,91,0.18) 0%, transparent 70%)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <CheckCircle2 size={36} strokeWidth={1.5} style={{ color: "var(--gold)" }} />
            </motion.div>
          </motion.div>

          {/* Heading */}
          <motion.div variants={item} style={{ textAlign: "center" }}>
            <p className="arabic-kicker" style={{ fontSize: "clamp(1.5rem,4vw,2rem)", marginBottom: 6 }}>
              {labels.ar}
            </p>
            <h1 className="font-heading uppercase" style={{ fontSize: "clamp(2rem,5vw,3rem)", letterSpacing: "0.06em", lineHeight: 1, color: "var(--text)", marginBottom: 10 }}>
              ORDER CONFIRMED
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.6 }}>
              Thank you, <strong style={{ color: "var(--text)" }}>{name}</strong>. Your order has been received and will be confirmed by phone shortly.
            </p>
          </motion.div>

          {/* Order card */}
          <motion.div variants={item}
            style={{ borderRadius: 16, border: "1px solid rgba(185,154,91,0.22)", backgroundColor: glassBg, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>

            <p style={{ fontSize: "0.46rem", letterSpacing: "0.36em", color: "var(--gold)", opacity: 0.65, textTransform: "uppercase" }}>
              ORDER DETAILS
            </p>

            {[
              { label: "Order ID",  value: String(orderId)          },
              { label: "Product",   value: `${labels.en} — ${labels.ja}` },
              { label: "Quantity",  value: `${qty} unit${qty > 1 ? "s" : ""}` },
              { label: "Total",     value: `${fmtAmount(totalRaw)} DH`   },
              { label: "Delivery",  value: "Free · Across Morocco"   },
              { label: "Payment",   value: "Cash on delivery"         },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.72rem", letterSpacing: "0.08em", flexShrink: 0 }}>{label}</span>
                <span style={{ color: "var(--text)", fontSize: "0.82rem", textAlign: "right" }}>{value}</span>
              </div>
            ))}

            <div style={{ height: 1, backgroundColor: "rgba(185,154,91,0.16)" }} />

            <p style={{ color: "var(--text-muted)", fontSize: "0.68rem", lineHeight: 1.6, opacity: 0.72 }}>
              Our team will call you within <strong style={{ color: "var(--text)" }}>24 hours</strong> to confirm delivery details. You can also reach us on WhatsApp below.
            </p>
          </motion.div>

          {/* CTA buttons */}
          <motion.div variants={item} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <a
              href={waHref}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                height: 52, borderRadius: 12,
                backgroundColor: "#25D366", color: "#fff",
                fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <MessageCircle size={16} strokeWidth={1.8} />
              FOLLOW UP ON WHATSAPP
            </a>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
              <Link href="/catalogue"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  height: 46, borderRadius: 10,
                  border: "1px solid rgba(185,154,91,0.36)", color: "var(--gold)",
                  fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase",
                  backgroundColor: "rgba(185,154,91,0.08)", backdropFilter: "blur(6px)",
                  textDecoration: "none",
                }}
              >
                <LayoutGrid size={13} strokeWidth={1.5} /> CATALOGUE
              </Link>
              <Link href="/contact"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  height: 46, borderRadius: 10,
                  border: "1px solid rgba(185,154,91,0.36)", color: "var(--gold)",
                  fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase",
                  backgroundColor: "rgba(185,154,91,0.08)", backdropFilter: "blur(6px)",
                  textDecoration: "none",
                }}
              >
                <Phone size={13} strokeWidth={1.5} /> CONTACT US
              </Link>
            </div>
          </motion.div>

          {/* Footer note */}
          <motion.p variants={item} style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.6rem", opacity: 0.45, letterSpacing: "0.1em" }}>
            NAKAMA STORE MOROCCO · FOR DECORATION ONLY · نكاما ستور المغرب
          </motion.p>

        </motion.div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100svh", backgroundColor: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--gold)", fontSize: "0.6rem", letterSpacing: "0.3em", opacity: 0.5 }}>LOADING…</p>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
