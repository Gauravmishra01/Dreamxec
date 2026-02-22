export const CollaborationIcon = ({ className = "w-12 h-12" }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Three people collaborating - hand-drawn style */}
      <g>
        {/* Person 1 - Left (Saffron) */}
        <g>
          <circle cx="25" cy="30" r="10" fill="#FF9933" stroke="#003366" strokeWidth="3" />
          <path
            d="M 15 50 Q 25 45, 35 50 L 35 70 L 15 70 Z"
            fill="#FF9933"
            stroke="#003366"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </g>
        
        {/* Person 2 - Center (Navy Blue) */}
        <g>
          <circle cx="50" cy="25" r="12" fill="#003366" stroke="#003366" strokeWidth="3" />
          <path
            d="M 38 50 Q 50 42, 62 50 L 62 75 L 38 75 Z"
            fill="#FFFFFF"
            stroke="#003366"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </g>
        
        {/* Person 3 - Right (Green) */}
        <g>
          <circle cx="75" cy="30" r="10" fill="#138808" stroke="#003366" strokeWidth="3" />
          <path
            d="M 65 50 Q 75 45, 85 50 L 85 70 L 65 70 Z"
            fill="#138808"
            stroke="#003366"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </g>
        
        {/* Connection lines showing collaboration */}
        <g stroke="#FF9933" strokeWidth="3" strokeDasharray="4 4" opacity="0.7">
          <line x1="35" y1="55" x2="45" y2="52" />
          <line x1="55" y1="52" x2="65" y2="55" />
        </g>
        
        {/* Shared idea/goal in center top */}
        <circle cx="50" cy="10" r="6" fill="#FF9933" stroke="#003366" strokeWidth="2" />
      </g>
    </svg>
  );
};
