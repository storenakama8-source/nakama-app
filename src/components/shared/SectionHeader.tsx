"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  ar?: string;
  ja?: string;
  en: string;
  sub?: string;
  center?: boolean;
  size?: "sm" | "md" | "lg";
}

export function SectionHeader({ ar, ja, en, sub, center = true, size = "md" }: SectionHeaderProps) {
  const titleSize =
    size === "lg" ? "clamp(2.5rem,6vw,5.5rem)"
    : size === "sm" ? "clamp(1.5rem,3vw,2.6rem)"
    : "clamp(2rem,4.5vw,4rem)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{ textAlign: center ? "center" : "left" }}
    >
      {ar && (
        <p
          className="arabic-kicker"
          style={{ fontSize: "clamp(1.1rem,2vw,1.6rem)", marginBottom: "0.3rem" }}
        >
          {ar}
        </p>
      )}
      {ja && (
        <p
          style={{
            color: "var(--gold)",
            opacity: 0.68,
            fontSize: "0.76rem",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            marginBottom: "0.8rem",
          }}
        >
          {ja}
        </p>
      )}
      <h1
        className="font-heading uppercase"
        style={{ fontSize: titleSize, lineHeight: 0.92, letterSpacing: "0.02em", color: "var(--text)" }}
      >
        {en}
      </h1>
      {sub && (
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "clamp(0.88rem,1.5vw,1.05rem)",
            lineHeight: 1.65,
            marginTop: "1.25rem",
            maxWidth: center ? "560px" : undefined,
            margin: center ? "1.25rem auto 0" : "1.25rem 0 0",
          }}
        >
          {sub}
        </p>
      )}
    </motion.div>
  );
}
