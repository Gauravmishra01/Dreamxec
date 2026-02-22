import { useNavigate } from "react-router-dom";
import TypingEffect from "../../../components/TypingEffect";

export const HeroTitle = ({ user }) => {
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const role = user?.role;

  const pills = [
    {
      label: "🤝 Mentorship",
      emoji: "🤝",
      text: "Mentorship",
      onClick: () => navigate("/contact"),
      shadow: "#FF7F00",
      bg: "#fff",
    },
    {
      label: role === "DONOR" ? "🌱 Create Impact" : "💡 Student Innovation",
      emoji: role === "DONOR" ? "🌱" : "💡",
      text: role === "DONOR" ? "Create Impact" : "Student Innovation",
      onClick: () => {
        if (!isLoggedIn) navigate("/login");
        else if (role === "STUDENT") navigate("/dashboard");
        else if (role === "DONOR") navigate("/campaigns");
      },
      shadow: "#0B9C2C",
      bg: "#fff",
    },
    {
      label: "🚀 Opportunity",
      emoji: "🚀",
      text: "Opportunity",
      onClick: () => {
        if (!isLoggedIn) navigate("/login");
        else if (role === "STUDENT") navigate("/projects");
        else if (role === "DONOR") navigate("/donor/dashboard");
      },
      shadow: "#003366",
      bg: "#fff",
    },
  ];

  return (
    <div className="relative self-center flex flex-col w-full mt-[10%] mb-[11.8%] md:mb-[5.5%]">

      {/* ── TITLE BLOCK ── */}
      <div className="text-center px-4">

        <h1 className="font-black leading-tight mb-4">

          {/* Line 1 — plain navy */}
          <span className="block text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-dreamxec-navy uppercase tracking-tight mb-3 sm:mb-4">
            Igniting India's Next
          </span>

          {/* "Generation of" — highlighted stamp */}
          <span className="block mb-3 sm:mb-4">
            <span className="relative inline-block">
              {/* offset shadow */}
              <span
                className="absolute inset-0 translate-x-[4px] translate-y-[4px] sm:translate-x-[6px] sm:translate-y-[6px]"
                style={{ background: '#FF7F00' }}
                aria-hidden
              />
              <span
                className="relative z-10 inline-block px-3 sm:px-5 py-1 sm:py-1.5 text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white font-black uppercase tracking-tight"
                style={{ background: '#003366', border: '3px solid #003366' }}
              >
                Generation of
              </span>
            </span>
          </span>

          {/* TypingEffect — orange stamp, most dominant */}
          <span className="block relative">
            <span className="relative inline-block">
              {/* big navy shadow */}
              <span
                className="absolute inset-0 translate-x-[5px] translate-y-[5px] sm:translate-x-[8px] sm:translate-y-[8px]"
                style={{ background: '#003366' }}
                aria-hidden
              />
              <span
                className="relative z-10 inline-block px-4 sm:px-6 md:px-8 py-1 sm:py-2 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight"
                style={{
                  background: '#FAF9F6',
                  border: '3px solid #003366',
                  color: '#003366',
                  minWidth: '12ch',
                }}
              >
                <TypingEffect />
              </span>
            </span>
          </span>
        </h1>

        {/* Subheading */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <p
            className="inline-block px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base md:text-lg lg:text-xl font-black text-dreamxec-navy uppercase tracking-wide"
            style={{ border: '2px dashed #003366', background: '#fff7ed' }}
          >
            Invest in the Minds That Will Define Our Tomorrow
          </p>
        </div>
      </div>

      {/* ── PILLS ── */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 mt-8 sm:mt-10 px-4">
        {pills.map((pill, index) => (
          <button
            key={index}
            onClick={pill.onClick}
            className="group relative transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px]"
            style={{
              border: '3px solid #003366',
              boxShadow: `4px 4px 0 ${pill.shadow}`,
              background: pill.bg,
            }}
          >
            <span className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3">
              <span className="text-base sm:text-lg leading-none">{pill.emoji}</span>
              <span className="text-dreamxec-navy font-black text-xs sm:text-sm md:text-base uppercase tracking-widest whitespace-nowrap">
                {pill.text}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};