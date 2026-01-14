export const RopeDivider = () => {
  return (
    <div className="w-full flex justify-center ">
      <svg
        width="100%"
        height="24"
        viewBox="0 0 1200 24"
        preserveAspectRatio="none"
        className="max-w-5xl"
      >
        <path
          d="M0 12 
             C 100 6, 200 18, 300 12
             S 500 6, 600 12
             S 800 18, 900 12
             S 1100 6, 1200 12"
          fill="none"
          stroke="#0B3C5D"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="10 8"
        />
      </svg>
    </div>
  );
};
