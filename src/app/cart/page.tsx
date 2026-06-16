"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Minus, Plus, Trash2, LayoutGrid } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useCart } from "@/components/providers/CartProvider";

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

export default function CartPage() {
  const { theme } = useTheme();
  const { items, totalCount, updateQty, removeFromCart, clearCart } = useCart();
  const isBlack = theme === "black-dragon";

  const cardBg     = isBlack ? "rgba(18,18,18,0.95)"   : "rgba(255,252,245,0.96)";
  const cardBorder = "rgba(185,154,91,0.22)";
  const divider    = "rgba(185,154,91,0.12)";
  const grandTotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const blackItem = items.find((i) => i.slug === "black-dragon");
  const whiteItem = items.find((i) => i.slug === "white-dragon");
  const checkoutParts: string[] = [];
  if (blackItem) checkoutParts.push(`black=${blackItem.qty}`);
  if (whiteItem) checkoutParts.push(`white=${whiteItem.qty}`);
  const checkoutHref = `/checkout${checkoutParts.length ? "?" + checkoutParts.join("&") : ""}`;

  return (
    <div style={{ minHeight: "100svh", backgroundColor: "var(--bg)", paddingTop: "76px", transition: "background .4s" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "clamp(2rem,5vh,3.5rem) clamp(1rem,4vw,2rem)" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.5rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.65, marginBottom: 6 }}>
            سلة التسوق · カート
          </p>
          <h1 className="font-heading" style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", letterSpacing: "0.06em", color: "var(--text)", lineHeight: 1 }}>
            YOUR CART
          </h1>
        </motion.div>

        {/* Empty state */}
        {items.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
            style={{ borderRadius: 18, border: `1px solid ${cardBorder}`, backgroundColor: cardBg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", padding: "3.5rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", border: "1px solid rgba(185,154,91,0.28)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(185,154,91,0.06)" }}>
              <ShoppingBag size={26} strokeWidth={1.3} style={{ color: "var(--gold)", opacity: 0.65 }} />
            </div>
            <p className="font-heading" style={{ fontSize: "1.1rem", letterSpacing: "0.1em", color: "var(--text)" }}>
              YOUR CART IS EMPTY
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.65, maxWidth: 360, opacity: 0.75 }}>
              Browse the collection and add a katana to your cart.
            </p>
            <Link href="/catalogue"
              style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 8, height: 46, padding: "0 24px", borderRadius: 8, backgroundColor: "var(--gold)", color: "var(--bg)", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, textDecoration: "none" }}>
              <LayoutGrid size={14} strokeWidth={1.5} /> VIEW CATALOGUE
            </Link>
          </motion.div>
        )}

        {/* Items */}
        {items.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div key={item.slug}
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ borderRadius: 16, border: `1px solid ${cardBorder}`, backgroundColor: cardBg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", overflow: "hidden" }}
                >
                  <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>

                    {/* Product image */}
                    <div style={{
                      width: 110, flexShrink: 0, position: "relative",
                      background: item.slug === "black-dragon"
                        ? "linear-gradient(180deg,#0d0d0d,#111108)"
                        : "linear-gradient(180deg,#f0e8d4,#e8dcc8)",
                    }}>
                      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(/images/hero/hero-${item.slug === "black-dragon" ? "black" : "white"}-desktop.png)`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15 }} />
                      {item.image ? (
                        <img src={item.image} alt={item.name}
                          style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", height: "90%", width: "auto", objectFit: "contain",
                            filter: item.slug === "black-dragon"
                              ? "drop-shadow(0 8px 24px rgba(0,0,0,.7))"
                              : "drop-shadow(0 8px 18px rgba(95,65,30,.3))" }} />
                      ) : (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <ShoppingBag size={22} strokeWidth={1} style={{ color: "var(--gold)", opacity: 0.3 }} />
                        </div>
                      )}
                    </div>

                    {/* Info + controls */}
                    <div style={{ flex: 1, padding: "1.25rem 1.25rem 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <div>
                          <p className="arabic-kicker" style={{ fontSize: "1.1rem", lineHeight: 1 }}>{item.nameAr}</p>
                          <p style={{ fontSize: "0.46rem", letterSpacing: "0.28em", color: "var(--gold)", opacity: 0.6, marginTop: 2 }}>{item.nameJa}</p>
                          <p className="font-heading" style={{ fontSize: "0.9rem", letterSpacing: "0.08em", color: "var(--text)", marginTop: 4 }}>{item.name}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.slug)}
                          style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(185,154,91,0.2)", backgroundColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)", opacity: 0.5, transition: "all .2s" }}
                          onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.opacity = "1"; el.style.borderColor = "rgba(239,68,68,0.5)"; el.style.color = "#ef4444"; }}
                          onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.opacity = "0.5"; el.style.borderColor = "rgba(185,154,91,0.2)"; el.style.color = "var(--text-muted)"; }}
                        >
                          <Trash2 size={13} strokeWidth={1.5} />
                        </button>
                      </div>

                      <div style={{ height: 1, backgroundColor: divider }} />

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                        {/* Stepper */}
                        <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid rgba(185,154,91,0.28)", borderRadius: 8, overflow: "hidden" }}>
                          <button onClick={() => updateQty(item.slug, item.qty - 1)} disabled={item.qty <= 1}
                            style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: "none", borderRight: "1px solid rgba(185,154,91,0.18)", backgroundColor: "transparent", color: item.qty <= 1 ? "rgba(185,154,91,0.28)" : "var(--gold)", cursor: item.qty <= 1 ? "default" : "pointer" }}>
                            <Minus size={13} strokeWidth={2} />
                          </button>
                          <span className="font-heading" style={{ minWidth: 36, textAlign: "center", fontSize: "1.1rem", color: "var(--text)" }}>
                            {item.qty}
                          </span>
                          <button onClick={() => updateQty(item.slug, item.qty + 1)} disabled={item.qty >= 20}
                            style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: "none", borderLeft: "1px solid rgba(185,154,91,0.18)", backgroundColor: "transparent", color: item.qty >= 20 ? "rgba(185,154,91,0.28)" : "var(--gold)", cursor: item.qty >= 20 ? "default" : "pointer" }}>
                            <Plus size={13} strokeWidth={2} />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: "0.44rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.6 }}>SUBTOTAL</p>
                          <p className="font-heading" style={{ fontSize: "1.3rem", lineHeight: 1, color: "var(--text)" }}>
                            {fmt(item.price * item.qty)} <span style={{ fontSize: "0.54rem", color: "var(--gold)", letterSpacing: "0.18em" }}>DH</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Summary footer */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              style={{ borderRadius: 16, border: `1px solid ${cardBorder}`, backgroundColor: cardBg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", padding: "1.25rem 1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <p style={{ fontSize: "0.46rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.62, marginBottom: 4 }}>
                    {totalCount} {totalCount === 1 ? "ITEM" : "ITEMS"} · FREE DELIVERY
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: "0.56rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.72 }}>TOTAL</span>
                    <AnimatePresence mode="wait">
                      <motion.span key={grandTotal}
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="font-heading"
                        style={{ fontSize: "2rem", lineHeight: 1, color: "var(--text)" }}>
                        {fmt(grandTotal)}
                      </motion.span>
                    </AnimatePresence>
                    <span style={{ color: "var(--gold)", fontSize: "0.62rem", letterSpacing: "0.2em" }}>DH</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", alignItems: "center" }}>
                  <button onClick={clearCart}
                    title="Vider le panier"
                    style={{ width: 40, height: 40, borderRadius: 8, border: "1px solid rgba(239,68,68,0.25)", backgroundColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(239,68,68,0.5)", transition: "all .2s", flexShrink: 0 }}
                    onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "rgba(239,68,68,0.08)"; el.style.borderColor = "rgba(239,68,68,0.5)"; el.style.color = "#ef4444"; }}
                    onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = "transparent"; el.style.borderColor = "rgba(239,68,68,0.25)"; el.style.color = "rgba(239,68,68,0.5)"; }}
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                  <Link href="/catalogue"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 40, padding: "0 20px", borderRadius: 8, border: "1px solid rgba(185,154,91,0.45)", color: "var(--gold)", fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none" }}>
                    <LayoutGrid size={12} /> BROWSE MORE
                  </Link>
                  <Link href={checkoutHref}
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 40, padding: "0 24px", borderRadius: 8, backgroundColor: "var(--gold)", color: "var(--bg)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = ""; }}
                  >
                    Valider la commande
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
