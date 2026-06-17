"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";

/* ══════════════════════════════════════════════════════════════
   SHARED CONSTANTS
══════════════════════════════════════════════════════════════ */
const GOLD       = "rgba(185,154,91,1)";
const GOLD_DIM   = "rgba(185,154,91,0.7)";
const GOLD_FAINT = "rgba(185,154,91,0.3)";
const MARQUEE    = "NAKAMA · DECORATIVE KATANA · MOROCCO · 1,399 DH · FREE DELIVERY · CASH ON DELIVERY · ";

/* ══════════════════════════════════════════════════════════════
   HOOK — canvas particle system
══════════════════════════════════════════════════════════════ */
function useParticles(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; r: number; s: number; o: number; d: number };
    const pts: P[] = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.7 + 0.3,
      s: Math.random() * 0.45 + 0.1,
      o: Math.random() * 0.5 + 0.08,
      d: (Math.random() - 0.5) * 0.22,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(185,154,91,${p.o})`;
        ctx.fill();
        p.y -= p.s;
        p.x += p.d;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
        if (p.x < 0)           p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [ref]);
}

/* ══════════════════════════════════════════════════════════════
   HERO 1 — NEBULA
   Canvas dust particles · character-by-character heading reveal
   · hero bg image faded right · bottom stats row
══════════════════════════════════════════════════════════════ */
function HeroNebula() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticles(canvasRef);
  const heading = "BLACK DRAGON";

  const wipe: Variants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
  };
  const fadeUp = (delay = 0): Variants => ({
    hidden:  { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut", delay } },
  });
  const charVar: Variants = {
    hidden:  { opacity: 0, y: 55, rotateX: -90 },
    visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#020202" }}>
      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }} />

      {/* Radial glow */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 65% at 62% 50%, rgba(185,154,91,0.07) 0%, transparent 68%)" }} />

      {/* Right hero image — faded, masked */}
      <div aria-hidden style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: "58%", zIndex: 1,
        backgroundImage: "url(/images/hero/hero-black-desktop.png)",
        backgroundSize: "cover", backgroundPosition: "left center", opacity: 0.38,
        maskImage: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.85) 38%)",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.85) 38%)",
      }} />

      {/* Left text content */}
      <div style={{
        position: "relative", zIndex: 10, height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 clamp(1.5rem,6vw,5rem)",
      }}>
        <motion.div initial="hidden" animate="visible" variants={wipe}
          style={{ display: "flex", flexDirection: "column", gap: "clamp(0.55rem,1.4vh,0.9rem)" }}>

          {/* Kicker */}
          <motion.p variants={fadeUp()} style={{ color: GOLD_DIM, fontSize: "0.5rem", letterSpacing: "0.45em", textTransform: "uppercase" }}>
            NAKAMA STORE · MOROCCO
          </motion.p>

          {/* Arabic */}
          <motion.p variants={fadeUp(0.05)} className="arabic-kicker"
            style={{ fontSize: "clamp(1.7rem,3.2vw,2.7rem)", lineHeight: 1 }}>
            التنين الأسود
          </motion.p>

          {/* Big character-split heading */}
          <div style={{ perspective: 700, overflow: "hidden" }}>
            <motion.div initial="hidden" animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.038, delayChildren: 0.32 } } }}>
              {heading.split("").map((c, i) => (
                <motion.span key={i} variants={charVar} className="font-heading"
                  style={{
                    display: "inline-block",
                    fontSize: "clamp(2.8rem,6.2vw,5.4rem)", lineHeight: 0.88,
                    letterSpacing: "0.03em", color: "#F4F1EA",
                    marginRight: c === " " ? "0.34em" : 0,
                  }}>
                  {c === " " ? " " : c}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Divider + Japanese */}
          <motion.div variants={{ hidden: { opacity: 0, scaleX: 0 }, visible: { opacity: 1, scaleX: 1, transition: { duration: 0.85 } } }}
            style={{ transformOrigin: "left", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ height: 1, width: 36, background: GOLD_DIM }} />
            <span style={{ color: GOLD_DIM, fontSize: "0.46rem", letterSpacing: "0.3em" }}>黒い龍 · POWER · MYSTERY · SHADOW</span>
          </motion.div>

          {/* Description */}
          <motion.p variants={fadeUp(0.1)} style={{ color: "rgba(244,241,234,0.58)", fontSize: "clamp(0.78rem,1.3vw,0.92rem)", lineHeight: 1.75, maxWidth: 400 }}>
            A decorative wooden katana created for bold interiors, collectors,
            anime fans, and gaming setups. Dark, mysterious, made to stand out.
          </motion.p>

          {/* Price + CTAs */}
          <motion.div variants={fadeUp(0.12)} style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap", marginTop: "0.2rem" }}>
            <div>
              <p style={{ fontSize: "0.38rem", letterSpacing: "0.28em", color: "rgba(185,154,91,0.42)", textTransform: "uppercase", marginBottom: 2 }}>FROM</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span className="font-heading" style={{ fontSize: "clamp(1.7rem,2.8vw,2.2rem)", color: "#F4F1EA", lineHeight: 1 }}>1,399</span>
                <span style={{ color: GOLD_DIM, fontSize: "0.55rem", letterSpacing: "0.18em" }}>DH</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Link href="/catalogue" onClick={(e) => e.stopPropagation()} style={{ display: "inline-flex", alignItems: "center", height: 46, padding: "0 24px", borderRadius: 8, backgroundColor: GOLD, color: "#050505", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none" }}>
                ORDER NOW
              </Link>
              <Link href="/product/black-dragon" onClick={(e) => e.stopPropagation()} style={{ display: "inline-flex", alignItems: "center", height: 46, padding: "0 20px", borderRadius: 8, border: `1px solid ${GOLD_FAINT}`, color: GOLD_DIM, fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none" }}>
                VIEW DETAILS
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.5 }}
          style={{ position: "absolute", bottom: "clamp(1.5rem,3.5vh,2.8rem)", left: "clamp(1.5rem,6vw,5rem)", display: "flex", gap: "clamp(1.2rem,3vw,2.5rem)" }}>
          {[["103 cm", "LENGTH"], ["1,399 DH", "PRICE"], ["FREE", "DELIVERY"], ["CASH", "ON DELIVERY"]].map(([v, l]) => (
            <div key={l}>
              <p className="font-heading" style={{ fontSize: "clamp(0.85rem,1.6vw,1.1rem)", color: "#F4F1EA" }}>{v}</p>
              <p style={{ fontSize: "0.36rem", letterSpacing: "0.24em", color: "rgba(185,154,91,0.42)", textTransform: "uppercase", marginTop: 3 }}>{l}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO 2 — DUALITY
   GSAP split-screen · hover expands chosen side · center sword line
   Mobile: stacked top/bottom
══════════════════════════════════════════════════════════════ */
function HeroDuality() {
  const leftRef     = useRef<HTMLDivElement>(null);
  const rightRef    = useRef<HTMLDivElement>(null);
  const dividerRef  = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current,    { x: "-100%", duration: 1.1, ease: "expo.out", delay: 0.05 });
      gsap.from(rightRef.current,   { x:  "100%", duration: 1.1, ease: "expo.out", delay: 0.05 });
      gsap.from(dividerRef.current, { opacity: 0, duration: 0.6, delay: 0.85 });
    });
    return () => ctx.revert();
  }, [isMobile]);

  const expandLeft = () => {
    if (isMobile) return;
    gsap.to(leftRef.current,   { width: "62%", duration: 0.6, ease: "power3.out" });
    gsap.to(rightRef.current,  { width: "38%", duration: 0.6, ease: "power3.out" });
    gsap.to(dividerRef.current,{ left: "62%",  duration: 0.6, ease: "power3.out" });
  };
  const expandRight = () => {
    if (isMobile) return;
    gsap.to(leftRef.current,   { width: "38%", duration: 0.6, ease: "power3.out" });
    gsap.to(rightRef.current,  { width: "62%", duration: 0.6, ease: "power3.out" });
    gsap.to(dividerRef.current,{ left: "38%",  duration: 0.6, ease: "power3.out" });
  };
  const reset = () => {
    if (isMobile) return;
    gsap.to(leftRef.current,   { width: "50%", duration: 0.7, ease: "power3.out" });
    gsap.to(rightRef.current,  { width: "50%", duration: 0.7, ease: "power3.out" });
    gsap.to(dividerRef.current,{ left: "50%",  duration: 0.7, ease: "power3.out" });
  };

  const panel = (side: "black" | "white") => {
    const b = side === "black";
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "clamp(1.25rem,3.5vw,3rem)" }}>
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(/images/hero/hero-${b ? "black" : "white"}-desktop.png)`,
          backgroundSize: "cover", backgroundPosition: "center", opacity: b ? 0.32 : 0.42,
        }} />
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          background: b
            ? "linear-gradient(180deg,rgba(2,2,2,0.18) 0%,rgba(2,2,2,0.88) 100%)"
            : "linear-gradient(180deg,rgba(247,242,232,0.12) 0%,rgba(247,242,232,0.92) 100%)",
        }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <p className="arabic-kicker" style={{ fontSize: "clamp(1.1rem,2.2vw,1.9rem)", marginBottom: "0.3rem", color: b ? GOLD : "rgba(185,154,91,1)" }}>
            {b ? "التنين الأسود" : "التنين الأبيض"}
          </p>
          <p style={{ color: GOLD_DIM, fontSize: "0.48rem", letterSpacing: "0.3em", marginBottom: "0.45rem" }}>{b ? "黒い龍" : "白い龍"}</p>
          <h2 className="font-heading" style={{
            fontSize: "clamp(1.7rem,3.8vw,3.2rem)", lineHeight: 0.9,
            color: b ? "#F4F1EA" : "#1a0d00", letterSpacing: "0.04em", marginBottom: "0.7rem",
          }}>
            {b ? "BLACK\nDRAGON" : "WHITE\nDRAGON"}
          </h2>
          <p style={{ color: b ? "rgba(244,241,234,0.6)" : "rgba(80,55,30,0.72)", fontSize: "clamp(0.73rem,1.1vw,0.86rem)", lineHeight: 1.65, marginBottom: "1.1rem", maxWidth: 300 }}>
            {b ? "Dark authority and bold aesthetics for anime lovers and bold interiors." : "Refined elegance and sacred aesthetics for collectors and anime lovers."}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href={`/checkout?product=${b ? "black" : "white"}-dragon`} onClick={(e) => e.stopPropagation()}
              style={{ display: "inline-flex", alignItems: "center", height: 42, padding: "0 20px", borderRadius: 8, backgroundColor: GOLD, color: "#050505", fontSize: "0.56rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none" }}>
              ORDER NOW
            </Link>
            <Link href={`/product/${b ? "black" : "white"}-dragon`} onClick={(e) => e.stopPropagation()}
              style={{ display: "inline-flex", alignItems: "center", height: 42, padding: "0 16px", borderRadius: 8, border: "1px solid rgba(185,154,91,0.45)", color: b ? GOLD_DIM : "rgba(80,55,30,0.82)", fontSize: "0.56rem", letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none" }}>
              VIEW DETAILS
            </Link>
          </div>
        </div>
        <div style={{ position: "absolute", top: "clamp(1rem,2.5vw,1.8rem)", left: "clamp(1rem,2.5vw,1.8rem)", zIndex: 3 }}>
          <span style={{ padding: "3px 12px", borderRadius: 999, border: "1px solid rgba(185,154,91,0.45)", color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.22em", textTransform: "uppercase", backgroundColor: "rgba(0,0,0,0.24)", backdropFilter: "blur(6px)" }}>
            AVAILABLE
          </span>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} onMouseLeave={reset}
      style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: isMobile ? "column" : "row", overflow: "hidden" }}>

      {/* Left — Black Dragon */}
      <div ref={leftRef} onMouseEnter={expandLeft}
        style={{ position: "relative", width: isMobile ? "100%" : "50%", height: isMobile ? "50%" : "100%", overflow: "hidden", backgroundColor: "#070707", flexShrink: 0 }}>
        {panel("black")}
      </div>

      {/* Right — White Dragon */}
      <div ref={rightRef} onMouseEnter={expandRight}
        style={{ position: "relative", width: isMobile ? "100%" : "50%", height: isMobile ? "50%" : "100%", overflow: "hidden", backgroundColor: "#F7F2E8", flexShrink: 0 }}>
        {panel("white")}
      </div>

      {/* Center divider line */}
      {!isMobile && (
        <div ref={dividerRef} style={{
          position: "absolute", left: "50%", top: 0, bottom: 0, width: 2,
          transform: "translateX(-50%)", zIndex: 20, pointerEvents: "none",
          background: "linear-gradient(180deg, transparent 0%, rgba(185,154,91,0.55) 18%, rgba(185,154,91,0.85) 50%, rgba(185,154,91,0.55) 82%, transparent 100%)",
        }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 38, height: 38, borderRadius: "50%",
            border: "1.5px solid rgba(185,154,91,0.8)",
            backgroundColor: "rgba(5,5,5,0.9)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: GOLD_DIM, fontSize: "0.95rem", lineHeight: 1 }}>⚔</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO 3 — KINETIC
   GSAP elastic stagger on NAKAMA letters (alternating solid/outline)
   · counter stats · right katana · bottom marquee
══════════════════════════════════════════════════════════════ */
function HeroKinetic() {
  const subtitleRef = useRef<HTMLDivElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".kin-letter",
        { y: -100, opacity: 0, rotationX: -90, transformOrigin: "center bottom" },
        { y: 0, opacity: 1, rotationX: 0, duration: 0.85, ease: "back.out(2)", stagger: 0.065, delay: 0.1 }
      );
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, x: -28 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.65 }
      );
      gsap.fromTo(statsRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.85 }
      );
      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.65, ease: "power2.out", delay: 1.05 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", backgroundColor: "#060606" }}>
      {/* Subtle bg texture */}
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "url(/images/hero/hero-black-desktop.png)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.05, zIndex: 0 }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, background: "radial-gradient(ellipse 55% 60% at 78% 48%, rgba(185,154,91,0.055) 0%, transparent 72%)" }} />

      {/* Right katana image */}
      <div style={{
        position: "absolute", right: "clamp(-3rem,0%,1rem)", top: "50%",
        transform: "translateY(-52%)", width: "42%", maxWidth: 460, zIndex: 1,
        backgroundImage: "url(/images/hero/hero-black-desktop.png)",
        backgroundSize: "contain", backgroundPosition: "center",
        backgroundRepeat: "no-repeat", aspectRatio: "0.68 / 1", opacity: 0.45,
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 clamp(1.5rem,5vw,4rem)" }}>

        {/* Giant NAKAMA — alternating solid / outline */}
        <div style={{ perspective: 900, display: "flex", alignItems: "flex-end", gap: "clamp(0.08rem,0.4vw,0.35rem)", marginBottom: "clamp(0.6rem,1.8vh,1.4rem)", overflow: "hidden" }}>
          {"NAKAMA".split("").map((l, i) => (
            <span key={i} className="kin-letter font-heading" style={{
              display: "inline-block",
              fontSize: "clamp(4rem,11.5vw,10rem)", lineHeight: 0.85,
              letterSpacing: "-0.02em",
              color:              i % 2 === 0 ? "#F4F1EA" : "transparent",
              WebkitTextStroke:   i % 2 !== 0 ? `1.5px ${GOLD_DIM}` : "none",
              opacity: 0,
            }}>
              {l}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <div ref={subtitleRef} style={{ opacity: 0, marginBottom: "clamp(0.75rem,2vh,1.6rem)" }}>
          <p style={{ color: GOLD_DIM, fontSize: "0.52rem", letterSpacing: "0.42em", textTransform: "uppercase", marginBottom: "0.45rem" }}>
            STORE · MOROCCO
          </p>
          <p style={{ color: "rgba(244,241,234,0.52)", fontSize: "clamp(0.76rem,1.2vw,0.9rem)", lineHeight: 1.72, maxWidth: 440 }}>
            Premium decorative wooden katanas. Free delivery across Morocco. Cash on delivery.
          </p>
        </div>

        {/* Stats */}
        <div ref={statsRef} style={{ opacity: 0, display: "flex", gap: "clamp(1rem,3.5vw,2.8rem)", alignItems: "center", flexWrap: "wrap", marginBottom: "clamp(0.75rem,2vh,1.6rem)" }}>
          {[["103", "CM · LENGTH"], ["1,399", "DH · PRICE"], ["FREE", "DELIVERY"], ["24H–48H", "NATIONWIDE"]].map(([v, l]) => (
            <div key={l}>
              <p className="font-heading" style={{ fontSize: "clamp(1rem,2vw,1.5rem)", color: GOLD, lineHeight: 1 }}>{v}</p>
              <p style={{ fontSize: "0.36rem", letterSpacing: "0.22em", color: "rgba(185,154,91,0.42)", textTransform: "uppercase", marginTop: 4 }}>{l}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div ref={ctaRef} style={{ opacity: 0, display: "flex", gap: 10 }}>
          <Link href="/catalogue" onClick={(e) => e.stopPropagation()}
            style={{ display: "inline-flex", alignItems: "center", height: 48, padding: "0 26px", borderRadius: 8, backgroundColor: GOLD, color: "#050505", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none" }}>
            ORDER NOW
          </Link>
          <Link href="/catalogue" onClick={(e) => e.stopPropagation()}
            style={{ display: "inline-flex", alignItems: "center", height: 48, padding: "0 22px", borderRadius: 8, border: `1px solid ${GOLD_FAINT}`, color: GOLD_DIM, fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none" }}>
            EXPLORE ALL
          </Link>
        </div>
      </div>

      {/* Bottom marquee */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 36, borderTop: "1px solid rgba(185,154,91,0.1)", overflow: "hidden", zIndex: 20, display: "flex", alignItems: "center" }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, ease: "linear", repeat: Infinity }}
          style={{ display: "flex", whiteSpace: "nowrap" }}>
          {[...Array(4)].map((_, i) => (
            <span key={i} style={{ color: "rgba(185,154,91,0.38)", fontSize: "0.42rem", letterSpacing: "0.32em", textTransform: "uppercase", paddingRight: "2rem" }}>
              {MARQUEE}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO 4 — MANIFEST
   Editorial · cream background · diagonal black band right
   · GSAP word drop-in · marquee tape · white dragon katana
══════════════════════════════════════════════════════════════ */
function HeroManifest() {
  const wordsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".mf-word",
        { y: 90, opacity: 0, skewY: 5 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.1, ease: "expo.out", stagger: 0.11, delay: 0.15 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", backgroundColor: "#F4EFE3" }}>

      {/* Diagonal black panel — right side */}
      <div aria-hidden style={{
        position: "absolute", top: "-15%", right: "-8%",
        width: "52%", height: "130%",
        backgroundColor: "#0A0A0A",
        transform: "skewX(-7deg)",
        zIndex: 1,
      }} />

      {/* White Dragon katana on dark side */}
      <motion.div
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.55, ease: "easeOut" }}
        style={{
          position: "absolute", right: "clamp(-2rem,1%,3rem)", top: "50%",
          transform: "translateY(-50%)", width: "36%", maxWidth: 400, zIndex: 3,
        }}>
        <div style={{
          backgroundImage: "url(/images/hero/hero-white-desktop.png)",
          backgroundSize: "contain", backgroundPosition: "center",
          backgroundRepeat: "no-repeat", aspectRatio: "0.65 / 1", opacity: 0.82,
        }} />
      </motion.div>

      {/* Marquee tape — horizontal band */}
      <div style={{
        position: "absolute", top: "clamp(3.2rem,7vh,5.5rem)", left: 0, right: 0,
        height: 36, backgroundColor: "#0A0A0A", zIndex: 5,
        display: "flex", alignItems: "center", overflow: "hidden",
      }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          style={{ display: "flex", whiteSpace: "nowrap" }}>
          {[...Array(4)].map((_, i) => (
            <span key={i} style={{ color: "rgba(185,154,91,0.88)", fontSize: "0.42rem", letterSpacing: "0.32em", textTransform: "uppercase", paddingRight: "2rem" }}>
              {MARQUEE}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Left text content */}
      <div style={{
        position: "relative", zIndex: 10, height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 clamp(1.5rem,5vw,4rem)",
        maxWidth: "clamp(280px, 56%, 600px)",
      }}>
        {/* Big staggered words */}
        <div ref={wordsRef} style={{ marginBottom: "clamp(1rem,2.5vh,2rem)" }}>
          {["THE", "DRAGON", "COLLECTION"].map((word) => (
            <div key={word} style={{ overflow: "hidden" }}>
              <div className="mf-word font-heading" style={{
                display: "block", lineHeight: 0.87,
                fontSize: "clamp(2.4rem,7vw,6.5rem)",
                letterSpacing: "-0.01em", color: "#0A0A0A",
                opacity: 0, marginBottom: "0.04em",
              }}>
                {word}
              </div>
            </div>
          ))}
        </div>

        {/* Arabic + Japanese */}
        <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.85 }}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.1rem" }}>
          <p className="arabic-kicker" style={{ fontSize: "clamp(1rem,1.8vw,1.4rem)", color: "rgba(185,154,91,0.9)" }}>التنين الأبيض</p>
          <div style={{ height: 1, width: 24, backgroundColor: "rgba(185,154,91,0.4)" }} />
          <p style={{ color: "rgba(185,154,91,0.65)", fontSize: "0.48rem", letterSpacing: "0.3em" }}>白い龍</p>
        </motion.div>

        {/* Description */}
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1 }}
          style={{ color: "rgba(60,40,18,0.68)", fontSize: "clamp(0.76rem,1.2vw,0.9rem)", lineHeight: 1.72, maxWidth: 400, marginBottom: "1.75rem" }}>
          Premium decorative wooden katanas for collectors, anime lovers, and bold room decoration. Free delivery across Morocco.
        </motion.p>

        {/* Price + CTAs */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 1.15 }}
          style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span className="font-heading" style={{ fontSize: "clamp(1.5rem,2.6vw,2rem)", color: "#0A0A0A" }}>1,399</span>
            <span style={{ color: "rgba(185,154,91,0.82)", fontSize: "0.52rem", letterSpacing: "0.18em" }}>DH</span>
          </div>
          <Link href="/catalogue" onClick={(e) => e.stopPropagation()}
            style={{ display: "inline-flex", alignItems: "center", height: 48, padding: "0 26px", borderRadius: 8, backgroundColor: "#0A0A0A", color: "#F4EFE3", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none" }}>
            ORDER NOW
          </Link>
          <Link href="/product/white-dragon" onClick={(e) => e.stopPropagation()}
            style={{ display: "inline-flex", alignItems: "center", height: 48, padding: "0 22px", borderRadius: 8, border: "1px solid rgba(60,40,18,0.28)", color: "rgba(60,40,18,0.75)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none" }}>
            VIEW DETAILS
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SHOWCASE WRAPPER
══════════════════════════════════════════════════════════════ */
const HEROES = [
  { id: 0, name: "NEBULA",   tag: "01", desc: "Particles · Char reveal",       Component: HeroNebula   },
  { id: 1, name: "DUALITY",  tag: "02", desc: "Split screen · GSAP hover",     Component: HeroDuality  },
  { id: 2, name: "KINETIC",  tag: "03", desc: "Typography explosion · Marquee", Component: HeroKinetic  },
  { id: 3, name: "MANIFEST", tag: "04", desc: "Editorial · Bold type",          Component: HeroManifest },
];

const slideVariants = {
  enter:  (d: number) => ({ x: d > 0 ?  "100%" : "-100%", opacity: 0 }),
  center:               ({  x: 0,                           opacity: 1 }),
  exit:   (d: number) => ({ x: d > 0 ? "-100%" :  "100%", opacity: 0 }),
};

export default function HeroShowcase() {
  const [active,    setActive]    = useState(0);
  const [direction, setDirection] = useState(1);

  function go(next: number) {
    if (next === active) return;
    setDirection(next > active ? 1 : -1);
    setActive(next);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown")
        setActive(a => { const n = Math.min(a + 1, HEROES.length - 1); setDirection(n > a ? 1 : -1); return n; });
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")
        setActive(a => { const n = Math.max(a - 1, 0); setDirection(n < a ? -1 : 1); return n; });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hero = HEROES[active];

  return (
    /* Fixed overlay — covers everything including the site navbar */
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", flexDirection: "column", backgroundColor: "#050505" }}>

      {/* ── Hero display ── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0 }}
          >
            <hero.Component />
          </motion.div>
        </AnimatePresence>

        {/* Side arrows — desktop */}
        <button
          onClick={() => go(active - 1)} disabled={active === 0}
          style={{
            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
            zIndex: 30, width: 44, height: 44, borderRadius: "50%",
            border: "1px solid rgba(185,154,91,0.3)", backgroundColor: "rgba(5,5,5,0.55)",
            backdropFilter: "blur(8px)", color: active === 0 ? "rgba(185,154,91,0.2)" : GOLD_DIM,
            fontSize: "1.1rem", cursor: active === 0 ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s",
          }}>←</button>
        <button
          onClick={() => go(active + 1)} disabled={active === HEROES.length - 1}
          style={{
            position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
            zIndex: 30, width: 44, height: 44, borderRadius: "50%",
            border: "1px solid rgba(185,154,91,0.3)", backgroundColor: "rgba(5,5,5,0.55)",
            backdropFilter: "blur(8px)", color: active === HEROES.length - 1 ? "rgba(185,154,91,0.2)" : GOLD_DIM,
            fontSize: "1.1rem", cursor: active === HEROES.length - 1 ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s",
          }}>→</button>

        {/* Top-right: design name badge */}
        <div style={{ position: "absolute", top: 16, right: 16, zIndex: 30, display: "flex", alignItems: "center", gap: 8, backgroundColor: "rgba(5,5,5,0.6)", backdropFilter: "blur(10px)", border: "1px solid rgba(185,154,91,0.22)", borderRadius: 24, padding: "6px 14px" }}>
          <span style={{ color: GOLD_DIM, fontSize: "0.42rem", letterSpacing: "0.28em" }}>
            {hero.tag} — {hero.name}
          </span>
        </div>

        {/* Keyboard hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} transition={{ delay: 2, duration: 0.8 }}
          style={{ position: "absolute", top: 16, left: 16, zIndex: 30, color: "rgba(185,154,91,0.5)", fontSize: "0.38rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          ← → NAVIGATE
        </motion.div>
      </div>

      {/* ── Bottom navigation bar ── */}
      <div style={{
        height: 68, backgroundColor: "#080808",
        borderTop: "1px solid rgba(185,154,91,0.12)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(1rem,3vw,2rem)", flexShrink: 0, zIndex: 50, gap: 12,
      }}>

        {/* Left: current hero name (animated) */}
        <div style={{ minWidth: 120, display: "none" }} className="sm:block">
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28 }}>
              <p style={{ color: GOLD_DIM, fontSize: "0.5rem", letterSpacing: "0.28em", textTransform: "uppercase" }}>{hero.tag} — {hero.name}</p>
              <p style={{ color: "rgba(185,154,91,0.38)", fontSize: "0.36rem", letterSpacing: "0.16em", marginTop: 2 }}>{hero.desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Center: pill indicators */}
        <div style={{ display: "flex", gap: "clamp(0.5rem,2vw,1rem)", alignItems: "center" }}>
          {HEROES.map((h, i) => (
            <button key={h.id} onClick={() => go(i)} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer", padding: "4px 6px",
              opacity: i === active ? 1 : 0.38, transition: "opacity .25s",
            }}>
              <div style={{
                width: i === active ? 32 : 20, height: 2, borderRadius: 1,
                backgroundColor: i === active ? GOLD : "rgba(185,154,91,0.55)",
                transition: "all .3s",
              }} />
              <span style={{ fontSize: "0.38rem", letterSpacing: "0.2em", textTransform: "uppercase", color: i === active ? GOLD_DIM : "rgba(185,154,91,0.45)" }}>
                {h.name}
              </span>
            </button>
          ))}
        </div>

        {/* Right: Choose CTA + back to site */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", height: 36, padding: "0 14px", borderRadius: 6, border: "1px solid rgba(185,154,91,0.22)", color: "rgba(185,154,91,0.5)", fontSize: "0.42rem", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", whiteSpace: "nowrap" }}>
            ← BACK
          </Link>
          <div style={{
            display: "inline-flex", alignItems: "center", height: 36, padding: "0 16px",
            borderRadius: 6, backgroundColor: GOLD, color: "#050505",
            fontSize: "0.44rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700,
            whiteSpace: "nowrap",
          }}>
            ✓ SELECTED: {hero.name}
          </div>
        </div>
      </div>
    </div>
  );
}
