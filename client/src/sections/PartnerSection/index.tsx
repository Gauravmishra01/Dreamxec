import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────
   ACCORDION ITEM
───────────────────────────────────────── */
function AccordionItem({ index, partner, isOpen, onToggle }) {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  const accents = ["#FF7F00", "#003262", "#0B9C2C", "#FF7F00", "#003262", "#0B9C2C"];
  const accent = accents[index % accents.length];

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  // Strip "Q: " / "Q. " prefix from name, and "A: " / "A. " from category
  const question = partner.name.replace(/^Q[:.]\s*/i, "");
  const answer   = partner.category.replace(/^A[:.]\s*/i, "");

  return (
    <div
      style={{
        background: "#fff",
        border: "3px solid #003366",
        boxShadow: isOpen ? `5px 5px 0 ${accent}` : "3px 3px 0 #003366",
        marginBottom: "0.75rem",
        transition: "box-shadow 0.15s",
      }}
    >
      {/* top accent bar — shows on open */}
      <div style={{ height: 4, background: isOpen ? accent : "transparent", transition: "background 0.2s" }} />

      {/* ── QUESTION ROW ── */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "0.85rem",
          padding: "1rem 1.25rem",
          background: isOpen ? "#fff7ed" : "#fff",
          border: "none",
          borderBottom: isOpen ? "3px solid #003366" : "3px solid transparent",
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.15s, border-color 0.15s",
          fontFamily: "inherit",
        }}
      >
        {/* Number badge */}
        <span style={{
          flexShrink: 0,
          width: 34, height: 34,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: isOpen ? accent : "#003366",
          color: "#fff",
          fontSize: "0.7rem", fontWeight: 900,
          border: "3px solid #003366",
          transition: "background 0.15s",
        }}>
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Q badge */}
        <span style={{
          flexShrink: 0,
          fontSize: "0.58rem", fontWeight: 900,
          color: "#fff", padding: "0.12rem 0.4rem",
          background: accent, border: "2px solid #003366",
          textTransform: "uppercase", letterSpacing: 2,
        }}>Q</span>

        {/* Vector thumbnail — visible always */}
        <img
          src={partner.logo}
          alt=""
          style={{
            width: 38, height: 38,
            objectFit: "contain",
            flexShrink: 0,
            border: `2px solid ${isOpen ? accent : "#003366"}`,
            background: "#fff7ed",
            padding: 3,
            transition: "border-color 0.15s",
          }}
        />

        {/* Question text */}
        <span style={{
          flex: 1,
          fontSize: "clamp(0.88rem, 1.6vw, 1rem)",
          fontWeight: 900,
          color: "#003366",
          textTransform: "uppercase",
          letterSpacing: "-0.3px",
          lineHeight: 1.35,
        }}>
          {question}
        </span>

        {/* Corner accent decoration */}
        <span style={{
          flexShrink: 0,
          width: 0, height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: isOpen ? `10px solid ${accent}` : "none",
          borderBottom: isOpen ? "none" : `10px solid #003366`,
          transition: "border 0.2s",
        }} />

        {/* Toggle + */}
        <span style={{
          flexShrink: 0,
          width: 30, height: 30,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: isOpen ? accent : "#fff7ed",
          border: "3px solid #003366",
          fontSize: "1.1rem", fontWeight: 900,
          color: "#003366",
          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 0.25s cubic-bezier(.16,1,.3,1), background 0.15s",
        }}>
          +
        </span>
      </button>

      {/* ── ANSWER — animated height ── */}
      <div style={{ overflow: "hidden", height, transition: "height 0.35s cubic-bezier(.16,1,.3,1)" }}>
        <div ref={bodyRef}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1.1rem 1.25rem" }}>
            {/* A badge */}
            <span style={{
              flexShrink: 0,
              fontSize: "0.58rem", fontWeight: 900,
              color: "#fff", padding: "0.12rem 0.4rem",
              background: "#003366", border: "2px solid #003366",
              textTransform: "uppercase", letterSpacing: 2,
              marginTop: "0.2rem",
            }}>A</span>

            {/* Vector — larger in answer */}
            <img
              src={partner.logo}
              alt=""
              style={{
                width: 56, height: 56,
                objectFit: "contain",
                flexShrink: 0,
                border: `3px solid ${accent}`,
                background: "#fff7ed",
                padding: 4,
              }}
            />

            <p style={{
              fontSize: "clamp(0.9rem, 1.6vw, 1.05rem)",
              fontWeight: 600,
              color: "rgba(0,51,102,0.72)",
              lineHeight: 1.8,
              textAlign: "justify",
              margin: 0,
            }}>
              {answer}
            </p>
          </div>
          {/* bottom accent bar */}
          <div style={{ height: 5, background: accent }} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export const PartnersSection = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const partners = [
    {
      name: "Q: Is my donation tax-deductible? (Corporate/Foundation)",
      logo: "https://res.cloudinary.com/dvqeeun29/image/upload/v1767734236/23_sqrtii.png",
      category: "A: Yes! 80G certificate auto-generated. 50% deduction.",
    },
    {
      name: "Q: Can I donate anonymously?",
      logo: "https://res.cloudinary.com/dvqeeun29/image/upload/v1767734218/22_uadpdn.png",
      category: "A: Yes, you can choose to remain anonymous when making a donation.",
    },
    {
      name: "Q: What's the minimum pledge amount?",
      logo: "https://res.cloudinary.com/dvqeeun29/image/upload/v1767734249/24_ikcg3l.png",
      category: "A: ₹100. Even small amounts add up and show the team they have community support.",
    },
    {
      name: "Q: What if the project fails?",
      logo: "https://res.cloudinary.com/dvqeeun29/image/upload/v1767734189/21_apvr2t.png",
      category: "A: Rare (95% completion rate). If it happens, we transparently share reasons. Funds already used can't be refunded, but unused funds can be redirected.",
    },
    {
      name: "Q. What is a Donor Opportunity?",
      logo: "https://res.cloudinary.com/dvqeeun29/image/upload/v1767734256/25_x3uyod.png",
      category: "A. A Donor Opportunity is a post created by a donor that students can apply to, such as internships, scholarships, projects, or mentorships.",
    },
    {
      name: "Q: How do I know my impact is real?",
      logo: "https://res.cloudinary.com/dvqeeun29/image/upload/v1767734263/26_wedmyg.png",
      category: "A: We track outcomes through 6-month, 1-year, and 3-year follow-ups. You receive clear impact reports on career outcomes, patents filed, and real-world impact.",
    },
  ];

  const handleGetStarted = () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (!user) navigate("/auth");
    else if (user.role === "DONOR") navigate("/donor/dashboard");
    else navigate("/dashboard");
  };

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="relative py-14 sm:py-20 px-4 overflow-hidden">
      <div className="relative max-w-7xl mx-auto">

        {/* ── HEADER (unchanged) ── */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white bg-[#003366] border-2 border-[#003366]">
              ★ DreamXec At Your Service
            </span>
          </div>

          <h2 className="font-black leading-tight mb-3">
            <span className="block text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-dreamxec-navy uppercase tracking-tight">
              Frequently Asked
            </span>

            <span className="block mt-2">
              <span className="relative inline-block">
                <span className="absolute inset-0 translate-x-[6px] translate-y-[6px] bg-[#0B9C2C]" />
                <span className="relative z-10 inline-block px-5 py-1 text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white font-black uppercase tracking-tight bg-[#003366] border-[3px] border-[#003366]">
                  Questions
                </span>
              </span>
            </span>
          </h2>

          <p className="inline-block mt-5 px-4 py-2 text-xs sm:text-sm md:text-base font-black text-dreamxec-navy uppercase tracking-wide border-2 border-dashed border-[#003366] bg-[#fff7ed]">
            Everything you need to know — honest, transparent, no fluff.
          </p>
        </div>

        {/* ── ACCORDION (replaces Swiper) ── */}
        <div className="mb-14">
          {partners.map((partner, index) => (
            <AccordionItem
              key={index}
              index={index}
              partner={partner}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
            />
          ))}
        </div>

      </div>
    </section>
  );
};