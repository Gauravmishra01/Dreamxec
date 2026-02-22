export const StarDecoration = ({ className = "w-8 h-8", color = "#FF9933" }: { className?: string; color?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hand-drawn star decoration */}
      <path
        d="M 25 5 L 28 18 L 42 18 L 31 26 L 35 40 L 25 32 L 15 40 L 19 26 L 8 18 L 22 18 Z"
        fill={color}
        stroke="#003366"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner highlight */}
      <circle cx="25" cy="20" r="3" fill="rgba(255, 255, 255, 0.5)" />
    </svg>
  );
};
