export const LightBulbIcon = ({ className = "w-12 h-12" }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hand-drawn light bulb with oil pastel style */}
      <g>
        {/* Bulb outer stroke - thick outline */}
        <ellipse
          cx="50"
          cy="40"
          rx="22"
          ry="25"
          fill="#FF9933"
          stroke="#003366"
          strokeWidth="4"
          strokeLinecap="round"
        />
        
        {/* Inner highlight */}
        <ellipse
          cx="45"
          cy="35"
          rx="8"
          ry="10"
          fill="rgba(255, 255, 255, 0.6)"
        />
        
        {/* Base of bulb */}
        <rect
          x="42"
          y="62"
          width="16"
          height="8"
          fill="#138808"
          stroke="#003366"
          strokeWidth="3"
          rx="2"
        />
        
        {/* Bottom screw thread lines */}
        <line x1="40" y1="72" x2="60" y2="72" stroke="#003366" strokeWidth="3" />
        <line x1="40" y1="76" x2="60" y2="76" stroke="#003366" strokeWidth="3" />
        <line x1="40" y1="80" x2="60" y2="80" stroke="#003366" strokeWidth="3" />
        
        {/* Idea rays - hand-drawn style */}
        <g stroke="#FF9933" strokeWidth="4" strokeLinecap="round">
          <line x1="15" y1="30" x2="25" y2="35" />
          <line x1="20" y1="15" x2="25" y2="25" />
          <line x1="45" y1="10" x2="50" y2="18" />
          <line x1="75" y1="15" x2="70" y2="25" />
          <line x1="85" y1="30" x2="75" y2="35" />
        </g>
      </g>
    </svg>
  );
};
