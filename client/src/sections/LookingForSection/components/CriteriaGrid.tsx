export const CriteriaGrid = () => {
  const criteria = [
    {
      title: "Merit First",
      text: "Ideas are judged by potential, not pedigree. Whether you're from IIT or a tier-3 college, if your project has merit, you get funded.",
      icon: "/assets/icon-pack/DX-ILLUSTRATION-PACK/3.svg",
    },
    {
      title: "Transparency",
      text: "Every rupee is tracked. Every milestone is public. No hidden fees, no opacity—just honest impact.",
      icon: "/assets/icon-pack/DX-ILLUSTRATION-PACK/4.svg",
    },
    {
      title: "Gurukul Spirit",
      text: "Like ancient Gurukuls where teachers and students co-created knowledge, DreamXec connects generations alumni mentoring students, corporates enabling research.",
      icon: "/assets/icon-pack/DX-ILLUSTRATION-PACK/5.svg",
    },
    {
      title: "Atmanirbhar Bharat",
      text: "We're building India's self-reliance in innovation. Not waiting for foreign funding, not copying Silicon Valley—creating our own model rooted in Indian context.",
      icon: "/assets/icon-pack/DX-ILLUSTRATION-PACK/6.svg",
    },
    {
      title: "UN SDG Alignment",
      text: "Every project must contribute to at least one Sustainable Development Goal. Innovation for profit AND purpose.",
      icon: "/assets/icon-pack/DX-ILLUSTRATION-PACK/7.svg",
    },
    {
      title: "Community First",
      text: "Students aren't 'users,' donors aren't 'customers'—we're all stakeholders in India's future.",
      icon: "/assets/icon-pack/DX-ILLUSTRATION-PACK/20.svg",
    },
  ];

  return (
    <div className="w-full px-4">

      <div className="grid grid-cols-1 md:grid-cols-2 mt-[10%] gap-8 max-w-6xl mx-auto">
        <span className="col-span-1 md:col-span-2 text-center text-dreamxec-berkeley-blue text-4xl md:text-7xl font-extrabold mb-8">
          <h2>Our Values and Principles</h2>
          <h4 className="text-dreamxec-gray-700 text-base md:text-lg font-sans font-semibold mt-2">
            We seek students and young professionals whose projects embody these principles:        
          </h4>
        </span>
        {criteria.map((item, index) => (
          <div
            key={index}
            style={{ animationDelay: `${index * 100}ms` }}
            className="card-glass animate-fade-in flex items-center p-6"
          >
            {/* Left Side: Text Content */}
            <div className="w-2/3 pr-4">
              <h2 className="text-2xl font-bold text-dreamxec-gray-250 mb-2">{item.title}</h2>
              <p className="text-dreamxec-gray-600 text-sm font-semibold leading-relaxed">{item.text}</p>
            </div>

            {/* Right Side: SVG Icon */}
            <div className="w-1/3 flex justify-center items-center">
              <img
                src={item.icon}
                alt={`${item.title} Icon`}
                className="h-30 w-30 opacity-100"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
