export const LabFlaskIcon = ({ className = "w-12 h-12" }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hand-drawn lab flask with oil pastel style */}
      <g>
        {/* Flask neck */}
        <rect
          x="42"
          y="15"
          width="16"
          height="25"
          fill="#FFFFFF"
          stroke="#003366"
          strokeWidth="4"
          rx="2"
        />
        
        {/* Flask body - triangular/conical */}
        <path
          d="M 42 40 L 25 75 Q 25 82, 32 85 L 68 85 Q 75 82, 75 75 L 58 40 Z"
          fill="#138808"
          stroke="#003366"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Liquid level */}
        <path
          d="M 35 60 Q 50 58, 65 60 L 68 75 Q 68 78, 65 80 L 35 80 Q 32 78, 32 75 Z"
          fill="#FF9933"
          opacity="0.8"
        />
        
        {/* Bubbles - innovation happening */}
        <circle cx="45" cy="65" r="3" fill="#FFFFFF" opacity="0.7" />
        <circle cx="55" cy="70" r="2.5" fill="#FFFFFF" opacity="0.7" />
        <circle cx="50" cy="58" r="2" fill="#FFFFFF" opacity="0.7" />
        
        {/* Flask opening */}
        <line
          x1="42"
          y1="15"
          x2="58"
          y2="15"
          stroke="#003366"
          strokeWidth="4"
          strokeLinecap="round"
        />
        
        {/* Measurement lines on side */}
        <g stroke="#003366" strokeWidth="2" opacity="0.6">
          <line x1="28" y1="50" x2="33" y2="50" />
          <line x1="28" y1="60" x2="33" y2="60" />
          <line x1="28" y1="70" x2="33" y2="70" />
        </g>
      </g>
    </svg>
  );
};
