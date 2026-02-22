export const ChartIcon = ({ className = "w-12 h-12" }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hand-drawn growth chart with oil pastel style */}
      <g>
        {/* Chart frame */}
        <rect
          x="15"
          y="15"
          width="70"
          height="70"
          fill="#FFFFFF"
          stroke="#003366"
          strokeWidth="4"
          rx="3"
        />
        
        {/* Grid lines */}
        <g stroke="#003366" strokeWidth="1" opacity="0.2">
          <line x1="15" y1="35" x2="85" y2="35" />
          <line x1="15" y1="50" x2="85" y2="50" />
          <line x1="15" y1="65" x2="85" y2="65" />
          <line x1="30" y1="15" x2="30" y2="85" />
          <line x1="50" y1="15" x2="50" y2="85" />
          <line x1="70" y1="15" x2="70" y2="85" />
        </g>
        
        {/* Rising bars - showing growth */}
        <rect x="25" y="60" width="12" height="20" fill="#FF9933" stroke="#003366" strokeWidth="2" />
        <rect x="42" y="50" width="12" height="30" fill="#138808" stroke="#003366" strokeWidth="2" />
        <rect x="59" y="35" width="12" height="45" fill="#FF9933" stroke="#003366" strokeWidth="2" />
        
        {/* Trend line */}
        <path
          d="M 25 65 L 48 53 L 65 35"
          stroke="#003366"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Arrow pointing up */}
        <path
          d="M 65 35 L 60 40 M 65 35 L 70 40"
          stroke="#003366"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Success star */}
        <path
          d="M 75 20 L 76 23 L 79 23 L 77 25 L 78 28 L 75 26 L 72 28 L 73 25 L 71 23 L 74 23 Z"
          fill="#FF9933"
          stroke="#003366"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
};
