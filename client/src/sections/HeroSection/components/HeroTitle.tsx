import { useNavigate } from "react-router-dom";
import TypingEffect from "../../../components/TypingEffect";

export const HeroTitle = ({ user }) => {
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const role = user?.role; // "STUDENT" | "DONOR"

  const pills = [
    {
      label: "🤝 Mentorship",
      onClick: () => navigate("/contact"),
    },
    {
      label:
        role === "DONOR"
          ? "🌱 Create Impact"
          : "💡 Student Innovation",
      onClick: () => {
        if (!isLoggedIn) navigate("/login");
        else if (role === "STUDENT") navigate("/dashboard");
        else if (role === "DONOR") navigate("/campaigns");
      },
    },
    {
      label: "🚀 Opportunity",
      onClick: () => {
        if (!isLoggedIn) navigate("/login");
        else if (role === "STUDENT") navigate("/projects");
        else if (role === "DONOR") navigate("/donor/dashboard");
      },
    },
  ];

  return (
    <div className="relative self-center flex flex-col w-full mt-[10%] mb-[11.8%] md:mb-[5.5%]">

      {/* Title */}
      <div className="text-center px-4">
        <h1 className="text-dreamxec-berkeley-blue text-4xl md:text-7xl font-popper font-extrabold leading-tight mb-4">
          <span className="block mb-3">
            Igniting India's Next Generation of
          </span>
          <span className="block relative">
            <span className="text-dreamxec-red-800">
              <TypingEffect />
            </span>
            <div className="absolute -bottom-2 left-0 right-0 h-3 bg-saffron-pastel opacity-30" />
          </span>
        </h1>

        <p className="mt-10 text-dreamxec-gray-700 text-lg md:text-2xl font-semibold">
          Invest in the Minds That Will Define Our Tomorrow
        </p>
      </div>

      {/* Pills */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-6 mt-10 px-4">
        {pills.map((pill, index) => (
          <button
            key={index}
            onClick={pill.onClick}
            className="card-pastel px-6 py-3 rounded-full transition-transform hover:scale-105 focus:outline-none"
          >
            <span className="text-dreamxec-navy text-sm md:text-lg font-extrabold whitespace-nowrap">
              {pill.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
