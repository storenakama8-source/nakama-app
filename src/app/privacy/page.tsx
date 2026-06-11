"use client";

import { motion, type Variants } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { PageShell } from "@/components/shared/PageShell";
import { SectionHeader } from "@/components/shared/SectionHeader";

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: "When you place an order through our website or contact form, we collect your name, phone number (WhatsApp), and city. We do not collect payment information — all transactions are cash on delivery.",
  },
  {
    title: "2. How We Use Your Information",
    body: "Your personal data is used solely to process and confirm your order, coordinate delivery, and respond to your inquiries. We do not use your data for advertising or sell it to third parties.",
  },
  {
    title: "3. WhatsApp Communication",
    body: "Order details submitted through our contact form are transferred to WhatsApp to complete your purchase. By using this method, you agree that your order information will be processed via WhatsApp.",
  },
  {
    title: "4. Data Retention",
    body: "We retain your order information for as long as necessary to fulfil your purchase and comply with any legal obligations. You may request deletion of your data at any time by contacting us.",
  },
  {
    title: "5. Cookies",
    body: "Our website uses minimal, essential cookies to remember your theme preference (dark or light mode). We do not use tracking cookies or third-party analytics cookies.",
  },
  {
    title: "6. Third-Party Services",
    body: "We use WhatsApp for order communication and Instagram for marketing. These platforms have their own privacy policies which govern their data practices. We are not responsible for how these platforms handle your data.",
  },
  {
    title: "7. Your Rights",
    body: "Under Moroccan Law No. 09-08 on the protection of individuals with regard to the processing of personal data, you have the right to access, correct, or request deletion of your personal data. Contact us via WhatsApp to exercise these rights.",
  },
  {
    title: "8. Security",
    body: "We take reasonable measures to protect your personal information. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.",
  },
  {
    title: "9. Contact",
    body: "For any questions about this privacy policy or your personal data, please contact us via WhatsApp or Instagram (@nakama_store_morocco).",
  },
];

export default function PrivacyPage() {
  const { theme } = useTheme();
  const isBlack = theme === "black-dragon";
  const glassBg = isBlack ? "rgba(14,14,14,0.78)" : "rgba(248,243,233,0.82)";

  return (
    <PageShell>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          minHeight: "40svh",
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
          backgroundSize: "cover", backgroundPosition: "center", opacity: 0.10,
        }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, backgroundColor: "var(--bg)", opacity: 0.80 }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <SectionHeader
            ar="سياسة الخصوصية"
            ja="プライバシー"
            en="PRIVACY POLICY"
            sub="How we collect, use, and protect your personal information."
            size="lg"
          />
          <p style={{ color: "var(--text-muted)", fontSize: "0.72rem", opacity: 0.6, marginTop: "0.75rem" }}>
            Last updated: June 2026 · Nakama Store Morocco
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: "clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)", maxWidth: 820, margin: "0 auto" }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {SECTIONS.map(({ title, body }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              style={{
                background: glassBg,
                border: "1px solid rgba(185,154,91,0.18)",
                borderRadius: 12,
                padding: "1.5rem 1.75rem",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <p style={{
                color: "var(--gold)",
                fontSize: "0.62rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "0.65rem",
                opacity: 0.9,
              }}>
                {title}
              </p>
              <p style={{
                color: "var(--text-muted)",
                fontSize: "0.88rem",
                lineHeight: 1.7,
              }}>
                {body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <div style={{
          marginTop: "2.5rem",
          padding: "1.25rem",
          borderRadius: 8,
          border: "1px solid rgba(185,154,91,0.14)",
          backgroundColor: isBlack ? "rgba(185,154,91,0.04)" : "rgba(185,154,91,0.06)",
          textAlign: "center",
        }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", lineHeight: 1.65 }}>
            Nakama Store Morocco is a Moroccan business selling decorative wooden katanas for display purposes only.
            Our products are not weapons and are intended solely for room decoration and collection.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
